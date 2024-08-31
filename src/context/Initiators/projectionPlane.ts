import { Color3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Vector3, VideoTexture } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";

const initProjectionPlane = ({ world: w, components: c, entities: e }: ISystem) => {
  const projection = MeshBuilder.CreatePlane("plane", {width: 3, height: 2, sideOrientation: Mesh.DOUBLESIDE});
  projection.position.y = 1;
  projection.visibility = 0.999999;
  projection.isPickable = false;
  projection.material = new StandardMaterial("std", w.scene);
  projection.setEnabled(false);

  // (projection.material as StandardMaterial).diffuseTexture = new VideoTexture("video", "videos/illyria.webm", w.scene, true);


  const overlay = MeshBuilder.CreatePlane("plane", {width: 3, height: 2, sideOrientation: Mesh.DOUBLESIDE});
  overlay.position.y = 1;
  overlay.visibility = 0.01;
  overlay.isPickable = false;
  overlay.material = new StandardMaterial("std", w.scene);
  overlay.position.z += 0.01;
  overlay.setEnabled(false);
  (overlay.material as StandardMaterial).diffuseColor = new Color3(0.6, 0.6, 1);
  (overlay.material as StandardMaterial).emissiveColor = new Color3(0.07, 0.07, 0.14);

  w.entityManager.addComponent(
    e.projectionPlane,
    c.content
  );

  
  w.entityManager.addComponent(
    e.projectionPlane,
    c.projectionPlane,
    {projection: projection, overlay: overlay}
  );
};

export default initProjectionPlane;
