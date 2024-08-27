import World from "@/ecs/World";
import { Type } from "@/ecs/utilities/Types";

const initStaticComponents = (world: World) => {
  const components = {
    camera: world.schemaManager.register(Type.Custom),
    position: world.schemaManager.register(Type.Custom),
    light: world.schemaManager.register(Type.Custom),
    shadowGenerator: world.schemaManager.register(Type.Custom),
    mesh: world.schemaManager.register(Type.Custom),
    loadable: world.schemaManager.register({
      path: Type.String,
      position: Type.Custom
    }),
    fileLoadable: world.schemaManager.register({
      file: Type.Custom,
      position: Type.Custom
    }),
    pickable: world.schemaManager.register(Type.Tag),
    picked: world.schemaManager.register(Type.Tag),
    grabbed: world.schemaManager.register({ status : Type.Int8}),
    grid: world.schemaManager.register(Type.Custom),
    meshGrid: world.schemaManager.register(Type.Custom),
    room: world.schemaManager.register({cellSize: Type.Float32}),
    dimensions: world.schemaManager.register({ width: Type.Float32, depth: Type.Float32, height: Type.Float32 }),
    boundingBox :world.schemaManager.register({minX : Type.Float32, minY: Type.Float32, minZ: Type.Float32, maxX : Type.Float32, maxY: Type.Float32, maxZ: Type.Float32}), 
    onGrid: world.schemaManager.register(Type.Tag),
    highlight: world.schemaManager.register(Type.Custom),
    rotation: world.schemaManager.register({angle: Type.Int32, orientation: Type.Int8}),
    invisibleWalls : world.schemaManager.register(Type.Custom),
    furniture : world.schemaManager.register(Type.Tag)
  };

  return components;
};

export type StaticComponents = ReturnType<typeof initStaticComponents>;
export default initStaticComponents;
