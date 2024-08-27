import { useEcs } from "@/context/EcsContext";
import { Button } from "./ui/button";
import { removeObject, rotateObject } from "@/context/Systems/object";

const Actions = () => {
  const { isObjectPicked, world, entities, components } = useEcs();

  const handleRotatePickedObject = () => {
    rotateObject({world, components, entities});
  };

  const handleDeletePickedObject = () => {
    removeObject({world, components, entities});
  };

  if(!isObjectPicked) return null;

  return (
    <div className="flex gap-2 pointer-events-auto">
      <Button onClick={(e) => { e.preventDefault(); handleRotatePickedObject()}}>Rotate</Button>
      <Button onClick={(e) => { e.preventDefault(); handleDeletePickedObject()}}>Delete</Button>
    </div>
  );
};

export default Actions;
