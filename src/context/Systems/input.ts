import { Matrix, Color3, AbstractMesh, Mesh, Vector3 } from "@babylonjs/core";
import { GridStatus, MountOrientation, MovementStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import { Config } from "../constants";


export const followMouse = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  const archetypes = w.query.with(c.character).with(c.mesh).execute();

  if (archetypes.length <= 0) {
    console.info("[followMouse]: No archetype found");
    return null;
  }

  for( const archeType of archetypes) {
    for (
      let index = archeType.getEntities().length() - 1;
      index >= 0;
      index--
    ) {
      
      const entId = archeType.getEntityIdFromIndex(index);

      const mesh : Mesh = archeType.getColumn(c.mesh)[index];


      const target = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

      if(target.pickedPoint)
      {
        console.log("looking at", target.pickedPoint);
        mesh.lookAt(new Vector3(-target.pickedPoint.x, -target.pickedPoint.y, target.pickedPoint.z))
      }
    }
  }
};