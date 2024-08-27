import { AbstractMesh, SceneLoader, ShadowGenerator } from "@babylonjs/core";
import { GridStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import "@babylonjs/loaders";

export const loadCharacter =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const archetypes = w.query.with(c.loadable).with(c.character).execute();

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

        }
      }
    };

    

export const loadStatic =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const [archeType] = w.query.with(c.loadable).without(c.character).execute();

      if (!archeType) {
        console.info("[loadStatic]: No archetype found");
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

        let mesh = result.meshes[0];

        for (const mesh of result.meshes) {
          mesh.isPickable = false;
            
    
            if(w.entityManager.hasComponent(e.shadowGenerator, c.shadowGenerator)) {
              const shadowGenerator : ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];
              shadowGenerator.addShadowCaster(mesh);
            }
            mesh.receiveShadows = true;
          
        }
                
        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };