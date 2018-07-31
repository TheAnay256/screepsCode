var towerHandler = require('tower');
var creepSpawn = require('creepSpawn');
var creepBehavior = require('creeps_creepBehavior');

module.exports.loop = function () {

    towerHandler.run();

    creepSpawn.run();

    creepBehavior.run();
}
