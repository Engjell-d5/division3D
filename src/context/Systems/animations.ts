import { AbstractMesh, ArcRotateCamera, Camera, EventState, Matrix, Mesh, Ray, Vector3, Animation } from "@babylonjs/core";
import ISystem, { IAnimation, ICustomAnimation, ICutSceneMaster } from "../types";
import { ObjectHelpers } from "../enums";
import { Config } from "../constants";

export const animateStandard = ({ world: w, components: c, entities: e }: ISystem) => async () => {
    const archetypes = w.query.with(c.standardAnimation).execute();
  
    if (archetypes.length <= 0) {
      return null;
    }
  
    for( const archeType of archetypes) {
      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {
        
        const entId = archeType.getEntityIdFromIndex(index);

  
        const animations: Array<IAnimation> = archeType.getColumn(c.standardAnimation)[index];
        
        for(const animation of animations) {
            if(animation.enabled && !animation.created) {
                const anim = new Animation(animation.name, animation.property, animation.fps, animation.animationType, Animation.ANIMATIONLOOPMODE_CYCLE);
                anim.setKeys(animation.keyFrames);
                
                if(w.entityManager.hasComponent(entId, c.camera)) {
                    let entity;

                    entity = w.entityManager.getComponent(entId, c.camera)[index];

                    entity.animations.push(anim);
                    w.scene.beginAnimation(entity, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, false, 1, () => {
                      animation.callback();
                    });
                } else if(w.entityManager.hasComponent(entId, c.mesh)) {
                    let entity;

                    entity = w.entityManager.getComponent(entId, c.mesh)[index];

                    entity.animations.push(anim);
                    w.scene.beginAnimation(entity, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, false, 1, () => {
                      animation.callback();
                    });
                } else if(w.entityManager.hasComponent(entId, c.projectionPlane)) {
                    let projection, overlay;
                    projection = w.entityManager.getComponent(entId, c.projectionPlane).projection[index];
                    overlay = w.entityManager.getComponent(entId, c.projectionPlane).overlay[index];

                    projection.animations.push(anim);
                    overlay.animations.push(anim);

                    w.scene.beginAnimation(projection, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, false, 1, () => {
                      animation.callback();
                    });

                    w.scene.beginAnimation(overlay, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, false, 1, () => {
                      animation.callback();
                    });
                }
                
               

                animation.created = true;

            }
        }
      }
    }
  };

  export const animateCustom = ({ world: w, components: c, entities: e }: ISystem) => async () => {
    const archetypes = w.query.with(c.customAnimation).execute();
  
    if (archetypes.length <= 0) {
      return null;
    }
  
    for( const archeType of archetypes) {
      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {
        
        const entId = archeType.getEntityIdFromIndex(index);

  
        const animations: Array<ICustomAnimation> = archeType.getColumn(c.standardAnimation)[index];
        
        let entity;

        if(w.entityManager.hasComponent(entId, c.glow)) {
            entity = w.entityManager.getComponent(entId, c.glow)[index];
        }

        let animIndex = 0;
        let indexToRemove = -1;
        for(const animation of animations) {
            if(animation.currentFrame < animation.duration)
            {
                entity[animation.property] = ((animation.maxValue as number) - (animation.minValue as number)) * (animation.currentFrame / animation.duration);
                animation.currentFrame += animation.step;
            } else {
                animation.callback();
                indexToRemove = animIndex;
            }
            animIndex += 1;

            if(animIndex == animations.length && indexToRemove != -1)
            {
                animations.splice(indexToRemove, 1);
                indexToRemove = -1;
            }
        }
      }
    }
  };

  export const animationMaster = ({ world: w, components: c, entities: e }: ISystem) => async () => {
    const archetypes = w.query.with(c.cutsceneMaster).execute();
  
    if (archetypes.length <= 0) {
      return null;
    }
  
    for( const archeType of archetypes) {
      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {
        
  
        const cutsceneMaster: ICutSceneMaster = archeType.getColumn(c.cutsceneMaster)[index];
        
      
        for(const cutscene of cutsceneMaster.scenes) {
            if(!cutscene.started && cutscene.startFrame <= cutsceneMaster.currentFrame) {

              let animationComponent;
              if(cutscene.type == 0) {
                if(w.entityManager.hasComponent(cutscene.entity, c.standardAnimation))
                {
                  animationComponent = w.entityManager.getComponent(cutscene.entity, c.standardAnimation)[w.entityManager.getArchTypeId(cutscene.entity)];
                  animationComponent.animations.push_back(cutscene.animation);
                } else {
                  w.entityManager.addComponent(cutscene.entity, c.standardAnimation, [cutscene.animation])
                }
              } else {
                if(w.entityManager.hasComponent(cutscene.entity, c.customAnimation))
                {
                  animationComponent = w.entityManager.getComponent(cutscene.entity, c.customAnimation)[w.entityManager.getArchTypeId(cutscene.entity)];
                  animationComponent.animations.push_back(cutscene.animation);
                } else {
                  w.entityManager.addComponent(cutscene.entity, c.customAnimation, [cutscene.animation])
                }        
              }

              cutscene.started = true;
            }
        }
        cutsceneMaster.currentFrame += 1;
      }
    }
  };