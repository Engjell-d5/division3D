import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
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

  const animations : Array<IAnimation> = [
    {
      duration: 10,
      property: "position",
      startValue: 1,
      endValue: 10,
      enabled: true,
      startTime: 0,
      created: false
    }
  ];

  w.entityManager.addComponent(e.camera, c.camera, arcRotateCamera);



  w.entityManager.addComponent(e.camera, c.animation, animations);

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
