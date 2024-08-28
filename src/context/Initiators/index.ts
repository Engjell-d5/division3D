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
  const platform = w.entityManager.create();
  w.entityManager.addComponent(platform, c.loadable, {
    path: "assets/models/platform.glb"
  });
  w.entityManager.addComponent(platform, c.rotatable);

  const elephant = w.entityManager.create();
  w.entityManager.addComponent(elephant, c.loadable, {path: "assets/models/divi.glb"});
  w.entityManager.addComponent(elephant, c.character);
};

const initWorld = (props: ISystem) => {

  props.world.scene.imageProcessingConfiguration.toneMappingEnabled = Config.toneMappingEnabled;
  props.world.scene.imageProcessingConfiguration.toneMappingType = Config.toneMappingType;
  props.world.scene.imageProcessingConfiguration.exposure = Config.exposure;
  props.world.scene.imageProcessingConfiguration.contrast = Config.contrast;
  
  initCamera(props);
  // initDirectionalLight(props);
  initAmbientLight(props);
  initPointLight(props);
  initShadowGenerator(props);
  initSkybox(props);
  initReferencePlane(props);
  tempInitRoom(props);

};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
