import ISystem from "../types";
import initCamera from "./camera";
import initLight from "./ambientLight";
import initReferencePlane from "./referencePlane";
import initSkybox from "./skybox";
import initWorldGrid from "./worldGrid";
import initMeshGrid from "./MeshGrid";
import { Config } from "../constants";
import initAmbientLight from "./ambientLight";
import initDirectionalLight from "./directionalLight";
import initShadowGenerator from "./shadowGenerator";
import initPointLight from "./pointLight";
import { ImageProcessingConfiguration, Vector3 } from "@babylonjs/core";

const tempInitRoom = ({ world: w, components: c, entities: e }: ISystem) => {
  const room = w.entityManager.create();
  w.entityManager.addComponent(room, c.loadable, {
    path: "assets/models/bedroom.glb"
  });

  // const bed = w.entityManager.create();
  // w.entityManager.addComponent(bed, c.loadable, {
  //   path: "assets/models/furniture1.glb",
  //   position: new Vector3(0.67, -1.3, 0)
  // });

  // w.entityManager.addComponent(bed, c.grid);
  // w.entityManager.addComponent(bed, c.furniture);

  // const bookcase = w.entityManager.create();

  // w.entityManager.addComponent(bookcase, c.loadable, {
  //   path: "assets/models/furniture2.glb",
  //   position: new Vector3(1.50, -0.65, -1.65)
  // });

  // w.entityManager.addComponent(bookcase, c.grid);
  // w.entityManager.addComponent(bookcase, c.furniture);
};

const initWorld = (props: ISystem) => {

  props.world.scene.imageProcessingConfiguration.toneMappingEnabled = Config.toneMappingEnabled;
  props.world.scene.imageProcessingConfiguration.toneMappingType = Config.toneMappingType;
  props.world.scene.imageProcessingConfiguration.exposure = Config.exposure;
  props.world.scene.imageProcessingConfiguration.contrast = Config.contrast;
  
  initCamera(props);
  initAmbientLight(props);
  // initDirectionalLight(props);
  initPointLight(props);
  initShadowGenerator(props);
  initSkybox(props);
  initReferencePlane(props);
  tempInitRoom(props);
  initWorldGrid(props);

  if(Config.debug) {
    initMeshGrid(props);  
  }
};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
