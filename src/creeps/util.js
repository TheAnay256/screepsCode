let util = {
    findLeastTargetedSource: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        if(sources.length > 0){
            let targetSource = findLeastTargetedObject(creep, sources);
            return creepMemoryify(targetSource);
        }
        return null;
    },

    findLeastRepairedStructure: function(creep, structureTypes) {
        let structures = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structureTypes.includes(structure.structureType) && structure.hits < structure.hitsMax);
                            }
                        });
        if(structures.length > 0){
            let targetStructure = findLeastRepairedStructureFromList(creep, structures);
            return creepMemoryify(targetStructure);
        }
        return null;
    },

    findRoomSpawn(creep) {
        return creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        })[0];
    }
}

//INTERNAL UTILITY FUNCTIONS
let findLeastTargetedObject = function(creep, objectList) {
    let frequency = objectList.map(function(object) {
        return creep.room.find(FIND_MY_CREEPS).filter((curCreep) => {
            if(curCreep.memory.currentTarget){
                return object.id == curCreep.memory.currentTarget.id;
            }
            return false;
        }).length;
    });

    return objectList[frequency.indexOf(Math.min.apply(Math, frequency))];
};

let findLeastRepairedStructureFromList = function(creep, objectList) {
    let targetHits = objectList.map(target => target.hits);
    return objectList[targetHits.indexOf(Math.min.apply(Math, targetHits))];
};

let creepMemoryify = function(object) {
    return {id: object.id, pos: object.pos};
};

module.exports = util;
