let spawnUtil = require("spawn_spawnUtil");

let spawnPopulation = {
    calcSpawnQueue: function(room) {
        room.memory.spawnQueue = room.memory.spawnQueue || [];
        calcUpgraders(room);
        calcRepairers(room);
        calcBuilders(room);
        calcHarvesters(room);
    }
}

let creepToFrontOfQueue = function(room, role, parts) { //Adds a creep to front of spawn queue, to spawn next
    room.memory.spawnQueue.unshift({role: role, parts: parts});
}

let creepToBackOfQueue = function(room, role, parts) { //Adds a creep to back of spawn queue, to spawn after all others
    room.memory.spawnQueue.push({role: role, parts: parts});
}

let calcHarvesters = function(room) { //Adds harvester to front of queue if there are fewer than (x) per source
    let sourceCount = room.find(FIND_SOURCES).length;
    let creepsPerSource = 3;
    if((getTotalRoomCreepCount(room, "harvester") / creepsPerSource) < sourceCount) {
        creepToFrontOfQueue(room, "harvester", [WORK, CARRY, MOVE]);
    }
}

let calcBuilders = function(room) { //Adds builder to back of queue if there is a construction site up
    let constructionSiteCount = room.find(FIND_CONSTRUCTION_SITES).length;
    let creepsPerRoom = 1;
    if((getTotalRoomCreepCount(room, "builder") / creepsPerRoom) < constructionSiteCount) {
        creepToBackOfQueue(room, "builder", [WORK, CARRY, MOVE]);
    }
}

let calcRepairers = function(room) {
    let creepsPerRoom = 2;
    if(getTotalRoomCreepCount(room, "repairer") < creepsPerRoom) {
        creepToBackOfQueue(room, "repairer", [WORK, CARRY, MOVE]);
    }
}

let calcUpgraders = function(room) {
    let creepsPerRoom = 2;
    if(getTotalRoomCreepCount(room, "upgrader") < creepsPerRoom) {
        creepToBackOfQueue(room, "upgrader", [WORK, CARRY, MOVE]);
    }
}

let findRoomStructures = function(room, structureTypes) { //returns a list of structures in the room of specified types
    return room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structureTypes.includes(structure.structureType) && structure.hits < structure.hitsMax);
            }
        });
}

getTotalRoomCreepCount = function(room, role) { //Gets count of all creeps both in the room and on the queue of a certain role
    let roomCreepCount = room.find(FIND_MY_CREEPS).filter((creep) => { return creep.memory.role === role; }).length;
    let queueCreepCount = room.memory.spawnQueue.filter((creep) => { return creep.role === role; }).length;
    let spawningCreepRole = spawnUtil.findRoomSpawn(room).memory.spawningCreepRole;

    return roomCreepCount + queueCreepCount + (spawningCreepRole === role ? 1 : 0);
}

module.exports = spawnPopulation;
