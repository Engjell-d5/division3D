import { Matrix, Color3, AbstractMesh, Mesh, Vector3, Animation, StandardMaterial, VideoTexture, HighlightLayer } from "@babylonjs/core";
import { GridStatus, MountOrientation, MovementStatus, ObjectHelpers } from "../enums";
import ISystem, { IAnimation } from "../types";
import { QueryType } from "@/ecs/utilities/Types";
import { Config } from "../constants";


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
        mesh.lookAt(new Vector3(-target.pickedPoint.x, -target.pickedPoint.y, target.pickedPoint.z));
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


    if(!projMesh.isEnabled())
    {
      projMesh.setEnabled(true);
      projMesh.attachToBone(charMesh.getChildMeshes()[0].skeleton!.bones[0], charMesh);  
    }
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

      const animations = w.entityManager.getComponent(e.projectionPlane, c.standardAnimation)[0];
      animations.push(
          {
          name: "scalex",
          fps: 30,
          property: "scaling.x",
          enabled: true,
          startFrame: 0,
          created: false,
          loop: false,
          callback : () => {
          },
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: 0,
            },
            {
              frame: 5, 
              value: width,
            }, 
          ]
        }
      )

      animations.push(
        {
        name: "scaley",
        fps: 30,
        property: "scaling.y",
        enabled: true,
        startFrame: 0,
        created: false,
        loop: false,
        callback : () => {
        },
        animationType: Animation.ANIMATIONTYPE_FLOAT,
        keyFrames: [
          {
            frame: 0, 
            value: 0,
          },
          {
            frame: 5, 
            value: height,
          }, 
        ]
      }
    )
    }
  }

 
};