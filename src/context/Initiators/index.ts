import ISystem from "../types";
import initCamera from "./camera";
import initLight from "./ambientLight";
import initReferencePlane from "./referencePlane";
import initSkybox from "./skybox";
import { Config, Landmarks } from "../constants";
import initAmbientLight from "./ambientLight";
import initDirectionalLight from "./directionalLight";
import initShadowGenerator from "./shadowGenerator";
import { BloomEffect, Color3, Color4, DefaultRenderingPipeline, GlowLayer, Scene, Vector3 } from "@babylonjs/core";
import initFireflies from "./particleSystems";
import initGlow from "./glow";
import initAnimationMaster from "./animationMaster";
import initProjectionPlane from "./projectionPlane";
import initHighlightLayer from "./initHighlightLayer";


const tempInitRoom = ({ world: w, components: c, entities: e }: ISystem) => {
  e.platform = w.entityManager.create();
  w.entityManager.addComponent(e.platform, c.loadable, {
    path: "assets/models/platform.glb"
  });
  // w.entityManager.addComponent(e.platform, c.rotatable);
  w.entityManager.addComponent(e.platform, c.shadows, { casts: true, receives: true});


  const projectionCylinder = w.entityManager.create();
  w.entityManager.addComponent(projectionCylinder, c.loadable, {
    path: "assets/models/projectionCylinder.glb"
  });
  w.entityManager.addComponent(projectionCylinder, c.shadows, { casts: false, receives: false});


  w.entityManager.addComponent(projectionCylinder, c.projectionCylinders);

  e.character = w.entityManager.create();
  w.entityManager.addComponent(e.character, c.loadable, {path: "assets/models/divi.glb"});
  w.entityManager.addComponent(e.character, c.character);
  w.entityManager.addComponent(e.character, c.onCutscene);
  w.entityManager.addComponent(e.character, c.shadows, { casts: true, receives: true});


  const terrain = w.entityManager.create();
  w.entityManager.addComponent(terrain, c.loadable, {path: "assets/models/terrain.glb"});
  w.entityManager.addComponent(terrain, c.flat);
  w.entityManager.addComponent(terrain, c.shadows, { casts: false, receives: true});

  
  const tree = w.entityManager.create();
  w.entityManager.addComponent(tree, c.loadable, {path: "assets/models/tree.glb"});
  w.entityManager.addComponent(tree, c.shadows, { casts: true, receives: true});
  w.entityManager.addComponent(tree, c.position, new Vector3(5, 0, -1));


  const dome = w.entityManager.create();
  w.entityManager.addComponent(dome, c.loadable, {path: "assets/models/dome.glb"});


  for( const landmarkDef of Landmarks) {
    const landmark = w.entityManager.create();
    w.entityManager.addComponent(landmark, c.loadable, {path: landmarkDef.path});
    // w.entityManager.addComponent(landmark, c.flat);
    w.entityManager.addComponent(landmark, c.position, landmarkDef.position);
    w.entityManager.addComponent(landmark, c.clickable);
    w.entityManager.addComponent(landmark, c.prop);
    w.entityManager.addComponent(landmark, c.content, {type: landmarkDef.contentType, path: landmarkDef.contentPath, width: landmarkDef.contentWidth, height: landmarkDef.contentHeight});
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
  props.world.scene.fogDensity = 0.012;
  props.world.scene.fogColor = Color3.Red();
  props.world.scene.fogMode = Scene.FOGMODE_EXP2;


  initCamera(props);
  initDirectionalLight(props);
  initAmbientLight(props);
  initShadowGenerator(props);
  initSkybox(props);
  initReferencePlane(props);
  initFireflies(props);
  tempInitRoom(props);
  initGlow(props);
  initAnimationMaster(props);
  initProjectionPlane(props);
  initHighlightLayer(props);
};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
