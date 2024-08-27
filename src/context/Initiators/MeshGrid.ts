import { Color4, InstancedMesh, Material, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import ISystem from "../types";
import { Config, GridHelperColors } from "../constants";
import { GridStatus } from "../enums";
import { roundDimension } from "../Systems/grid";

const initMeshGrid = ({ world: w, components: c, entities: e }: ISystem) => {

    const meshGrid : Array<Array<Array<InstancedMesh>>> = [];

    //all these values are in meters
    const cellSize = Config.cellSize;
    const width = 3.7;
    const depth = 3.7;
    const height = 2.9;

    const originalMesh = MeshBuilder.CreateBox("originalMesh", {size: cellSize}, w.scene);
    originalMesh.hasVertexAlpha = true;
    const material = new StandardMaterial("material", w.scene);
    originalMesh.material = material;
    originalMesh.isPickable = false;
    originalMesh.doNotSyncBoundingInfo = true;
    originalMesh.alwaysSelectAsActiveMesh = true;
    
    originalMesh.registerInstancedBuffer("color", 4)
    originalMesh.instancedBuffers.color = GridHelperColors[GridStatus.FREE];
    
    //initializing grid with empty 0; No space is taken
    for(let i = 0; i < Math.round(roundDimension(width) / cellSize); i ++){
        if(!meshGrid[i] ) {
          meshGrid[i] = [];
        }
        for(let j = 0; j < Math.round(roundDimension(depth) / cellSize); j ++){
            if(!meshGrid[i][j] ) {
              meshGrid[i][j] = [];
            }
            for(let k = 0; k < Math.round(roundDimension(height) / cellSize); k ++){
              const instancedMesh =  originalMesh.createInstance("instancedMesh"+i+j+k);
              instancedMesh.position.x = (i*cellSize) - roundDimension(width)/2;
              instancedMesh.position.z = (j*cellSize) - roundDimension(depth)/2;
              instancedMesh.position.y = (k*cellSize) - roundDimension(height)/2;
              meshGrid[i][j][k] = instancedMesh;
            }
        }
    }
    const instanceCount = originalMesh.instances.length;
    for (let index = 0; index < instanceCount; index++) {
      originalMesh.instances[index].instancedBuffers.color = GridHelperColors[0];
      originalMesh.instances[index].isPickable = false;
      originalMesh.instances[index].doNotSyncBoundingInfo = true;
      originalMesh.instances[index].alwaysSelectAsActiveMesh = true;
    }
    w.entityManager.addComponent(e.meshGrid, c.mesh, originalMesh);
    w.entityManager.addComponent(e.meshGrid, c.meshGrid, meshGrid);
};

export default initMeshGrid;
