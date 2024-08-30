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

  const animations : Array<IAnimation> = [
    {
      name: "initialCameraMovement",
      fps: 30,
      property: "position.z",
      enabled: true,
      startFrame: 0,
      created: false,
      loop: false,
      animationType: Animation.ANIMATIONTYPE_FLOAT,
      keyFrames: [
        {
          frame: 0, 
          value: 0,
        },
        {
          frame: 120, 
          value: 10,
        }, 
      ]
    }
  ];


  const dfp = new DefaultRenderingPipeline("default", true, w.scene, [arcRotateCamera], true);
  dfp.samples = 4;



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
