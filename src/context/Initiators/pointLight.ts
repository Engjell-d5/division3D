import { PointLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initPointLight = ({ world: w, components: c, entities: e }: ISystem) => {
  const light = new PointLight("pointLight", new Vector3(0, 4, 0));
  light.intensity = 10.0;

  w.entityManager.addComponent(
    e.pointLight,
    c.light,
    light
  );

  w.entityManager.addComponent(e.pointLight, c.shadowsLight);
};

export default initPointLight;
