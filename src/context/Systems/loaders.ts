import { AbstractMesh, Color4, Mesh, SceneLoader, ShadowGenerator } from "@babylonjs/core";
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


          if (w.entityManager.hasComponent(e.shadowGenerator, c.shadowGenerator)) {
            const shadowGenerator: ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];
            shadowGenerator.addShadowCaster(mesh);
          }

          if (w.entityManager.hasComponent(entId, c.wireframe) && mesh.material) {
            // (mesh as Mesh).convertToFlatShadedMesh();
            // mesh.enableEdgesRendering(0.9999);
            // mesh.edgesWidth = 2.0;
            // mesh.edgesColor = new Color4(1, 1, 1, 1);
            // mesh.material = new GridMaterial("groundMaterial", w.scene);
            // mesh.material.wireframe = true;
            // mesh.material.wireframe = true
          }

          mesh.receiveShadows = true;

        }

        if (w.entityManager.hasComponent(entId, c.projectionCylinders)) {
          mesh.setEnabled(false);
        }

        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };