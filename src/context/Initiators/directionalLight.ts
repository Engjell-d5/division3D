import { DirectionalLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initDirectionalLight = ({ world: w, components: c, entities: e }: ISystem) => {
  const light = new DirectionalLight("directionalLight", new Vector3(-0.9, -1, 0));
  light.intensity = 2.2;
  light.position = new Vector3(0, 2.8, 0);

  w.entityManager.addComponent(
    e.directionalLight,
    c.light,
    light
  );

  w.entityManager.addComponent(e.directionalLight, c.shadowsLight);
};

export default initDirectionalLight;
