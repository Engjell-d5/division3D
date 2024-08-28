import { Color3, Color4, ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";
import { IGridDebugColor, IConfig } from "./types";

export const GridHelperColors : IGridDebugColor = {
    0 : new Color4(0.3, 0.3, 0.3, 0.00),
    1 : new Color4(1,0.2,0.2,1.0),
    2 : new Color4(0,0.0,0.2,1.0)
  }

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
    ambientLightColor: new Color3(255/255, 100/255, 0/255),
    ambientLightIntensity: 0.2,
    wallsVisibility: 0.5,
    wallsVisibilityThreshhold: 0.7,
    wallsVisibilityDistance: 3,
    
    toneMappingEnabled: true,
    toneMappingType: ImageProcessingConfiguration.TONEMAPPING_ACES,
    exposure: 1.5,
    contrast: 1.5
}
  