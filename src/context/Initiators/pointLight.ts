import { PointLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initPointLight = ({ world: w, components: c, entities: e }: ISystem) => {
  const light = new PointLight("pointLight", new Vector3(0, 1.7, 0));
  light.intensity = 5.0;

  w.entityManager.addComponent(
    e.pointLight,
    c.light,
    light
  );
};

export default initPointLight;
