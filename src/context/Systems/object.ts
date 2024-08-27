import { AbstractMesh, Quaternion, Space, Vector3 } from "@babylonjs/core";
import { updateContainerGrid } from "./grid";
import { GridStatus, MountOrientation } from "../enums";
import ISystem from "../types";
import { QueryType } from "@/ecs/utilities/Types";

export const rotateObject = ({ world: w, components: c, entities: e }: ISystem) => {

    const entity = w.query.getEntities([c.picked], QueryType.WITH)[0];

    const angle = 45;

    const radians = (angle * Math.PI) / 180;

    const mesh = w.entityManager.getComponent(entity, c.mesh)[w.entityManager.getArchTypeId(entity)];

    updateContainerGrid({ world: w, components: c, entities: e }, entity, e.worldGrid, GridStatus.TAKEN, GridStatus.FREE);

    if (!w.entityManager.hasComponent(entity, c.rotation)) {
        w.entityManager.addComponent(entity, c.rotation, {angle: angle, orientation: MountOrientation.FLOOR});
    } else {
        w.entityManager.getComponent(entity, c.rotation).angle[w.entityManager.getArchTypeId(entity)] += angle;
        if (w.entityManager.getComponent(entity, c.rotation).angle[w.entityManager.getArchTypeId(entity)] >= 360) {
            w.entityManager.getComponent(entity, c.rotation).angle[w.entityManager.getArchTypeId(entity)] = 0;
        }
    }

    let vector: Vector3 = new Vector3(0, 1, 0);

    switch (w.entityManager.getComponent(entity, c.rotation).orientation[w.entityManager.getArchTypeId(entity)]) {
      case MountOrientation.NONE :
        vector = new Vector3(0, 0, 0);
       break;
       case MountOrientation.FLOOR :
        vector = new Vector3(0, 1, 0);
      break
      case MountOrientation.RIGHT_WALL :
        vector = new Vector3(0, 0, 1);
      break
      case MountOrientation.LEFT_WALL :
        vector = new Vector3(0, 0, 1);
      break
      case MountOrientation.FRONT_WALL :
        vector = new Vector3(1, 0, 0);
      break
      case MountOrientation.BACK_WALL :
        vector = new Vector3(1, 0, 0);
      break
    }  

    mesh.rotate(vector, radians, Space.WORLD);

    updateContainerGrid({ world: w, components: c, entities: e }, entity, e.worldGrid, GridStatus.TAKEN, GridStatus.TAKEN);
}

export const removeObject = ({ world: w, components: c, entities: e }: ISystem) => {
    const entity = w.query.getEntities([c.picked], QueryType.WITH)[0];
    updateContainerGrid({ world: w, components: c, entities: e }, entity, e.worldGrid, GridStatus.TAKEN, GridStatus.FREE);

    // let mesh: AbstractMesh = w.entityManager.getComponent(entity, c.mesh)[w.entityManager.getArchTypeId(entity)];

    w.entityManager.destroy(entity);

};

