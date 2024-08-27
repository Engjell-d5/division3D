import { useEcs } from "@/context/EcsContext";
import { Button } from "./ui/button";
import { removeObject } from "@/context/Systems/object";

const Actions = () => {
  const { isObjectPicked, world, entities, components } = useEcs();

  const handleDeletePickedObject = () => {
    removeObject({world, components, entities});
  };

  if(!isObjectPicked) return null;

  return (
    <div className="flex gap-2 pointer-events-auto">
      <Button onClick={(e) => { e.preventDefault(); handleDeletePickedObject()}}>Delete</Button>
    </div>
  );
};

export default Actions;
