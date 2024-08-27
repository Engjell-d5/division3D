import World from "@/ecs/World";
import React, { useContext, useEffect, useRef, useState } from "react";
import initStaticComponents, { StaticComponents } from "./Components";
import initStaticEntities, { StaticEntities } from "./Entities";
import initWorld from "./Initiators";
import registerStaticSystems from "./Systems";
import LoadingOverlay from "@/components/LoadingOverlay";
import { AbstractMesh, ArcRotateCamera, Color3, Matrix, SceneLoader, Vector3 } from "@babylonjs/core";
import { IModel } from "@/data/models";
import Tutorial from "@/components/tutorial/Tutorial";

interface EcsContextState {
  world: World; // World instance is exposed to all children
  components: ReturnType<typeof initStaticComponents>;
  entities: ReturnType<typeof initStaticEntities>;
  addItem: (item: IModel) => void;
  isObjectPicked: boolean;
}

// Set's the initial state of the context
const EcsContext = React.createContext<EcsContextState>({
  world: null!,
  components: null!,
  entities: null!,
  addItem: () => {},
  isObjectPicked: false,
});

interface ProviderProps {
  children: React.ReactNode;
}

const MAX_ENTITIES = 1000;

export const EcsProvider = (props: ProviderProps) => {
  const { children } = props;
  const canvasRef = useRef(null!);
  const components = useRef<StaticComponents>(null!);
  const entities = useRef<StaticEntities>(null!);
  const [world, setWorld] = useState<World>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [isObjectPicked, setIsObjectPicked] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();
      },
      false
    );

    const world = new World(MAX_ENTITIES, canvasRef.current);

    setWorld(world);
    components.current = initStaticComponents(world); // Register components
    entities.current = initStaticEntities(world); // Create entities

    const props = {
      world,
      components: components.current,
      entities: entities.current,
    };

    initWorld(props);

    canvas.addEventListener(
      "drop",
      (event) => {
        event.preventDefault();
        console.log("something was dropped");

        const files = event.dataTransfer!.files;

        //Temporary, needs to be cleaned up
        for (const file of files) {
          const newItem = world.entityManager.create();

          world.entityManager.addComponent(
            newItem,
            components.current.fileLoadable,
            {
              file: file,
            }
          );

          world.entityManager.addComponent(newItem, components.current.grid);
        }
      },
      false
    );

    registerStaticSystems({
      ...props,
      onSceneReady: () => setIsLoading(false),
      onObjectPick: () => setIsObjectPicked(true),
      onObjectUnpick: () => setIsObjectPicked(false),
    });

    props.world.initRender();
  }, []);

  const handleAddItem = (item: IModel) => {
    const newItem = world.entityManager.create();

   

    world.entityManager.addComponent(newItem, components.current.grid);

    const camera : ArcRotateCamera = world.entityManager.getComponent(entities.current.camera, components.current.camera)[world.entityManager.getArchTypeId(entities.current.camera)];

    const forward = camera.getDirection(Vector3.Forward());

    const position = camera.position.clone();

    position.addInPlace(forward.normalize().scale(1.5));

    world.entityManager.addComponent(newItem, components.current.loadable, {
      path: item.glb,
      position
    });
  };

  return (
    <EcsContext.Provider
      value={{
        world,
        components: components.current,
        entities: entities.current,
        addItem: handleAddItem,
        isObjectPicked,
      }}
    >
      <main className="relative flex max-h-screen min-h-screen w-full flex-col bg-gradient-to-l from-slate-300 to-gray-600">
        {/* Will always render a canvas */}
        <canvas ref={canvasRef} className="min-h-screen max-h-screen" />

        {/* Render children */}
        {children}

        <LoadingOverlay show={isLoading} />
      </main>
    </EcsContext.Provider>
  );
};

export const useEcs = () => {
  const values = useContext(EcsContext);

  // Error handle if trying to use this outside of a EcsProvider
  if (!values) {
    throw new Error("useEcs must be used within a EcsProvider.");
  }

  return values;
};
