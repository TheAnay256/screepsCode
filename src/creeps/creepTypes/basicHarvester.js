let utils = require('creeps_util');
let creepState = require('creeps_creepState');

var basicHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        switch(creep.memory.state) {
            case creepState.harvesting:
                let source = Game.getObjectById(creep.memory.currentTarget.id);
                let harvestingAttempt = creep.harvest(source); //Attempt to harvest
                if( creep.carry.energy >= creep.carryCapacity ) { //If creep is full, drop off energy
                    creep.memory.state = creepState.droppingOff;
                    creep.say('dropoff');
                } else if ( harvestingAttempt == ERR_NOT_IN_RANGE ) { //Move to targeted source
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            case creepState.droppingOff:
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    let dropoffAttempt = creep.transfer(targets[0], RESOURCE_ENERGY);
                    if(creep.carry.energy < creep.carryCapacity) { //if creep needs energy, go get some
                        creep.say("harvest");
                        creep.memory.currentTarget = utils.findLeastTargetedSource(creep);
                        creep.memory.state = creepState.harvesting;
                    } else if ( dropoffAttempt == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}}); //move to spawn if too far away
                    }
                }
                break;
            default:
                creep.memory.state = creepState.droppingOff;
        }
    }
};

module.exports = basicHarvester;
