import { AbstractMesh, Color3, Color4, Mesh, SceneLoader, ShadowGenerator, Vector3 } from "@babylonjs/core";
import { GridStatus, ObjectHelpers } from "../enums";
import ISystem from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import "@babylonjs/loaders";
import { GridMaterial } from "@babylonjs/materials";
import { Config } from "../constants";


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

        if(path === 0 || entId === 0) { //why is it 0?
          return;
        }

        w.entityManager.removeComponent(entId, c.loadable);

        console.log(path);
        
        const result = await SceneLoader.ImportMeshAsync("", path);

        let mesh = result.meshes[0];

        if(w.entityManager.hasComponent(entId, c.character))
        {
          w.scene.animationGroups[0].stop();
          w.scene.animationGroups[1].stop();

          w.scene.animationGroups[0].enableBlending = true;
          w.scene.animationGroups[1].enableBlending = true;
          w.scene.animationGroups[0].blendingSpeed = Config.animationBlendingSpeed;
          w.scene.animationGroups[1].blendingSpeed = Config.animationBlendingSpeed;
        }

        // console.log(mesh);

        for (const mesh of result.meshes) {
          w.scene.stopAnimation(mesh, "idle");

          if(!w.entityManager.hasComponent(entId, c.clickable))
          {
            mesh.isPickable = false;
          }

         

          mesh.name = entId;

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
        }

        if(w.entityManager.hasComponent(entId, c.character)) {
          mesh.rotationQuaternion = null;

          const camera = w.entityManager.getComponent(e.camera, c.camera)[0];
          camera.lockedTarget = mesh;
         
        }


        if (w.entityManager.hasComponent(entId, c.transform)) {
          const position = w.entityManager.getComponent(entId, c.transform).position[w.entityManager.getArchTypeId(entId)];
          const rotation = w.entityManager.getComponent(entId, c.transform).rotation[w.entityManager.getArchTypeId(entId)];
          const scaling = w.entityManager.getComponent(entId, c.transform).scaling[w.entityManager.getArchTypeId(entId)];

          if(position != null) {
            mesh.position = position;
          }
          
          if(rotation != null) {
            mesh.rotation = rotation;
          }
          
          if(scaling != null) {
            mesh.scaling = scaling;
          }

        }

        if (w.entityManager.hasComponent(entId, c.projectionCylinders)) {
          mesh.setEnabled(false);
        }

        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };