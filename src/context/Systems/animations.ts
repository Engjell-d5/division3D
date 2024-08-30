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
        
        // for(const animation of animations) {
        //     if(animation.enabled && !animation.created) {
        //         const xSlide = new Animation("xSlide", "position", 10, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        //         const keyFrames = []; 

        //         keyFrames.push({
        //             frame: 0,
        //             value: 
        //         });
            
        //         keyFrames.push({
        //             frame: 10,
        //             value: -2
        //         });
            
        //     }
        // }
  
      }
    }
  };