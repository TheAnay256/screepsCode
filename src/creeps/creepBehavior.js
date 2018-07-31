var roleHarvester = require('creeps_creepTypes_harvester');
var roleUpgrader = require('creeps_creepTypes_upgrader');
var roleBuilder = require('creeps_creepTypes_builder');
var roleRepairer = require('creeps_creepTypes_repairer');
var creepBehavior = {
    run: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role === 'repairer') {
                roleRepairer.run(creep);
            }
        }
    }
}

module.exports = creepBehavior;
