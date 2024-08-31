import { Color3, Color4, ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";
import { IConfig, ILandmark } from "./types";



export const Landmarks : Array<ILandmark> = [
  {
    position: new Vector3(-1, 0, 2),
    path: "assets/models/illyria.glb",
    contentType: 0,
    contentPath: "videos/illyria.webm"
  },
  {
    position: new Vector3(1, 0, 2),
    path: "assets/models/plane.glb",
    contentType: 0,
    contentPath: "videos/tmt.mp4"
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
    contrast: 1.5,

    projectionPlaneWidth :2,
    projectionPlaneHeight: 1
}
  