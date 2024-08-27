import { DirectionalLight, PointLight, ShadowGenerator, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initShadowGenerator = ({ world: w, components: c, entities: e }: ISystem) => {
  // const light = w.entityManager.getComponent(e.pointLight, c.light)[w.entityManager.getArchTypeId(e.pointLight)];

  const archetypes = w.query.with(c.light).with(c.shadowsLight).execute();
  const entId = archetypes[0].getEntityIdFromIndex(0);

  const light = w.entityManager.getComponent(entId, c.light)[w.entityManager.getArchTypeId(entId)];

  const shadowGenerator = new ShadowGenerator(1024, light);
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
