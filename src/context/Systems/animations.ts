import { AbstractMesh, ArcRotateCamera, Camera, EventState, Matrix, Mesh, Ray, Vector3, Animation } from "@babylonjs/core";
import ISystem, { IAnimation, ICustomAnimation } from "../types";
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
                
                let entity;
                if(w.entityManager.hasComponent(entId, c.camera)) {
                    entity = w.entityManager.getComponent(entId, c.camera)[index];
                } else if(w.entityManager.hasComponent(entId, c.mesh)) {
                    entity = w.entityManager.getComponent(entId, c.mesh)[index];
                }
                
                entity.animations.push(anim);
                w.scene.beginAnimation(entity, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, false, 1, () => { animation.callback()});

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