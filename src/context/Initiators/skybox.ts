import {
  Color4,
  CubeTexture,
  MeshBuilder,
  PBRMaterial,
  Texture,
} from "@babylonjs/core";
import ISystem from "../types";

const initSkybox = ({ world: w, components: c, entities: e }: ISystem) => {
  var texture = CubeTexture.CreateFromPrefilteredData(
    "/assets/textures/environmentSpecular.env",
    w.scene
  );

  w.scene.environmentTexture = texture;

  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, w.scene);
  skybox.isPickable = false;
  const skyboxMaterial = new PBRMaterial("skyBox", w.scene);
  skyboxMaterial.backFaceCulling = true;
  skyboxMaterial.reflectionTexture = texture;
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skyboxMaterial.microSurface = 0.7;
  skybox.material = skyboxMaterial;

  w.scene.clearColor = new Color4(0, 0, 0.2);
};

export default initSkybox;
