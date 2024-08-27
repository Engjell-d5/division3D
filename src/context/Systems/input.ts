import { Matrix, Color3, AbstractMesh } from "@babylonjs/core";
import { GridStatus, MountOrientation, MovementStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { updateContainerGrid, roundPosition, canDropOnContainer } from "./grid";
import { QueryType } from "@/ecs/utilities/Types";
import { Config } from "../constants";

export const pickObject = 
  ({ world: w, components: c, entities: e }: ISystem, cb?: () => void) =>
    () => {

      const archetypes = w.query.with(c.pickable).execute();

      if (archetypes.length == 0) {
        return;
      }

      let hit = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let mesh: AbstractMesh = archeType.getColumn(c.mesh)[index];

          const rootId = hit?.pickedMesh?.id.split("root_");

          if (rootId && mesh.id == "root_" + rootId[1]) {

            const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

            if(highlightLayer) {
              mesh.getChildMeshes().forEach((child) => {
                highlightLayer.addMesh(child, Color3.Green());
              });
            }
            
            const entityId = archeType.getEntityIdFromIndex(index);
            w.entityManager.removeComponent(entityId, c.pickable);

            w.entityManager.addComponent(entityId, c.picked);
            
            if(typeof cb === "function") {
              cb();
            }
          }
        }
      }
    };

export const grabObject = 
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {
     
      const archetypes = w.query.with(c.picked).execute();

      if (archetypes.length == 0) {
        return;
      }

      let hit = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let mesh: AbstractMesh = archeType.getColumn(c.mesh)[index];

          const rootId = hit?.pickedMesh?.id.split("root_");

          if (rootId && mesh.id == "root_" + rootId[1]) {
            mesh.getChildMeshes().forEach((child) => {
              child.isPickable = false;
            });
            
            const entityId = archeType.getEntityIdFromIndex(index);

            if(w.entityManager.hasComponent(entityId, c.onGrid)) {
              updateContainerGrid({world: w, components: c, entities: e}, entityId, e.worldGrid, GridStatus.TAKEN, GridStatus.FREE);
            }

            w.entityManager.getComponent(e.camera, c.camera)[w.entityManager.getArchTypeId(e.camera)].detachControl(w.canvas);


            if(!w.entityManager.hasComponent(entityId, c.grabbed)) {
              w.entityManager.addComponent(entityId, c.grabbed, { status: MovementStatus.IDLE });
            }
          }
        }
      }
    };

export const dragObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {

      
      const archetypes = w.query.with(c.mesh).with(c.grabbed).execute();

      if (archetypes.length == 0) {
        return;
      }

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let pickingInfo = w.scene.pick(w.scene.pointerX, w.scene.pointerY);
          const entityId = archeType.getEntityIdFromIndex(index);

          if(!pickingInfo?.pickedMesh){
            return;
          }


          const mesh: AbstractMesh = archeType.getColumn(c.mesh)[w.entityManager.getArchTypeId(entityId)];

          const status = archeType.getColumn(c.grabbed).status[w.entityManager.getArchTypeId(entityId)];

          const position = pickingInfo!.pickedPoint!;
          const boundingBox = archeType.getColumn(c.boundingBox);

          const minY = Math.abs(boundingBox.minY[w.entityManager.getArchTypeId(entityId)]);
          const maxX = Math.abs(boundingBox.maxX[w.entityManager.getArchTypeId(entityId)]);
          const minX = Math.abs(boundingBox.minX[w.entityManager.getArchTypeId(entityId)]);
          const minZ = Math.abs(boundingBox.minZ[w.entityManager.getArchTypeId(entityId)]);
          const maxZ = Math.abs(boundingBox.maxZ[w.entityManager.getArchTypeId(entityId)]);

          if(!w.entityManager.hasComponent(entityId, c.rotation)) {
            w.entityManager.addComponent(entityId, c.rotation, {angle: 0, orientation: MountOrientation.FLOOR});
          }
          
          if(pickingInfo?.pickedMesh.name.includes(ObjectHelpers.RIGHT)) {
            position.z += minZ;
            w.entityManager.getComponent(entityId, c.rotation).orientation[w.entityManager.getArchTypeId(entityId)] = MountOrientation.RIGHT_WALL;
          } 
          if (pickingInfo?.pickedMesh.name.includes(ObjectHelpers.LEFT)) {
            position.z -= maxZ;
            w.entityManager.getComponent(entityId, c.rotation).orientation[w.entityManager.getArchTypeId(entityId)] = MountOrientation.LEFT_WALL;
          } 
          if (pickingInfo?.pickedMesh.name.includes(ObjectHelpers.FRONT)) {
            position.x -= maxX;
            w.entityManager.getComponent(entityId, c.rotation).orientation[w.entityManager.getArchTypeId(entityId)] = MountOrientation.FRONT_WALL;
          } 
          if (pickingInfo?.pickedMesh.name.includes(ObjectHelpers.BACK)) {
            position.x += minX;
            w.entityManager.getComponent(entityId, c.rotation).orientation[w.entityManager.getArchTypeId(entityId)] = MountOrientation.BACK_WALL;
          }
          if (pickingInfo?.pickedMesh.name.includes(ObjectHelpers.GROUND)) {
            position.y += minY;          
            w.entityManager.getComponent(entityId, c.rotation).orientation[w.entityManager.getArchTypeId(entityId)] = MountOrientation.FLOOR;
          }

          
          position.x = roundPosition(position.x);
          position.y = roundPosition(position.y);
          position.z = roundPosition(position.z);

          const canDrop = canDropOnContainer({world: w, components: c, entities: e}, entityId, e.worldGrid, position.clone());

          if(!canDrop) {

            if(status != MovementStatus.DISALLOWED) {
              const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

              mesh.getChildMeshes().forEach((child) => {
                highlightLayer.removeMesh(child);
                highlightLayer.addMesh(child, Color3.Red());
              });

              archeType.getColumn(c.grabbed).status[w.entityManager.getArchTypeId(entityId)] = MovementStatus.DISALLOWED; 
            } 
          } else {
            
            if(status != MovementStatus.ALLOWED) {
              const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

              for(let child of mesh.getChildMeshes())
              {
                highlightLayer.removeMesh(child);
                highlightLayer.addMesh(child, Color3.Green());
              }  
              archeType.getColumn(c.grabbed).status[w.entityManager.getArchTypeId(entityId)] = MovementStatus.ALLOWED;
            }

            if(Config.blockMovement) {
              mesh.position = position;
            }
          }

          if(!Config.blockMovement) {
            mesh.position = position;
          }
        }
      }
    };

export const dropObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {

      const archetypes = w.query.with(c.mesh).with(c.grabbed).execute();

      if (archetypes.length == 0) {
        console.log("no archetypes");
        return;
      }

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {
          const mesh: AbstractMesh = archeType.getColumn(c.mesh)[index];

          const entityId = archeType.getEntityIdFromIndex(index);
    
          const canDrop = canDropOnContainer({world: w, components: c, entities: e}, entityId, e.worldGrid, mesh.position.clone());

          if(canDrop) {
            updateContainerGrid({world: w, components: c, entities: e}, entityId, e.worldGrid, GridStatus.TAKEN, GridStatus.TAKEN);

            const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];
            console.log("removing highlight?");
            mesh.getChildMeshes().forEach((child) => {
              child.isPickable = true;
              highlightLayer.removeMesh(child);
              highlightLayer.addMesh(child, Color3.White());
            });
            
            archeType.getColumn(c.grabbed).status[index] = MovementStatus.IDLE;

            if(!w.entityManager.hasComponent(entityId, c.onGrid)) {
              w.entityManager.addComponent(entityId, c.onGrid);
            }
            
            w.entityManager.removeComponent(entityId, c.grabbed);
            
            w.entityManager.getComponent(e.camera, c.camera)[w.entityManager.getArchTypeId(e.camera)].attachControl(w.canvas);

          } else {
            console.log("can't drop");
          }
        }
      }
    };

export const unpickObject = 
  ({ world: w, components: c, entities: e }: ISystem, cb?: () => void) =>
    () => {
 
      const archetypes = w.query.with(c.picked).without(c.grabbed).execute();

      if (archetypes.length == 0) {
        return;
      }

      let hit = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let mesh: AbstractMesh = archeType.getColumn(c.mesh)[index];

          const rootId = hit?.pickedMesh?.id.split("root_");

          if (rootId && mesh.id != "root_" + rootId[1]) {
            const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

            if(highlightLayer) {
              mesh.getChildMeshes().forEach((child) => {
                highlightLayer.removeMesh(child);
              });
            }

            const entityId = archeType.getEntityIdFromIndex(index);
            console.log("unpicking, removing picked");
            w.entityManager.removeComponent(entityId, c.picked);
            w.entityManager.addComponent(entityId, c.pickable);
            if(typeof cb === "function") {
              cb();
            }
          }
        }
      }
    };