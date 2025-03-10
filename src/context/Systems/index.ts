import ISystem from "../types";
import {  loadObject } from "./loaders";
import { ExecutionTime as ET } from "@/ecs/utilities/Types";
import { AbstractMesh } from "@babylonjs/core";
import {  rotateObject } from "./object";
import { followMouse, mouseDown, mouseUp, scroll } from "./input";
import { animateCustom, animateStandard, animationMaster } from "./animations";

interface IRegisterStaticSystems extends ISystem {
  onSceneReady?: () => void;
  onObjectPick?: () => void;
  onObjectUnpick?: () => void;
}

const registerStaticSystems = async (props: IRegisterStaticSystems) => {
  const { onSceneReady, onObjectPick, onObjectUnpick, ...wce } = props;
  const { world: w } = wce;
  
  w.systemManager.register(loadObject(wce), ET.BEFORE_RENDER);
  w.systemManager.register(rotateObject(wce), ET.BEFORE_RENDER);

  w.systemManager.register(followMouse(wce), ET.WINDOW_MOUSE_MOVE);
  w.systemManager.register(animateStandard(wce), ET.BEFORE_RENDER);
  w.systemManager.register(animateCustom(wce), ET.BEFORE_RENDER);
  w.systemManager.register(animationMaster(wce), ET.BEFORE_RENDER);



  w.systemManager.register(mouseUp(wce), ET.WINDOW_MOUSE_UP);
  w.systemManager.register(mouseDown(wce), ET.WINDOW_MOUSE_DOWN);
  w.systemManager.register(scroll(wce), ET.WINDOW_SCROLL);


  w.systemManager.register(onSceneReady, ET.SCENE_READY);
};

export default registerStaticSystems;
