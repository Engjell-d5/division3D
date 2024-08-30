import { AbstractMesh, ArcRotateCamera, Camera, EventState, Matrix, Mesh, Ray, Vector3, Animation } from "@babylonjs/core";
import ISystem, { IAnimation } from "../types";
import { ObjectHelpers } from "../enums";
import { Config } from "../constants";

export const animate = ({ world: w, components: c, entities: e }: ISystem) => async () => {
    const archetypes = w.query.with(c.animation).execute();
  
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

  
        const animations: Array<IAnimation> = archeType.getColumn(c.animation)[index];
        
        for(const animation of animations) {
            if(animation.enabled && !animation.created) {
                const anim = new Animation(animation.name, animation.property, animation.fps, animation.animationType, Animation.ANIMATIONLOOPMODE_CYCLE);
                anim.setKeys(animation.keyFrames);



                if(w.entityManager.hasComponent(entId, c.camera)) {

                    const camera = w.entityManager.getComponent(entId, c.camera)[index];
                    console.log(camera);
                    camera.animations.push(anim);
                    w.scene.beginAnimation(camera, 0, animation.keyFrames[animation.keyFrames.length - 1].frame, true);

                    console.log("animating", camera.animations);


                }

                animation.created = true;

            }
        }
      }
    }
  };