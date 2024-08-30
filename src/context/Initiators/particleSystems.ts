import { Color3, Engine, GPUParticleSystem, HemisphericLight, Texture, Vector3 } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initFireflies = ({ world: w, components: c, entities: e }: ISystem) => {
  const fireflies = new GPUParticleSystem("Fireflies", {capacity: 500}, w.scene);
  fireflies.maxEmitBox = new Vector3(10, 3, 10);
  fireflies.minEmitBox = new Vector3(-10, 0, -10);
  fireflies.minLifeTime = 15000;
  fireflies.maxLifeTime = 20000;
  fireflies.minSize = 0.02;
  fireflies.maxSize = 0.04;
  fireflies.minEmitPower = 0.05;
  fireflies.maxEmitPower = 0.1;
  fireflies.direction1 = new Vector3(-1, -1, -1);
  fireflies.direction2 = new Vector3(1, 1, 1);
  fireflies.applyFog = false;
  fireflies.emitRate = 10000;
  fireflies.emitter = new Vector3(0, 0, 0);
  fireflies.particleTexture = new Texture("images/firefly.png", w.scene);
  fireflies.blendMode = Engine.ALPHA_MULTIPLY;
  fireflies.start();

  w.entityManager.addComponent(
    e.fireflies,
    c.gpuParticleSystem,
    fireflies
  );
};

export default initFireflies;
