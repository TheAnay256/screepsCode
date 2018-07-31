var towerHandler = require('tower');
var creepSpawn = require('spawn_creepSpawn');
var creepBehavior = require('creeps_creepBehavior');

module.exports.loop = function () {

    towerHandler.run();

    creepSpawn.run();

    creepBehavior.run();
}
