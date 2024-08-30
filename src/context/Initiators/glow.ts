import { GlowLayer, HemisphericLight, Animation } from "@babylonjs/core";
import ISystem, { IAnimation } from "../types";
import { Config } from "../constants";

const initGlow = ({ world: w, components: c, entities: e }: ISystem) => {
  const glow = new GlowLayer("glow", w.scene);
  glow.intensity = 0;
   
  w.entityManager.addComponent(
    e.glow,
    c.glow,
    glow
  );

};

export default initGlow;
