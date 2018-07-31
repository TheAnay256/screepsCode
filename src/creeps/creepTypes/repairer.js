let utils = require('creeps_util');

let structuresToRepair = [STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_CONTAINER];

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.currentTarget = null;
            creep.say('refill');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.memory.currentTarget = utils.findLeastRepairedStructure(creep, structuresToRepair);
            console.log(creep.name + " finding new repair target: " + creep.memory.currentTarget.id);
            creep.say('repair');
        }

        if(creep.memory.repairing) {
            if(creep.memory.currentTarget){
                let target = Game.getObjectById(creep.memory.currentTarget.id);

                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else { creep.memory.currentTarget = null; }
        }
        else {
            let spawn = utils.findRoomSpawn(creep);

            if(creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;
