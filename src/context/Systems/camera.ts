import { AbstractMesh, ArcRotateCamera, Camera, EventState, Matrix, Mesh, Ray, Vector3 } from "@babylonjs/core";
import ISystem, { IDimensions } from "../types";
import { ObjectHelpers } from "../enums";
import { Config } from "../constants";

export const cameraMove = ({ world: w, components: c, entities: e }: ISystem) => (eventData: Camera, eventState: EventState) => {
    const camera : ArcRotateCamera = w.entityManager.getComponent(e.camera, c.camera)[w.entityManager.getArchTypeId(e.camera)];
    let invisibleWalls = w.entityManager.getComponent(e.worldGrid, c.invisibleWalls)[w.entityManager.getArchTypeId(e.worldGrid)];
    let width = w.entityManager.getComponent(e.worldGrid, c.dimensions).width[w.entityManager.getArchTypeId(e.worldGrid)];
    let depth = w.entityManager.getComponent(e.worldGrid, c.dimensions).depth[w.entityManager.getArchTypeId(e.worldGrid)];
    let height = w.entityManager.getComponent(e.worldGrid, c.dimensions).height[w.entityManager.getArchTypeId(e.worldGrid)];

    const ray = w.scene.createPickingRay(w.scene.pointerX, w.scene.pointerY, Matrix.Identity(), camera, false);	

    const info = w.scene.multiPickWithRay(ray);

    for(const wall of invisibleWalls) {
        wall.visibility = 1;
    }

    invisibleWalls = [];

    if(info) {
        for(const pickInfo of info) {
            if(pickInfo?.pickedMesh?.name.includes(ObjectHelpers.RAY) && pickInfo.distance < Config.wallsVisibilityDistance) {   
                if(Math.abs(camera.position.x) > width / 2 + Config.wallsVisibilityThreshhold || Math.abs(camera.position.z) > depth / 2 + Config.wallsVisibilityThreshhold || Math.abs(camera.position.y) > height / 2 + Config.wallsVisibilityThreshhold) {
                    pickInfo.pickedMesh.visibility = Config.wallsVisibility;
                    invisibleWalls.push(pickInfo.pickedMesh);
                    w.entityManager.getComponent(e.worldGrid, c.invisibleWalls)[w.entityManager.getArchTypeId(e.worldGrid)] = invisibleWalls;
                }
            } 
        }
    }
}
