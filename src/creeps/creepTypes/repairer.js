let utils = require('creeps_util');
let creepState = require('creeps_creepState');

let structuresToRepair = [STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_CONTAINER];

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        switch(creep.memory.state) {
            case creepState.repairing:
                if(creep.memory.currentTarget) {
                    let target = Game.getObjectById(creep.memory.currentTarget.id);
                    let repairAttempt = creep.repair(target);
                    if( repairAttempt == ERR_NOT_IN_RANGE ) { //if out of range, move to target
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    } else if( repairAttempt == ERR_NOT_ENOUGH_RESOURCES ) { //If out of energy, go get more
                        creep.memory.state = creepState.refilling;
                        creep.say("refill");
                    }
                } else { //If no target, go refill and find a new one
                    creep.memory.state = creepState.refilling;
                }
                break;
            case creepState.refilling:
                var spawn = utils.findRoomSpawn(creep);
                let withdrawAttempt = creep.withdraw(spawn, RESOURCE_ENERGY); //Attempt to withdraw energy
                if(withdrawAttempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}}); //If not close enough, move to spawn
                } else if((withdrawAttempt == OK && creep.carry.energy == creep.carryCapacity) || withdrawAttempt == ERR_FULL) { //Got enough energy? back to work
                    creep.memory.currentTarget = utils.findLeastRepairedStructure(creep, structuresToRepair);
                    console.log(creep.name + " finding new repair target: " + creep.memory.currentTarget.id);
                    creep.memory.state = creepState.repairing;
                    creep.say("repair");
                }
                break;
            default:
                creep.memory.state = creepState.refilling;
        }
    }
};

module.exports = roleRepairer;
