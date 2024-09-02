import { ArcRotateCamera, DefaultRenderingPipeline, GlowLayer, Vector3, Animation } from "@babylonjs/core";
import ISystem, { IAnimation } from "../types";
import { Config } from "../constants";

const initCamera = (props: ISystem) => {

  const { world: w, components: c, entities: e } = props;


  const arcRotateCamera = new ArcRotateCamera(
    "camera",
    -Math.PI,
    Math.PI / 2.5,
    15,
    Config.cameraPosition
  );


  const dfp = new DefaultRenderingPipeline("default", true, w.scene, [arcRotateCamera], true);
  dfp.samples = 4;



  w.entityManager.addComponent(e.camera, c.camera, arcRotateCamera);

  arcRotateCamera.attachControl(w.canvas, true);

  arcRotateCamera.lowerRadiusLimit = 0;
  arcRotateCamera.radius = 1;
  arcRotateCamera.upperRadiusLimit = Config.cameraUpperLimit;
  arcRotateCamera.alpha = Config.cameraLowerAlpha;
  // arcRotateCamera.lowerAlphaLimit = Config.cameraLowerAlpha;
  // arcRotateCamera.upperAlphaLimit = Config.cameraUpperAlpha;
  arcRotateCamera.lowerBetaLimit = Config.cameraLowerBeta;
  arcRotateCamera.upperBetaLimit = Config.cameraUpperBeta;

  arcRotateCamera.inputs.clear();

  arcRotateCamera.wheelPrecision = 1 / Config.cameraScrollSpeed;
  arcRotateCamera.fov = Config.cameraFOV;

};

export default initCamera;
