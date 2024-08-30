import { GlowLayer, HemisphericLight, Animation } from "@babylonjs/core";
import ISystem, { IAnimation, ICutSceneMaster } from "../types";
import { Config } from "../constants";

const initCutScene = ({ world: w, components: c, entities: e }: ISystem) => {
  
  const cutscene: ICutSceneMaster = {
    name : "startScene",
    size: 3,
    scenes : [
      {
        entity : e.camera,
        queue: 0,
        animation :  {
          name: "initialCameraMovement",
          fps: 30,
          property: "lowerRadiusLimit",
          enabled: true,
          startFrame: 0,
          created: false,
          loop: false,
          callback: () => {},
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: 0.5,
            },
            {
              frame: 120, 
              value: Config.cameraUpperLimit,
            }, 
          ]
        }
      },
      {
        entity: e.glow,
        queue: 1,
        animation: { step: 2, currentFrame: 0, property: "intensity", minValue: 0, maxValue: 0.5, duration: 120, callback : () => {}, animationMaster: e.animationMaster }
      }
    ]
  }
  
  w.entityManager.addComponent(
    e.animationMaster,
    c.glow,
    glow
  );

};

export default initGlow;
