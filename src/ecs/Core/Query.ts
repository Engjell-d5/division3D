import { CacheResult, QueryType } from "../utilities/Types";
import World from "../World";
import ArcheType from "./ArcheType";

export default class Query {

    private world: World;
    private archeTypeCache : Map<string, CacheResult>;
    private entitiesCache : Map<string, CacheResult>;
    private withComponents : Array<number>;
    private withoutComponents : Array<number>;

    constructor(world: World) {
        this.world = world;
        this.archeTypeCache = new Map<string, CacheResult>();
        this.entitiesCache = new Map<string, CacheResult>();
        this.withComponents = new Array<number>();
        this.withoutComponents = new Array<number>();
    }

    with(component: number) {
        this.withComponents.push(component);
        return this;
    }

    without(component: number) {
        this.withoutComponents.push(component);
        return this;
    }

    execute() {

        const withMask = this.withComponents.join(",");
        const withoutMask = this.withoutComponents.join("_,");
        
        const maskString = withMask + withoutMask;
        
        const archsInCache : CacheResult | undefined = this.archeTypeCache.get(maskString);

        if(archsInCache && !archsInCache.isDirty) {
            this.withComponents = [];
            this.withoutComponents = [];
            return archsInCache.result;
        }

        let result: Array<ArcheType> = this.world.archeTypeManager.getArchetypes(this.withComponents, this.withoutComponents);
        this.withComponents = [];
        this.withoutComponents = [];

        if(archsInCache) {
            archsInCache.isDirty = false;
            archsInCache.result = result;
        } else {
            this.archeTypeCache.set(maskString, {isDirty: false, result: result});
        }
        return result;
    }

    get(componentDefinitions: Array<number>, queryType: QueryType, mask: Uint32Array | null | Array<number> = null) {
       
        if(!mask) {
            mask = this.getMask(componentDefinitions);
        }

        const maskString = mask.join(",");
        
        const archsInCache : CacheResult | undefined = this.archeTypeCache.get(maskString);

        if(archsInCache && !archsInCache.isDirty) {
            return archsInCache.result;
        }

        let result: Array<ArcheType> = [];

        if(queryType === QueryType.WITH) {
            result = this.world.archeTypeManager.getWithComponents(mask);
        } else if(queryType === QueryType.WITHOUT) {
            result = this.world.archeTypeManager.getWithoutComponents(mask);
        }  else if(queryType === QueryType.ONLY) {
            const archeType : ArcheType | null = this.world.archeTypeManager.get(maskString);

            if(archeType) {
                result.push(archeType);
            }
        }
        
        if(archsInCache) {
            archsInCache.isDirty = false;
            archsInCache.result = result;
        } else {
            this.archeTypeCache.set(maskString, {isDirty: false, result: result});
        }

        return result;
    }

    getEntities(componentDefinitions: Array<number>, queryType: QueryType) {

        const mask = this.getMask(componentDefinitions);
        const maskString = mask.join(",");
        
        const entsInCache: CacheResult | undefined = this.entitiesCache.get(maskString);

        if(entsInCache && !entsInCache.isDirty) {
           return this.entitiesCache.get(maskString)!.result;
        }

        let archeTypes = [];
        
        const archsInCache: CacheResult | undefined = this.archeTypeCache.get(maskString);

        if(archsInCache && !archsInCache.isDirty) {
            archeTypes = archsInCache.result;
        } else {
            if(queryType === QueryType.WITH) {
                archeTypes = this.get(componentDefinitions, QueryType.WITH);
            } else if(queryType === QueryType.WITHOUT) {
                archeTypes = this.get(componentDefinitions, QueryType.WITHOUT);
            }

            if(archsInCache) {
                archsInCache.isDirty = false;
                archsInCache.result = archeTypes;
            } else {
                this.archeTypeCache.set(maskString, {isDirty: false, result: archeTypes});
            }
        }
        
        if(queryType === QueryType.ONLY) {
            archeTypes = this.get(componentDefinitions, QueryType.ONLY); 

            if(entsInCache) {
                entsInCache.isDirty = false;
                entsInCache.result = archeTypes.getEntities().getValues();
            } else {
                this.entitiesCache.set(maskString, {isDirty: false, result: archeTypes.getEntities().getValues()});
            }
            return archeTypes.getEntities().getValues().subarray(0, archeTypes.getEntities().length());
        }

        if (archeTypes.length > 0) {
            
            let length = 0;

            for (let index = 0; index < archeTypes!.length; index++) {
                length += archeTypes[index]!.getEntities().length();
            }

            const entities = new Uint32Array(length);

            let startIndex = 0;

            for (let index = startIndex; index < archeTypes!.length; index++) {
                const archEntities = archeTypes[index]!.getEntities();

                for(let entIndex = 0; entIndex < archeTypes[index]!.getEntities().length(); entIndex ++) {
                    entities[startIndex + entIndex] = archeTypes[index]!.getEntities().getSparseId(entIndex);
                }

                startIndex += archEntities.length();
            }

            if(entsInCache) {
                entsInCache.result = entities;
                entsInCache.isDirty = false;
            } else {
                this.entitiesCache.set(maskString, {isDirty: false, result: entities});
            }
            return entities;
        } else {
            return [];
        }
    }

    private getMask(componentDefinitions: Array<number>) {
        return componentDefinitions.sort();
    }

    clearArcheTypeCache() {
        for(let [key, value] of this.archeTypeCache) {
            value.isDirty = true;
        }
    }

    clearEntitiesCache() {
        for(let [key, value] of this.entitiesCache) {
            value.isDirty = true;
        }
    }

    clearAllCache() {
        this.clearArcheTypeCache();
        this.clearEntitiesCache();
    }
}