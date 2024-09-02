import { Matrix, Color3, AbstractMesh, Mesh, Vector3, Animation, StandardMaterial, VideoTexture, HighlightLayer, Axis, Space } from "@babylonjs/core";
import { GridStatus, MountOrientation, MovementStatus, ObjectHelpers } from "../enums";
import ISystem, { IAnimation } from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import { Config } from "../constants";
import { animateProjectionCube, animateProjectionPlane, startCharacterAnimation, startProjectionCube, stopCharacterAnimation } from "./projection";


export const followMouse = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  const archetypes = w.query.with(c.character).with(c.mesh).without(c.onCutscene).execute();

  if (archetypes.length <= 0) {
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

      if(w.scene.pointerX === 0 && w.scene.pointerY === 0) {
        return;
      }

      const target = w.scene.pick(w.scene.pointerX, w.scene.pointerY);
      const highlight = w.entityManager.getComponent(e.highlight, c.highlight)[0];


      if(target.pickedMesh && target.pickedPoint && target.pickedMesh.name === "referencePlane"){

        const camera = w.entityManager.getComponent(e.camera, c.camera)[0];

        const referenceMesh = w.entityManager.getComponent(e.referencePlane, c.mesh)[w.entityManager.getArchTypeId(e.referencePlane)];

        const position = target.pickedPoint.negate();
        position.addInPlace(referenceMesh.forward.scale(10));

        mesh.lookAt(position);

        (highlight as HighlightLayer).removeAllMeshes();

      } else if(target.pickedMesh && target.pickedPoint) {
        
        if(target.pickedMesh.parent) {
          for( const child of target.pickedMesh.parent.getChildMeshes()) {
            (highlight as HighlightLayer).addMesh(child as Mesh, new Color3(0.5, 0.5, 1));
          }
        } else {
          (highlight as HighlightLayer).addMesh(target.pickedMesh as Mesh, new Color3(0.5, 0.5, 1));
        }
        // mesh.lookAt(new Vector3(-target.pickedMesh.position.x, -target.pickedMesh.position.y, target.pi.z));

        return;
      }
    }
  }
};


export const mouseUp = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  const [projectionArchetype] = w.query.with(c.projectionCylinders).with(c.mesh).execute();

  if(!projectionArchetype)
  {
    return;
  }
 
  const projEntId = projectionArchetype.getEntityIdFromIndex(0)
  
  const projMesh : Mesh = projectionArchetype.getColumn(c.mesh)[0];

  projMesh.setEnabled(false);

  const projection = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).projection[w.entityManager.getArchTypeId(e.projectionPlane)];
  const overlay = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).overlay[w.entityManager.getArchTypeId(e.projectionPlane)];

  projection.setEnabled(false);
  overlay.setEnabled(false);

  projection.scaling.x = 0;
  projection.scaling.y = 0;

  overlay.scaling.x = 0;
  overlay.scaling.y = 0;

  (projection.material as StandardMaterial).diffuseTexture?.dispose();
  w.entityManager.removeComponent(e.character, c.onCutscene);
  startCharacterAnimation({ world: w, components: c, entities: e });

  
};

export const mouseDown = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  
  if(w.entityManager.hasComponent(e.projectionPlane, c.enabled)) {
    return;
  }
  
  const [charArchetype] = w.query.with(c.character).with(c.mesh).execute();
  const [projectionArchetype] = w.query.with(c.projectionCylinders).with(c.mesh).execute();

  if(!charArchetype || !projectionArchetype)
  {
    return;
  }
 
  const charEntId = charArchetype.getEntityIdFromIndex(0);

  const charMesh : Mesh = charArchetype.getColumn(c.mesh)[0];

  const projEntId = projectionArchetype.getEntityIdFromIndex(0)
  
  const projMesh : Mesh = projectionArchetype.getColumn(c.mesh)[0];


  const target = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

  if(target.pickedMesh) {
    const entId = Number(target.pickedMesh.name);

    if(isNaN(entId)) {
      return;
    }

    startProjectionCube({ world: w, components: c, entities: e }, projMesh, charMesh);

    const highlight = w.entityManager.getComponent(e.highlight, c.highlight)[0];
    (highlight as HighlightLayer).removeAllMeshes();

    w.entityManager.addComponent(e.character, c.onCutscene);

    console.log("ent id is", entId);

    if(w.entityManager.hasComponent(entId, c.prop) && w.entityManager.hasComponent(entId, c.content)) {
     
      const path = w.entityManager.getComponent(entId, c.content).path[w.entityManager.getArchTypeId(entId)];
      const type = w.entityManager.getComponent(entId, c.content).type[w.entityManager.getArchTypeId(entId)];
      const width = w.entityManager.getComponent(entId, c.content).width[w.entityManager.getArchTypeId(entId)];
      const height = w.entityManager.getComponent(entId, c.content).height[w.entityManager.getArchTypeId(entId)];

      const projection = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).projection[w.entityManager.getArchTypeId(e.projectionPlane)];
      const overlay = w.entityManager.getComponent(e.projectionPlane, c.projectionPlane).overlay[w.entityManager.getArchTypeId(e.projectionPlane)];

      projection.position = target.pickedPoint;
      projection.position.z += 0.5;

      overlay.position = projection.position;
      overlay.position.z += 0.01;

      if(type === 0) {
        (projection.material as StandardMaterial).diffuseTexture = new VideoTexture("video", path, w.scene, true);
      }

      overlay.setEnabled(true);
      projection.setEnabled(true);
      
      stopCharacterAnimation({ world: w, components: c, entities: e });
      animateProjectionCube({ world: w, components: c, entities: e }, projEntId, height, width);
     
    }
  }

 
};


export const scroll = ({ world: w, components: c, entities: e }: ISystem) => async (event: any) => {
  const [cameraArchetype] = w.query.with(c.camera).execute();

  if(!cameraArchetype)
  {
    return;
  }
  
  const camera = cameraArchetype.getColumn(c.camera)[0];

  const delta = event.deltaY * -0.0012; // Adjust the sensitivity as needed
  camera.alpha += delta; // Modify alpha to rotate horizontally

  const referenceMesh = w.entityManager.getComponent(e.referencePlane, c.mesh)[w.entityManager.getArchTypeId(e.referencePlane)];
  // referenceMesh.visibility = 1;

  referenceMesh.position = Vector3.Zero();
  referenceMesh.rotation.y -= delta;

  const backward = (referenceMesh as Mesh).forward; // Get the backward direction by negating the forward vector
  referenceMesh.position.addInPlace(backward.scale(5)); // Move the mesh along the backward direction

  const directionalLight = w.entityManager.getComponent(e.directionalLight, c.light)[w.entityManager.getArchTypeId(e.directionalLight)];
  let lightDirection = directionalLight.direction.clone();
  const rotationMatrix = Matrix.RotationY(-delta);
  lightDirection = Vector3.TransformNormal(lightDirection, rotationMatrix);
  directionalLight.direction = lightDirection.normalize(); // Update the light's direction
  
};