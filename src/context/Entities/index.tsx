import World from "@/ecs/World";
import { Config } from "../constants";

const initStaticEntities = (world: World) => {
  const entities = {
    camera: world.entityManager.create(),
    ambientLight: world.entityManager.create(),
    directionalLight: world.entityManager.create(),
    pointLight: world.entityManager.create(),
    shadowGenerator: world.entityManager.create(),
    worldGrid: world.entityManager.create(),
    meshGrid: (Config.debug) ? world.entityManager.create() : -1,
    referencePlane: world.entityManager.create(),
  };

  return entities;
};

export type StaticEntities = ReturnType<typeof initStaticEntities>;
export default initStaticEntities;
