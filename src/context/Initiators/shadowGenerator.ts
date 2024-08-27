import { DirectionalLight, PointLight, ShadowGenerator, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initShadowGenerator = ({ world: w, components: c, entities: e }: ISystem) => {
  const pointLight : PointLight = w.entityManager.getComponent(e.pointLight, c.light)[w.entityManager.getArchTypeId(e.pointLight)];

  const shadowGenerator = new ShadowGenerator(1024, pointLight);
  shadowGenerator.usePercentageCloserFiltering  = true;
  shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
  shadowGenerator.setDarkness(0.5);


  w.entityManager.addComponent(
    e.shadowGenerator,
    c.shadowGenerator,
    shadowGenerator
  );
};

export default initShadowGenerator;
