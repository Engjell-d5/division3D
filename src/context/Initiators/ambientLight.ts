import { Color3, HemisphericLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initAmbientLight = ({ world: w, components: c, entities: e }: ISystem) => {
  const ambientLight = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), w.scene);
  ambientLight.intensity = Config.ambientLightIntensity;
  ambientLight.diffuse = Config.ambientLightColor;
  
  w.entityManager.addComponent(
    e.ambientLight,
    c.light,
    ambientLight
  );
};

export default initAmbientLight;
