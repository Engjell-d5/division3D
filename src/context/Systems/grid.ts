import { AbstractMesh, ISceneLoaderAsyncResult, Quaternion, ShadowGenerator, Space, Vector3, VertexBuffer } from "@babylonjs/core";
import { Config, GridHelperColors } from "../constants";
import { GridStatus, MountOrientation, ObjectHelpers } from "../enums";
import ISystem, { IDimensions } from "../types";
import { QueryType } from "@/ecs/utilities/Types";



export const roundDimension = (number: number): number => {
  const roundedValue = Math.round(number / Config.cellSize) * Config.cellSize;
  return roundedValue;
}

export const roundPosition = (number: number): number => {
  const roundedValue = Math.round(number / (Config.cellSize / 2)) * (Config.cellSize / 2);
  return roundedValue;
}

export const getDimensions =
  ({ world: w, components: c }: ISystem, entity: number): IDimensions => {

    const object = w.entityManager.getComponent(entity, c.mesh)[w.entityManager.getArchTypeId(entity)];

    let width, height, depth;

    object.refreshBoundingInfo();
    object.computeWorldMatrix();

    if (object.getChildMeshes().length > 0) {
      let maxX = -9999;
      let maxY = -9999;
      let maxZ = -9999;
      let minX = 9999;
      let minY = 9999;
      let minZ = 9999;

      for (const child of object.getChildMeshes()) {

          child.refreshBoundingInfo();
          child.computeWorldMatrix();

          if (child.getBoundingInfo().boundingBox.maximum.x > maxX) {
            maxX = child.getBoundingInfo().boundingBox.maximum.x;
          }
          if (child.getBoundingInfo().boundingBox.maximum.z > maxZ) {
            maxZ = child.getBoundingInfo().boundingBox.maximum.z;
          }
          if (child.getBoundingInfo().boundingBox.maximum.y > maxY) {
            maxY = child.getBoundingInfo().boundingBox.maximum.y;
          }

          if (child.getBoundingInfo().boundingBox.minimum.x < minX) {
            minX = child.getBoundingInfo().boundingBox.minimum.x;
          }
          if (object.getBoundingInfo().boundingBox.minimum.z < minZ) {
            minZ = child.getBoundingInfo().boundingBox.minimum.z;
          }
          if (object.getBoundingInfo().boundingBox.minimum.y < minY) {
            minY = child.getBoundingInfo().boundingBox.minimum.y;
          }
      }

      width = roundDimension(maxX - minX);
      depth = roundDimension(maxZ - minZ);
      height = roundDimension(maxY - minY);

      w.entityManager.addComponent(entity, c.boundingBox, { minX, minY, minZ, maxX, maxY, maxZ });
    } else {

      width = roundDimension((object.getBoundingInfo().boundingBox.maximum.x - object.getBoundingInfo().boundingBox.minimum.x));
      depth = roundDimension((object.getBoundingInfo().boundingBox.maximum.z - object.getBoundingInfo().boundingBox.minimum.z));
      height = roundDimension((object.getBoundingInfo().boundingBox.maximum.y - object.getBoundingInfo().boundingBox.minimum.y));
    }

    if (width === 0) {
      width = Config.cellSize;
    }
    if (depth === 0) {
      depth = Config.cellSize;
    }
    if (height === 0) {
      height = Config.cellSize;
    }

    return { width, height, depth }
  };


export const loadNewObject =
  ({ world: w, components: c, entities: e }: ISystem, result: ISceneLoaderAsyncResult, entId: number, position: Vector3 | undefined) => {

    let rootMesh = result.meshes[0];

    const shadowGenerator: ShadowGenerator = w.entityManager.getComponent(e.shadowGenerator, c.shadowGenerator)[w.entityManager.getArchTypeId(e.shadowGenerator)];

    const colliders: Array<AbstractMesh> = [];
    const mounts: Array<AbstractMesh> = [];

    const entities = w.query.getEntities([c.mesh], QueryType.WITH);

    rootMesh.id = "root_" + entities.length;

    for (const mesh of result.meshes) {
      if (mesh.name.includes(ObjectHelpers.COLLIDER)) {
        mesh.setParent(null);
        colliders.push(mesh);
      } else if (mesh.name.includes(ObjectHelpers.MOUNT)) {
        mesh.setParent(null);
        mounts.push(mesh);
      } else if (mesh.name === ObjectHelpers.ROOT) {
        continue;
      } else if(mesh.name.includes(ObjectHelpers.PICKABLE_SURFACE)) {
        mesh.isPickable = true;
      } else {
        mesh.id += rootMesh.id;
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    }
    w.entityManager.addComponent(entId, c.mesh, rootMesh);

    const dimensions: IDimensions = getDimensions({ world: w, components: c, entities: e }, entId);
    const grid: Array<Array<Array<number>>> = [];

    w.entityManager.addComponent(entId, c.dimensions, { width: dimensions.width, height: dimensions.height, depth: dimensions.depth });

    for (let i = 0; i < Math.round(dimensions.width / Config.cellSize); i++) {
      if (!grid[i]) {
        grid[i] = [];
      }
      for (let j = 0; j < Math.round(dimensions.depth / Config.cellSize); j++) {
        if (!grid[i][j]) {
          grid[i][j] = [];
        }
        for (let k = 0; k < Math.round(dimensions.height / Config.cellSize); k++) {
          grid[i][j][k] = (colliders.length === 0) ? 1 : 0;
        }
      }
    }

    w.entityManager.getComponent(entId, c.grid)[w.entityManager.getArchTypeId(entId)] = grid;

    if (!w.entityManager.hasComponent(entId, c.furniture)) {
      w.entityManager.addComponent(entId, c.pickable);
    }
    
    setupMetaData({ world: w, components: c, entities: e }, entId, colliders, GridStatus.TAKEN);
    setupMetaData({ world: w, components: c, entities: e }, entId, mounts, GridStatus.MOUNT);
    
    if (position !== undefined) {
      rootMesh.position = position;
    }

    if (w.entityManager.hasComponent(entId, c.furniture)) {
      updateContainerGrid({ world: w, components: c, entities: e }, entId, e.worldGrid, GridStatus.TAKEN, GridStatus.TAKEN);
      updateContainerGrid({ world: w, components: c, entities: e }, entId, e.worldGrid, GridStatus.MOUNT, GridStatus.MOUNT);
    } 
  };

  export const setupMetaData =
  ({ world: w, components: c, entities: e }: ISystem, containerEntity: number, metaData: Array<AbstractMesh>, gridStatus: GridStatus) => {

    if (metaData.length > 0) {
      for (const currentMetaData of metaData) {

        const metaDataEntity = w.entityManager.create();

        w.entityManager.addComponent(metaDataEntity, c.mesh, currentMetaData);
        const dimensions = getDimensions({ world: w, components: c, entities: e }, metaDataEntity);

        w.entityManager.addComponent(metaDataEntity, c.dimensions, { width: dimensions.width, height: dimensions.height, depth: dimensions.depth });

        const colliderGrid: Array<Array<Array<number>>> = [];

        for (let i = 0; i < Math.round(dimensions.width / Config.cellSize); i++) {
          if (!colliderGrid[i]) {
            colliderGrid[i] = [];
          }
          for (let j = 0; j < Math.round(dimensions.depth / Config.cellSize); j++) {
            if (!colliderGrid[i][j]) {
              colliderGrid[i][j] = [];
            }
            for (let k = 0; k < Math.round(dimensions.height / Config.cellSize); k++) {
              colliderGrid[i][j][k] = gridStatus;
            }
          }
        }

        w.entityManager.addComponent(metaDataEntity, c.grid, colliderGrid);

        updateContainerGrid({ world: w, components: c, entities: e }, metaDataEntity, containerEntity, gridStatus, gridStatus);

        w.entityManager.destroy(metaDataEntity);
      }
    }
  }

  export const canDropOnContainer =
  ({ world: w, components: c, entities: e }: ISystem, objectEntity: number, containerEntity: number, position: Vector3) => {

    const objectGrid = w.entityManager.getComponent(objectEntity, c.grid)[w.entityManager.getArchTypeId(objectEntity)];
    const containerGrid = w.entityManager.getComponent(containerEntity, c.grid)[w.entityManager.getArchTypeId(containerEntity)];

    let containerDimensions: IDimensions = { width: 0, height: 0, depth: 0 };

    let dimensionsComponent = w.entityManager.getComponent(containerEntity, c.dimensions);

    containerDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(containerEntity)]);

    const objectDimensions: IDimensions = { width: 0, height: 0, depth: 0 };

    dimensionsComponent = w.entityManager.getComponent(objectEntity, c.dimensions);

    objectDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(objectEntity)]);

    const center = position.clone();

    position.x = position.x - objectDimensions.width / 2;
    position.z = position.z - objectDimensions.depth / 2;
    position.y = position.y - objectDimensions.height / 2;

    const angle = (w.entityManager.hasComponent(objectEntity, c.rotation)) ? w.entityManager.getComponent(objectEntity, c.rotation).angle[w.entityManager.getArchTypeId(objectEntity)] : 0;
    const radians = angle * Math.PI / 180;

    let initialPosition = position.clone();

    let quaternion: Quaternion = Quaternion.FromEulerAngles(0, 0, 0);;

    if( w.entityManager.hasComponent(objectEntity, c.rotation)) {
      switch (w.entityManager.getComponent(objectEntity, c.rotation).orientation[w.entityManager.getArchTypeId(objectEntity)]) {
        case MountOrientation.NONE :
          quaternion = Quaternion.FromEulerAngles(0, 0, 0);
        break;
        case MountOrientation.FLOOR :
          quaternion = Quaternion.FromEulerAngles(0, radians, 0);
        break
        case MountOrientation.RIGHT_WALL :
          quaternion = Quaternion.FromEulerAngles(0, 0, radians);
        break
        case MountOrientation.LEFT_WALL :
          quaternion = Quaternion.FromEulerAngles(0, 0, radians);
        break
        case MountOrientation.FRONT_WALL :
          quaternion = Quaternion.FromEulerAngles(radians, 0, 0);
        break
        case MountOrientation.BACK_WALL :
          quaternion = Quaternion.FromEulerAngles(radians, 0, 0);
        break
      }  
    }
    
    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        for (let k = 0; k < objectGrid[i][j].length; k++) {
          let w1, w2, d1, d2, h1, h2;

          const translatedVector = position.subtract(center);

          let rotatedPosition = translatedVector;

          rotatedPosition.rotateByQuaternionToRef(quaternion, rotatedPosition);

          rotatedPosition = rotatedPosition.add(center);

          rotatedPosition.x = roundPosition(rotatedPosition.x);
          rotatedPosition.z = roundPosition(rotatedPosition.z);
          rotatedPosition.y = roundPosition(rotatedPosition.y);

          if ((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize) % 1 === 0) {
            w1 = Math.round((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize));
            w2 = Math.round((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize) + 1.0);
            if(w2 >= containerGrid.length) {
              w2 = w1;
            }
          } else {
            w1 = Math.round((containerDimensions.width / 2 / Config.cellSize) + rotatedPosition.x / Config.cellSize);
            w2 = w1;
          }

          if (w1 > containerGrid.length || w1 < 0 || w2 > containerGrid.length || w2 < 0) {
            return false;
          }

          if ((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize) % 1 === 0) {
            d1 = Math.round((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize));
            d2 = Math.round((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize) + 1.0);
            if(d2 >= containerGrid[0].length) {
              d2 = d1;
            }
          } else {
            d1 = Math.round((containerDimensions.depth / 2 / Config.cellSize) + rotatedPosition.z / Config.cellSize);
            d2 = d1;
          }

          if (d1 < 0 || d2 < 0 || d1 >= containerGrid[w1].length || d1 >= containerGrid[w2].length || d2 >= containerGrid[w1].length || d2 >= containerGrid[w2].length) {
            return false;
          }

          if ((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize) % 1 === 0) {
            h1 = Math.round((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize));
            h2 = Math.round((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize) + 1.0);
            if(h2 >= containerGrid[0][0].length) {
              h2 = h1;
            }
          } else {
            h1 = Math.round((containerDimensions.height / 2 / Config.cellSize) + rotatedPosition.y / Config.cellSize);
            h2 = h1;
          }

          if (h1 < 0 || h2 < 0 || h1 >= containerGrid[w1][d1].length || h1 >= containerGrid[w1][d2].length || h1 >= containerGrid[w2][d1].length || h1 >= containerGrid[w2][d2].length || h2 >= containerGrid[w1][d1].length || h2 >= containerGrid[w1][d2].length || h2 >= containerGrid[w2][d1].length || h2 >= containerGrid[w2][d2].length) {
            return false;
          }

          if (objectGrid[i][j][k] === GridStatus.TAKEN) {
            if (containerGrid[w1][d1][h1] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w1][d1][h2] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w1][d2][h1] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w1][d2][h2] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w2][d1][h1] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w2][d1][h2] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w2][d2][h1] === GridStatus.TAKEN) {
              return false;
            }
            if (containerGrid[w2][d2][h2] === GridStatus.TAKEN) {
              return false;
            }
          }
          
          if (objectGrid[i][j][k] === GridStatus.MOUNT) {
            if (containerGrid[w1][d1][h1] !== GridStatus.MOUNT) {
              return false;
            }
          }
          position.y += Config.cellSize;
        }
        position.z += Config.cellSize;
        position.y = initialPosition.y;
      }
      position.x += Config.cellSize;
      position.z = initialPosition.z;
      position.y = initialPosition.y;
    }

    return true;
  }

export const updateContainerGrid =
  ({ world: w, components: c, entities: e }: ISystem, objectEntity: number, containerEntity: number, checkValue: GridStatus, newValue: GridStatus) => {

    const objectGrid = w.entityManager.getComponent(objectEntity, c.grid)[w.entityManager.getArchTypeId(objectEntity)];
    const containerGrid = w.entityManager.getComponent(containerEntity, c.grid)[w.entityManager.getArchTypeId(containerEntity)];

    let containerDimensions: IDimensions = { width: 0, height: 0, depth: 0 };

    let dimensionsComponent = w.entityManager.getComponent(containerEntity, c.dimensions);

    containerDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(containerEntity)]);

    const objectMesh: AbstractMesh = w.entityManager.getComponent(objectEntity, c.mesh)[w.entityManager.getArchTypeId(objectEntity)];

    const objectDimensions: IDimensions = { width: 0, height: 0, depth: 0 };

    dimensionsComponent = w.entityManager.getComponent(objectEntity, c.dimensions);

    objectDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(objectEntity)]);

    let position = objectMesh.position.clone();

    const center = position.clone();

    position.x = position.x - objectDimensions.width / 2;
    position.z = position.z - objectDimensions.depth / 2;
    position.y = position.y - objectDimensions.height / 2;

    const angle = (w.entityManager.hasComponent(objectEntity, c.rotation)) ? w.entityManager.getComponent(objectEntity, c.rotation).angle[w.entityManager.getArchTypeId(objectEntity)] : 0;
    const radians = angle * Math.PI / 180;

    let initialPosition = position.clone();

    let quaternion: Quaternion = Quaternion.FromEulerAngles(0, 0, 0);;

    if( w.entityManager.hasComponent(objectEntity, c.rotation)) {
      switch (w.entityManager.getComponent(objectEntity, c.rotation).orientation[w.entityManager.getArchTypeId(objectEntity)]) {
        case MountOrientation.NONE :
          quaternion = Quaternion.FromEulerAngles(0, 0, 0);
        break;
        case MountOrientation.FLOOR :
          quaternion = Quaternion.FromEulerAngles(0, radians, 0);
        break
        case MountOrientation.RIGHT_WALL :
          quaternion = Quaternion.FromEulerAngles(0, 0, radians);
        break
        case MountOrientation.LEFT_WALL :
          quaternion = Quaternion.FromEulerAngles(0, 0, radians);
        break
        case MountOrientation.FRONT_WALL :
          quaternion = Quaternion.FromEulerAngles(radians, 0, 0);
        break
        case MountOrientation.BACK_WALL :
          quaternion = Quaternion.FromEulerAngles(radians, 0, 0);
        break
      }  
    }

    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        for (let k = 0; k < objectGrid[i][j].length; k++) {

          if (objectGrid[i][j][k] !== checkValue) {
            continue;
          }

            let w1, w2, d1, d2, h1, h2;
            
            const translatedVector = position.subtract(center);

            let rotatedPosition = translatedVector;

            rotatedPosition.rotateByQuaternionToRef(quaternion, rotatedPosition);

            rotatedPosition = rotatedPosition.add(center);

            rotatedPosition.x = roundPosition(rotatedPosition.x);
            rotatedPosition.z = roundPosition(rotatedPosition.z);
            rotatedPosition.y = roundPosition(rotatedPosition.y);

            if ((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize) % 1 === 0) {
              w1 = Math.round((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize));
              w2 = Math.round((containerDimensions.width / 2 / Config.cellSize + rotatedPosition.x / Config.cellSize) + 1.0);
              if(w2 >= containerGrid.length) {
                w2 = containerGrid.length - 1;
              }
            } else {
              w1 = Math.round((containerDimensions.width / 2 / Config.cellSize) + rotatedPosition.x / Config.cellSize);
              w2 = w1;
            }
  
            if ((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize) % 1 === 0) {
              d1 = Math.round((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize));
              d2 = Math.round((containerDimensions.depth / 2 / Config.cellSize + rotatedPosition.z / Config.cellSize) + 1.0);
              if(d2 >= containerGrid[0].length) {
                d2 = containerGrid[0].length - 1;
              }
            } else {
              d1 = Math.round((containerDimensions.depth / 2 / Config.cellSize) + rotatedPosition.z / Config.cellSize);
              d2 = d1;
            }
  
            if ((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize) % 1 === 0) {
              h1 = Math.round((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize));
              h2 = Math.round((containerDimensions.height / 2 / Config.cellSize + rotatedPosition.y / Config.cellSize) + 1.0);
              if(h2 >= containerGrid[0][0].length) {
                h2 = containerGrid[0][0].length - 1;
              }
            } else {
              h1 = Math.round((containerDimensions.height / 2 / Config.cellSize) + rotatedPosition.y / Config.cellSize);
              h2 = h1;
            }

            //leaving these here just in case needed for debugging
            if(containerGrid[w1][d1][h1] !== GridStatus.MOUNT) {
              containerGrid[w1][d1][h1] = newValue;
            }
            if(containerGrid[w1][d1][h2] !== GridStatus.MOUNT) {
              containerGrid[w1][d1][h2] = newValue;
            }
            if(containerGrid[w1][d2][h1] !== GridStatus.MOUNT) {
              containerGrid[w1][d2][h1] = newValue;
            }
            if(containerGrid[w1][d2][h2] !== GridStatus.MOUNT) {
              containerGrid[w1][d2][h2] = newValue;
            }
            if(containerGrid[w2][d1][h1] !== GridStatus.MOUNT) {
              containerGrid[w2][d1][h1] = newValue;
            }
            if(containerGrid[w2][d1][h2] !== GridStatus.MOUNT) {
              containerGrid[w2][d1][h2] = newValue;
            }
            if(containerGrid[w2][d2][h1] !== GridStatus.MOUNT) {
              containerGrid[w2][d2][h1] = newValue;
            }
            if(containerGrid[w2][d2][h1] !== GridStatus.MOUNT) {
              containerGrid[w2][d2][h2] = newValue;
            }

            if (Config.debug && containerEntity === e.worldGrid) {
              const meshGrid = w.entityManager.getComponent(e.meshGrid, c.meshGrid)[w.entityManager.getArchTypeId(e.meshGrid)];
              if(meshGrid[w1][d1][h1].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w1][d1][h1].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w1][d1][h1].instancedBuffers.color.a === 0) {
                  meshGrid[w1][d1][h1].setEnabled(false);
                } else {
                  meshGrid[w1][d1][h1].setEnabled(true);
                }
              }
              if(meshGrid[w1][d1][h2].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w1][d1][h2].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w1][d1][h2].instancedBuffers.color.a === 0) {
                  meshGrid[w1][d1][h2].setEnabled(false);
                } else {
                  meshGrid[w1][d1][h1].setEnabled(true);
                }
              }
              if(meshGrid[w1][d2][h1].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w1][d2][h1].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w1][d2][h1].instancedBuffers.color.a === 0) {
                  meshGrid[w1][d2][h1].setEnabled(false);
                } else {
                  meshGrid[w1][d1][h1].setEnabled(true);
                }
              }
              if(meshGrid[w1][d2][h2].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w1][d2][h2].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w1][d2][h2].instancedBuffers.color.a === 0) {
                  meshGrid[w1][d2][h2].setEnabled(false);
                } else {
                  meshGrid[w1][d1][h1].setEnabled(true);
                }
              }
              if(meshGrid[w2][d1][h1].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w2][d1][h1].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w2][d1][h1].instancedBuffers.color.a === 0) {
                  meshGrid[w2][d1][h1].setEnabled(false);
                } else {
                  meshGrid[w2][d1][h1].setEnabled(true);
                }
              }
              if(meshGrid[w2][d1][h2].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w2][d1][h2].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w2][d1][h2].instancedBuffers.color.a === 0) {
                  meshGrid[w2][d1][h2].setEnabled(false);
                } else {
                  meshGrid[w2][d1][h2].setEnabled(true);
                }
              }
              if(meshGrid[w2][d2][h1].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w2][d2][h1].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w2][d2][h1].instancedBuffers.color.a === 0) {
                  meshGrid[w2][d2][h1].setEnabled(false);
                } else {
                  meshGrid[w2][d2][h1].setEnabled(true);
                }
              }
              if(meshGrid[w2][d2][h2].instancedBuffers.color !== GridHelperColors[GridStatus.MOUNT]) {
                meshGrid[w2][d2][h2].instancedBuffers.color = GridHelperColors[newValue];
                if(meshGrid[w2][d2][h2].instancedBuffers.color.a === 0) {
                  meshGrid[w2][d2][h2].setEnabled(false);
                } else {
                  meshGrid[w2][d2][h2].setEnabled(true);
                }
              }
            }
          position.y += Config.cellSize;
        }
        position.z += Config.cellSize;
        position.y = initialPosition.y;
      }
      position.x += Config.cellSize;
      position.z = initialPosition.z;
      position.y = initialPosition.y;
    }
  }
