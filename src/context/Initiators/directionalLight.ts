import { DirectionalLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initDirectionalLight = ({ world: w, components: c, entities: e }: ISystem) => {
  const light = new DirectionalLight("directionalLight", new Vector3(0, -1, -1));
  light.intensity = Config.directionalLightIntensity;
  light.position = new Vector3(0, 4.8, 0);

  w.entityManager.addComponent(
    e.directionalLight,
    c.light,
    light
  );

  w.entityManager.addComponent(e.directionalLight, c.shadowsLight);
};

export default initDirectionalLight;
