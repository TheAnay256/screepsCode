let utils = require('creeps_util');
let creepState = require('creeps_creepState');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        switch(creep.memory.state) {
            case creepState.upgrading:
                let upgradeAttempt = creep.upgradeController(creep.room.controller); //Attempt to upgrade controller
                if( upgradeAttempt == ERR_NOT_IN_RANGE ) { //If not close enough, move toward controller
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                } else if ( upgradeAttempt == ERR_NOT_ENOUGH_RESOURCES ) { //Out of energy? Get some more
                    creep.memory.state = creepState.refilling;
                    creep.say('refill');
                }
                break;
            case creepState.refilling:
                var spawn = utils.findRoomSpawn(creep);
                let withdrawAttempt = creep.withdraw(spawn, RESOURCE_ENERGY); //Attempt to withdraw energy
                if(withdrawAttempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}}); //If not close enough, move to spawn
                } else if((withdrawAttempt == OK && creep.carry.energy == creep.carryCapacity) || withdrawAttempt == ERR_FULL) { //Got enough energy? back to upgrading
                    creep.memory.state = creepState.upgrading;
                    creep.say("upgrade");
                }
                break;
            default:
                creep.memory.state = creepState.refilling;
        }
    }
};

module.exports = roleUpgrader;
