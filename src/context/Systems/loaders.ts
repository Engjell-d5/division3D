import { AbstractMesh, Color3, Color4, Mesh, SceneLoader, ShadowGenerator } from "@babylonjs/core";
import { GridStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import "@babylonjs/loaders";
import { GridMaterial } from "@babylonjs/materials";


export const loadObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const [archeType] = w.query.with(c.loadable).execute();

      if (!archeType) {
        // console.info("[loadStatic]: No archetype found");
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

        // console.log(mesh);

        for (const mesh of result.meshes) {
          mesh.isPickable = false;


          if (w.entityManager.hasComponent(e.shadowGenerator, c.shadowGenerator) && w.entityManager.hasComponent(entId, c.shadows)) {
            
            const receives = w.entityManager.getComponent(entId, c.shadows).receives[w.entityManager.getArchTypeId(entId)];
            const casts = w.entityManager.getComponent(entId, c.shadows).casts[w.entityManager.getArchTypeId(entId)];

            mesh.receiveShadows = receives;

            if(casts) {
              const shadowGenerator: ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];
              shadowGenerator.addShadowCaster(mesh);
            }
          }

          if (w.entityManager.hasComponent(entId, c.flat) && mesh.material) {
            (mesh as Mesh).convertToFlatShadedMesh();
          }

          // w.scene.stopAllAnimations();
        }
        
      

        if (w.entityManager.hasComponent(entId, c.position)) {
          const position = w.entityManager.getComponent(entId, c.position)[w.entityManager.getArchTypeId(entId)];
          mesh.position = position;
        }

        if (w.entityManager.hasComponent(entId, c.projectionCylinders)) {
          mesh.setEnabled(false);
        }

        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };