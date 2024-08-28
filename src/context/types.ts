import World from "@/ecs/World";
import { StaticComponents } from "./Components";
import { StaticEntities } from "./Entities";
import { Color3, Color4, ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";

export default interface ISystem {
  world: World;
  components: StaticComponents;
  entities: StaticEntities;
}

export interface IDimensions {
  width: number,
  height: number,
  depth: number
}

export interface IGridDebugColor {
  [key: number]: Color4;
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
  wallsVisibility: number,
  wallsVisibilityDistance: number,
  wallsVisibilityThreshhold: number,
  toneMappingEnabled: boolean,
  toneMappingType: number,
  exposure: number,
  contrast: number
}
