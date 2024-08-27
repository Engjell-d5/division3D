import { MeshBuilder } from "@babylonjs/core";
import ISystem from "../types";

const initReferencePlane = ({ world: w, components: c, entities: e }: ISystem) => {
  const plane = MeshBuilder.CreatePlane("referencePlane", { size: 1000 });

  w.entityManager.addComponent(
    e.referencePlane,
    c.mesh,
    plane
  );

  plane.visibility = 0;
  plane.position.z += 200;
  plane.rotation.y += 1.56;
  plane.isPickable = false;
};

export default initReferencePlane;
