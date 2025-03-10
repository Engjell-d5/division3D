import ArcheType from "./ArcheType";
import World from "../World";

export default class ArcheTypeManager {

    private world;
    private archeTypes : Map<string, ArcheType>;

    constructor(world: World) {
        this.world = world;
        this.archeTypes = new Map<string, ArcheType>();
    }

    findOrCreateArcheType(componentDefinitions : Array<number> | Uint32Array, mask: Uint32Array | null = null): ArcheType {
        const maskString = componentDefinitions.join(",");

        const archeType = this.archeTypes.get(maskString);

        if(archeType) {
            this.world.query.clearAllCache();
            return archeType;
        } else {
            
            if(mask === null) {
                mask = new Uint32Array(componentDefinitions[componentDefinitions.length - 1] + 1); //number of components it will have
    
                for(let index = 0; index < componentDefinitions.length; index ++) {
                    mask[componentDefinitions[index]] |= 1 << componentDefinitions[index];
                }
            }
            
            this.world.query.clearAllCache();
            const archeType = new ArcheType(this.world, componentDefinitions, mask);
            this.archeTypes.set(maskString, archeType);
            return archeType;
        }
    }

    get(mask: string) : ArcheType | null {
        const archeType = this.archeTypes.get(mask)!;
        
        if(archeType) {
            return archeType;
        } else {
            return null;
        }
    }

    getWithComponents(mask: Uint32Array | Array<number>) {
        const archeTypes = [];

        let values = this.archeTypes.values();

        for(let index = 0; index < this.archeTypes.size; index ++) {

            const value: ArcheType = values.next().value;

            if(value.hasComponents(mask)) {
                archeTypes.push(value);
            }
        }

        return archeTypes;
    }

    getArchetypes(withMask: Uint32Array | Array<number>, withoutMask: Uint32Array | Array<number>) {
        const archeTypes = [];

        let values = this.archeTypes.values();

        for(let index = 0; index < this.archeTypes.size; index ++) {

            const value: ArcheType = values.next().value;

            if(value.hasComponents(withMask) && value.hasNotComponents(withoutMask)) {
                archeTypes.push(value);
            }
        }

        return archeTypes;
    }

    getWithoutComponents(mask: Uint32Array | Array<number>) {
        const archeTypes = [];
        
        let values = this.archeTypes.values();

        for(let index = 0; index < this.archeTypes.size; index ++) {

            const value : ArcheType = values.next().value;

            if(value.hasNotComponents(mask)) {
                archeTypes.push(value);
            }
        }

        return archeTypes;
    }
}