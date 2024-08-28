import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import ISystem from "../types";
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

  w.entityManager.addComponent(e.camera, c.camera, arcRotateCamera);

  arcRotateCamera.attachControl(w.canvas);

  arcRotateCamera.lowerRadiusLimit = Config.cameraLowerLimit;
  arcRotateCamera.upperRadiusLimit = Config.cameraUpperLimit;
  arcRotateCamera.lowerAlphaLimit = Config.cameraLowerAlpha;
  arcRotateCamera.upperAlphaLimit = Config.cameraUpperAlpha;
  arcRotateCamera.lowerBetaLimit = Config.cameraLowerBeta;
  arcRotateCamera.upperBetaLimit = Config.cameraUpperBeta;

  arcRotateCamera.wheelPrecision = 1 / Config.cameraScrollSpeed;
  arcRotateCamera.fov = Config.cameraFOV;

};

export default initCamera;
