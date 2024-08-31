import { GlowLayer, HemisphericLight, Animation, HighlightLayer } from "@babylonjs/core";
import ISystem, { IAnimation } from "../types";
import { Config } from "../constants";

const initHighlightLayer = ({ world: w, components: c, entities: e }: ISystem) => {
  const highlight = new HighlightLayer("highlight", w.scene);
   
  w.entityManager.addComponent(
    e.highlight,
    c.highlight,
    highlight
  );

};

export default initHighlightLayer;
