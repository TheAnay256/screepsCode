let spawnPopulation = require("spawn_spawnPopulation");

let creepSpawn = {
    run: function() {
        Object.keys(Game.rooms).forEach(function(roomId) {
            let room = Game.rooms[roomId];
            let roomPopulation = spawnPopulation.getSpawnPopulation(room);

            //spawn creeps in room if pop too low
            roomPopulation.creepTypes.some((type) => {
                if(_.filter(Game.creeps, (creep) => creep.memory.role == type).length < roomPopulation.creepPopulation[type]){
                    spawnCreep(room, type, roomPopulation.creepParts[type]);
                    return true;
                }
            });
        });
    }
};

var spawnCreep = function(room, creepType, creepParts) {
    //Clear old creeps from memory
    clearDeadCreeps();

    let spawn = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN);
        }
    })[0];

    //Spawn creeps by type
    var newName = creepType + Game.time;

    let spawnResult = spawn.spawnCreep(creepParts, newName, {memory: {role: creepType}});
    if(spawnResult == OK){
        console.log('Spawning new ' + creepType + ': ' + newName + ' in room: ' + room.name);
    }
};

var clearDeadCreeps = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};

module.exports = creepSpawn;
