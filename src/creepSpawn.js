var creepTypes = ['harvester', 'upgrader', 'repairer', 'builder'];
var creepPopulation = {
    harvester: 6,
    upgrader: 2,
    repairer: 2,
    builder: 1,
};
var creepParts = {
    harvester: [WORK, CARRY, MOVE],
    upgrader: [WORK, CARRY, MOVE],
    repairer: [WORK, CARRY, MOVE],
    builder: [WORK, CARRY, MOVE]
}

var creepSpawn = {
    run: function() {
        //Spawn creeps if pop too low
        creepTypes.forEach((type) => {

            if(_.filter(Game.creeps, (creep) => creep.memory.role == type).length < creepPopulation[type]){
                spawnCreep(type);
            }
        });
    }
};

var spawnCreep = function(creepType) {
    //Clear old creeps from memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //Spawn creeps by type
    var newName = creepType + Game.time;

    if(Game.spawns['anayami'].spawnCreep(creepParts[creepType], newName, {memory: {role: creepType}}) == OK){
        console.log('Spawning new ' + creepType + ': ' + newName);
    }
}

module.exports = creepSpawn;
