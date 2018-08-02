let spawnPopulation = require("spawn_spawnPopulation");

let creepSpawn = {
    run: function() {
        Object.keys(Game.rooms).forEach((roomId) => {
            let room = Game.rooms[roomId];
            spawnPopulation.calcSpawnQueue(room); //Calculate spawn queue, every tick for now

            if(room.memory.spawnQueue.length > 0){
                console.log("Spawning, queue:");
                console.log(room.memory.spawnQueue.map(item => item.role));
                spawnNextCreep(room);
            }
        });
    }
};

var spawnNextCreep = function(room) {
    //Clear old creeps from memory
    clearDeadCreeps();

    //Self explanatory - spawns creep
    let spawn = findRoomSpawn(room);
    let creepToSpawn = room.memory.spawnQueue[0];
    var newName = creepToSpawn.role + Game.time;

    let spawnResult = spawn.spawnCreep(creepToSpawn.parts, newName, {memory: {role: creepToSpawn.role}});
    console.log(spawnResult);
    if(spawnResult == OK){
        console.log('Spawning new ' + creepSpawn.role + ': ' + newName + ' in room: ' + room.name);
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

let findRoomSpawn = function(room) {
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN);
        }
    })[0];
}

module.exports = creepSpawn;
