import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";
import { cameraMove } from "../Systems/camera";

const initCamera = (props: ISystem) => {

  const { world: w, components: c, entities: e } = props;


  const arcRotateCamera = new ArcRotateCamera(
    "camera",
    -Math.PI,
    Math.PI / 2.5,
    15,
    new Vector3(0, 0, 0)
  );

  w.entityManager.addComponent(e.camera, c.camera, arcRotateCamera);

  arcRotateCamera.attachControl(w.canvas);

  arcRotateCamera.lowerRadiusLimit = Config.cameraLowerLimit;
  arcRotateCamera.upperRadiusLimit = Config.cameraUpperLimit;
  arcRotateCamera.wheelPrecision = 1 / Config.cameraScrollSpeed;
  arcRotateCamera.fov = Config.cameraFOV;

  arcRotateCamera.position = Vector3.Zero();

  arcRotateCamera.onViewMatrixChangedObservable.add(cameraMove(props))
};

export default initCamera;
