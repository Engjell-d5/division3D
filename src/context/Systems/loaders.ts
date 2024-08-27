import { AbstractMesh, SceneLoader, ShadowGenerator } from "@babylonjs/core";
import { GridStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { loadNewObject, setupMetaData } from "./grid";
import { QueryType } from "@/ecs/utilities/Types";
import "@babylonjs/loaders";

export const loadObjects =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const archetypes = w.query.with(c.loadable).with(c.grid).execute();

      if (archetypes.length <= 0) {
        // console.info("[loadObjects]: No archetype found");
        return null;
      }

      for( const archeType of archetypes) {
        while (archeType.getEntities().length() > 0) {
          
          const index = archeType.getEntities().length() - 1;
          
          const entId = archeType.getEntityIdFromIndex(index);

          const path = archeType.getColumn(c.loadable).path[index];

          const position = archeType.getColumn(c.loadable).position[index];

          w.entityManager.removeComponent(entId, c.loadable);

          const result = await SceneLoader.ImportMeshAsync("", path);

          loadNewObject({world: w, components: c, entities: e}, result, entId, position);
        }
      }
    };


export const loadFileObjects =
    ({ world: w, components: c, entities: e }: ISystem) =>
      async () => {
        const [archeType] = w.query.get([c.fileLoadable, c.grid], QueryType.ONLY);
  
        if (!archeType) {
          // console.info("[loadObjects]: No archetype found");
          return null;
        }
  
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {
  
          const entId = archeType.getEntityIdFromIndex(index);
  
          const file = archeType.getColumn(c.fileLoadable).file[index];
  
          w.entityManager.removeComponent(entId, c.fileLoadable);
  
          const result = await SceneLoader.ImportMeshAsync("", URL.createObjectURL(file), undefined, w.scene, undefined, ".glb");

          loadNewObject({world: w, components: c, entities: e}, result, entId, undefined);
        }
      };

export const loadRoom =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const [archeType] = w.query.get([c.loadable], QueryType.ONLY);

      if (!archeType) {
        console.info("[loadRoom]: No archetype found");
        return null;
      }

      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {
        
        const entId = archeType.getEntityIdFromIndex(index);

        const path = archeType.getColumn(c.loadable).path[index];

        w.entityManager.removeComponent(entId, c.loadable);

        const result = await SceneLoader.ImportMeshAsync("", path);

        const colliders : Array<AbstractMesh> = [];
        const mounts : Array<AbstractMesh> = [];


        let mesh = result.meshes[0];

        for (const mesh of result.meshes) {
          mesh.isPickable = false;
            
          if(mesh.name.includes(ObjectHelpers.PICKABLE_SURFACE)) {
            mesh.isPickable = true;
            if(w.entityManager.hasComponent(e.shadowGenerator, c.shadowGenerator)) {
              const shadowGenerator : ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];
              shadowGenerator.addShadowCaster(mesh);
            }
            mesh.receiveShadows = true;
          } else if(mesh.name.includes(ObjectHelpers.MOUNT)) {
            mesh.setParent(null);
            mounts.push(mesh);
          } else if (mesh.name.includes(ObjectHelpers.COLLIDER)) {
            mesh.setParent(null);
            colliders.push(mesh);
          } else if (mesh.name.includes(ObjectHelpers.ROOT)) {
            continue;
          } else {
            
            if(w.entityManager.hasComponent(e.shadowGenerator, c.shadowGenerator)) {
              const shadowGenerator : ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];
              shadowGenerator.addShadowCaster(mesh);
            }
            mesh.receiveShadows = true;
          }
        }
        
        setupMetaData({world: w, components: c, entities: e}, e.worldGrid, colliders, GridStatus.TAKEN);
        setupMetaData({world: w, components: c, entities: e}, e.worldGrid, mounts, GridStatus.MOUNT);
        
        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };