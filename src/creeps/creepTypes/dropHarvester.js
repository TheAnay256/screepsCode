let utils = require('creeps_util');

var dropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //Finds the emptiest source to begin harvesting from
        if(!creep.memory.currentTarget) {
            creep.memory.currentTarget = utils.findLeastTargetedSource(creep);
        }

        var source = Game.getObjectById(creep.memory.currentTarget.id);

        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = dropHarvester;
