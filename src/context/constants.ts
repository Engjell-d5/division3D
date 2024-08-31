import { Color3, Color4, ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";
import { IConfig, ILandmark } from "./types";

// const illyriaProp = w.entityManager.create();
//   w.entityManager.addComponent(illyriaProp, c.loadable, {path: "assets/models/illyria.glb"});
//   w.entityManager.addComponent(illyriaProp, c.shadows, { casts: true, receives: true});
//   w.entityManager.addComponent(illyriaProp, c.flat);
//   w.entityManager.addComponent(illyriaProp, c.prop);
//   w.entityManager.addComponent(illyriaProp, c.clickable);
//   w.entityManager.addComponent(illyriaProp, c.position, new Vector3(-2, 0, 2));
//   w.entityManager.addComponent(illyriaProp, c.video, {path: "videos/illyria.webm"});

export const Landmarks : Array<ILandmark> = [
  {
    position: new Vector3(-2, 0, 2),
    path: "assets/models/illyria.glb"
  }
];

export const Config : IConfig = {
    debug : false,
    cellSize: 0.0628,
    blockMovement : false,
    
    cameraScrollSpeed : 0.01,
    cameraLowerLimit : 3,
    cameraUpperLimit : 5,
    cameraLowerAlpha: Math.PI / 2,
    cameraUpperAlpha: Math.PI / 2,
    cameraLowerBeta: Math.PI / 2.5,
    cameraUpperBeta: Math.PI / 2.5,
    cameraPosition: new Vector3(0, 0.2, 0),

    cameraFOV: 1.0,
    ambientLightColor: new Color3(255/255, 0/255, 0/255),
    ambientLightIntensity: 0.2,

    directionalLightIntensity: 1.2,
    
    toneMappingEnabled: true,
    toneMappingType: ImageProcessingConfiguration.TONEMAPPING_ACES,
    exposure: 1.5,
    contrast: 1.5
}
  