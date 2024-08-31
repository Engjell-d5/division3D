import { Color3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Vector3, VideoTexture } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initProjectionPlane = ({ world: w, components: c, entities: e }: ISystem) => {
  const plane = MeshBuilder.CreatePlane("plane", {width: 3, height: 2, sideOrientation: Mesh.DOUBLESIDE});
  plane.position.y = 1;
  plane.visibility = 0.9;
  plane.isPickable = false;
  plane.material = new StandardMaterial("std", w.scene);
  plane.setEnabled(false);
  // (plane.material as StandardMaterial).diffuseColor = new Color3(0.6, 0.6, 1);
  // (plane.material as StandardMaterial).diffuseTexture = new VideoTexture("video", "videos/illyria.webm", w.scene, true);

  
  w.entityManager.addComponent(
    e.projectionPlane,
    c.mesh,
    plane
  );
};

export default initProjectionPlane;
