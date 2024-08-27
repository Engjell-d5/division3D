import ISystem from "../types";
import { loadFileObjects, loadObjects, loadRoom } from "./loaders";
import { dragObject, dropObject, grabObject, pickObject, unpickObject } from "./input";
import { ExecutionTime as ET } from "@/ecs/utilities/Types";
import { AbstractMesh } from "@babylonjs/core";

interface IRegisterStaticSystems extends ISystem {
  onSceneReady?: () => void;
  onObjectPick?: () => void;
  onObjectUnpick?: () => void;
}

const registerStaticSystems = async (props: IRegisterStaticSystems) => {
  const { onSceneReady, onObjectPick, onObjectUnpick, ...wce } = props;
  const { world: w } = wce;
  
  w.systemManager.register(loadObjects(wce), ET.BEFORE_RENDER);
  w.systemManager.register(loadFileObjects(wce), ET.BEFORE_RENDER);
  w.systemManager.register(loadRoom(wce), ET.BEFORE_RENDER);
  w.systemManager.register(onSceneReady, ET.SCENE_READY);
  w.systemManager.register(pickObject(wce, onObjectPick), ET.WINDOW_MOUSE_DOWN);
  w.systemManager.register(unpickObject(wce, onObjectUnpick), ET.WINDOW_MOUSE_DOWN);
  w.systemManager.register(grabObject(wce), ET.WINDOW_MOUSE_DOWN);
  w.systemManager.register(dragObject(wce), ET.POINTER);
  w.systemManager.register(dropObject(wce), ET.WINDOW_MOUSE_UP);
};

export default registerStaticSystems;
export { loadObjects };
