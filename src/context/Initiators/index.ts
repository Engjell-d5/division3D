import ISystem from "../types";
import initCamera from "./camera";
import initLight from "./ambientLight";
import initReferencePlane from "./referencePlane";
import initSkybox from "./skybox";
import { Config, Landmarks } from "../constants";
import initAmbientLight from "./ambientLight";
import initDirectionalLight from "./directionalLight";
import initShadowGenerator from "./shadowGenerator";
import { BloomEffect, Color3, Color4, DefaultRenderingPipeline, GlowLayer, Scene } from "@babylonjs/core";
import initFireflies from "./particleSystems";


const tempInitRoom = ({ world: w, components: c, entities: e }: ISystem) => {
  const platform = w.entityManager.create();
  w.entityManager.addComponent(platform, c.loadable, {
    path: "assets/models/platform.glb"
  });
  // w.entityManager.addComponent(platform, c.rotatable);
  w.entityManager.addComponent(platform, c.shadows, { casts: true, receives: true});


  const projectionCylinder = w.entityManager.create();
  w.entityManager.addComponent(projectionCylinder, c.loadable, {
    path: "assets/models/projectionCylinder.glb"
  });
  w.entityManager.addComponent(projectionCylinder, c.shadows, { casts: false, receives: false});


  w.entityManager.addComponent(projectionCylinder, c.projectionCylinders);

  const elephant = w.entityManager.create();
  w.entityManager.addComponent(elephant, c.loadable, {path: "assets/models/divi.glb"});
  w.entityManager.addComponent(elephant, c.character);
  w.entityManager.addComponent(elephant, c.shadows, { casts: true, receives: true});


  const terrain = w.entityManager.create();
  w.entityManager.addComponent(terrain, c.loadable, {path: "assets/models/terrain.glb"});
  w.entityManager.addComponent(terrain, c.flat);
  w.entityManager.addComponent(terrain, c.shadows, { casts: false, receives: true});

  const dome = w.entityManager.create();
  w.entityManager.addComponent(dome, c.loadable, {path: "assets/models/dome.glb"});


  for( const landmarkDef of Landmarks) {
    const landmark = w.entityManager.create();
    w.entityManager.addComponent(landmark, c.loadable, {path: landmarkDef.path});
    // w.entityManager.addComponent(landmark, c.flat);
    w.entityManager.addComponent(landmark, c.position, landmarkDef.position);
    w.entityManager.addComponent(landmark, c.clickable);
    w.entityManager.addComponent(landmark, c.shadows, { casts: true, receives: true});

  }
};

const initWorld = (props: ISystem) => {

  props.world.scene.imageProcessingConfiguration.toneMappingEnabled = Config.toneMappingEnabled;
  props.world.scene.imageProcessingConfiguration.toneMappingType = Config.toneMappingType;
  props.world.scene.imageProcessingConfiguration.exposure = Config.exposure;
  props.world.scene.imageProcessingConfiguration.contrast = Config.contrast;

  props.world.scene.imageProcessingConfiguration.vignetteEnabled = true;
  props.world.scene.imageProcessingConfiguration.vignetteWeight = 0.5;
  props.world.scene.imageProcessingConfiguration.vignetteColor = new Color4(0, 0.0, 1.0, 0);
  props.world.scene.imageProcessingConfiguration.vignetteStretch = 5;
  props.world.scene.fogEnabled =  true;
  props.world.scene.fogDensity = 0.013;
  props.world.scene.fogColor = Color3.Red();
  props.world.scene.fogMode = Scene.FOGMODE_EXP2;

  
  const glow = new GlowLayer("glow", props.world.scene);
  glow.intensity = 0.5;


  initCamera(props);
  initDirectionalLight(props);
  initAmbientLight(props);
  initShadowGenerator(props);
  initSkybox(props);
  initReferencePlane(props);
  initFireflies(props);
  tempInitRoom(props);

};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
