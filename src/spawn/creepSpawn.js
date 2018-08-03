let spawnPopulation = require("spawn_spawnPopulation");
let spawnUtil = require("spawn_spawnUtil");

let creepSpawn = {
    run: function() {
        Object.keys(Game.rooms).forEach((roomId) => {
            let room = Game.rooms[roomId];
            spawnPopulation.calcSpawnQueue(room); //Calculate spawn queue, every tick for now

            let spawn = spawnUtil.findRoomSpawn(room);
            if(room.memory.spawnQueue.length > 0){
                spawnNextCreep(room);
            } else if ( room.memory.spawnQueue.length == 0 && !spawn.spawning ) {
                spawn.memory.spawningCreepRole = null;
            }
        });
    }
};

var spawnNextCreep = function(room) {
    //Clear old creeps from memory
    clearDeadCreeps();

    //Self explanatory - spawns creep
    let spawn = spawnUtil.findRoomSpawn(room);
    let creepToSpawn = room.memory.spawnQueue[0];
    var newName = creepToSpawn.role + Game.time;

    let spawnResult = spawn.spawnCreep(creepToSpawn.parts, newName, {memory: {role: creepToSpawn.role}});
    if(spawnResult == OK){
        console.log('Spawning new ' + creepToSpawn.role + ': ' + newName + ' in room: ' + room.name);
        spawn.memory.spawningCreepRole = creepToSpawn.role;
        room.memory.spawnQueue.shift(); //Erase first entry in array memory if creep spawned
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
