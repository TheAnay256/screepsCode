let utils = require("creeps_util");
let creepState = require("creeps_creepState");

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        switch(creep.memory.state) {
            case creepState.building: //goes to nearest construction site, builds it
                if(creep.memory.currentTarget) {
                    let target = Game.getObjectById(creep.memory.currentTarget.id);
                    let buildResult = creep.build(target);

                    if(buildResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    } else if ( buildResult == ERR_INVALID_TARGET ) { //If creep finishes building, find structure at that point and dump rest of energy into it
                        creep.memory.state = creepState.reinforcing;
                        creep.say("reinforce");
                        let targetRoomPos = utils.getRoomPositionFromMemoryPos(creep.memory.currentTarget.pos);
                        creep.memory.currentTarget = utils.getStructureFromRoomPos(creep, targetRoomPos);
                    }
                } else {
                    creep.say("idle");
                    creep.memory.state = creepState.idling;
                }
                break;
            case creepState.reinforcing: //if construction is finished, dumps rest of energy into it if applicable
                if(creep.memory.currentTarget) {
                    let repairTarget = Game.getObjectById(creep.memory.currentTarget.id);
                    let repairResult = creep.repair(repairTarget);
                    if(repairResult != OK) {
                        creep.say("refill");
                        creep.memory.state = creepState.refilling;
                        creep.memory.currentTarget = null;
                    }
                }
                break;
            case creepState.refilling: //fills back up and looks for a new construction site
                var spawn = utils.findRoomSpawn(creep);
                let withdrawAttempt = creep.withdraw(spawn, RESOURCE_ENERGY);
                if(withdrawAttempt == ERR_NOT_IN_RANGE){ //move to spawn to grab resources
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if((withdrawAttempt == OK && creep.carry.energy == creep.carryCapacity) || withdrawAttempt == ERR_FULL) { //Got enough energy? back to work
                    creep.memory.state = creepState.idling;
                    creep.say("idle");
                }
                break;
            case creepState.idling: //sits and polls for new construction site
                creep.memory.currentTarget = utils.findConstructionSite(creep);
                if(creep.memory.currentTarget) { //only go for a construction site if one exists
                    console.log(creep.name + " found construction site: " + creep.memory.currentTarget.id);
                    creep.memory.state = creepState.building;
                    creep.say("build");
                }
                break;
            default:
                creep.memory.state = creepState.refilling;
        }
    }
};

module.exports = roleBuilder;
