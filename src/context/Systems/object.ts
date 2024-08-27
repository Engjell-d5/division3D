import ISystem from "../types";

export const rotateObject = ({ world: w, components: c, entities: e }: ISystem) => async () => {
  const archetypes = w.query.with(c.rotatable).with(c.mesh).execute();

  if (archetypes.length <= 0) {
    console.info("[rotate]: No archetype found");
    return null;
  }

  for( const archeType of archetypes) {
    for (
      let index = archeType.getEntities().length() - 1;
      index >= 0;
      index--
    ) {
      
      const entId = archeType.getEntityIdFromIndex(index);

      const mesh = archeType.getColumn(c.mesh)[index];

      console.log(mesh.rotation);
      mesh.rotation.y += 0.1;

    }
  }
};

export const removeObject = ({ world: w, components: c, entities: e }: ISystem) => {
   
};

