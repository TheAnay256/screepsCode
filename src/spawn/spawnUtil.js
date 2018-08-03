let util = {
    findRoomSpawn: function(room) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        })[0];
    }
}

module.exports = util;
