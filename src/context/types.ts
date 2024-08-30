import World from "@/ecs/World";
import { StaticComponents } from "./Components";
import { StaticEntities } from "./Entities";
import { Color3, Color4, ImageProcessingConfiguration, Vector, Vector3 } from "@babylonjs/core";

export default interface ISystem {
  world: World;
  components: StaticComponents;
  entities: StaticEntities;
}

export interface ILandmark {
  position: Vector3,
  path: string
}

export interface IAnimation {
  duration: number,
  property: string,
  startValue: unknown,
  endValue: unknown,
  enabled: boolean,
  startTime: number,
  created: boolean
}

export interface IConfig {
  debug: boolean,
  blockMovement: boolean,
  cellSize: number,
  cameraScrollSpeed: number,
  cameraLowerLimit: number,
  cameraUpperLimit: number,
  cameraLowerAlpha: number,
  cameraUpperAlpha: number,
  cameraLowerBeta: number,
  cameraUpperBeta: number,
  cameraPosition: Vector3,

  cameraFOV: number,
  ambientLightColor: Color3,
  ambientLightIntensity: number,

  directionalLightIntensity: number,
  
  toneMappingEnabled: boolean,
  toneMappingType: number,
  exposure: number,
  contrast: number
}
