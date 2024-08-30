import World from "@/ecs/World";
import { Type } from "@/ecs/utilities/Types";

const initStaticComponents = (world: World) => {
  const components = {
    camera: world.schemaManager.register(Type.Custom),
    position: world.schemaManager.register(Type.Custom),
    light: world.schemaManager.register(Type.Custom),
    shadowGenerator: world.schemaManager.register(Type.Custom),
    mesh: world.schemaManager.register(Type.Custom),
    shadowsLight: world.schemaManager.register(Type.Tag),
    flat : world.schemaManager.register(Type.Tag),
    rotatable: world.schemaManager.register(Type.Tag),
    shadows: world.schemaManager.register({ casts: Type.Boolean, receives: Type.Boolean}),

    loadable: world.schemaManager.register({
      path: Type.String,
      position: Type.Custom
    }),
   
    clickable: world.schemaManager.register(Type.Tag),
    onCutscene: world.schemaManager.register(Type.Tag),
    character: world.schemaManager.register(Type.Custom),
    projectionCylinders: world.schemaManager.register(Type.Tag),

    highlight: world.schemaManager.register(Type.Custom),
    gpuParticleSystem: world.schemaManager.register(Type.Custom),
    standardAnimation: world.schemaManager.register(Type.Custom),
    customAnimation : world.schemaManager.register(Type.Custom),
    glow: world.schemaManager.register(Type.Custom),
    cutsceneMaster: world.schemaManager.register(Type.Custom),
    
  };

  return components;
};

export type StaticComponents = ReturnType<typeof initStaticComponents>;
export default initStaticComponents;
