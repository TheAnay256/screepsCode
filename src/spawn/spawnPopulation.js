let spawnPopulation = {
    getSpawnPopulation: function(room) {
        return {
            creepTypes: ['harvester', 'upgrader', 'repairer', 'builder'],
            creepPopulation: {
                harvester: 6,
                upgrader: 2,
                repairer: 2,
                builder: 1
            },
            creepParts: {
                harvester: [WORK, CARRY, MOVE],
                upgrader: [WORK, CARRY, MOVE],
                repairer: [WORK, CARRY, MOVE],
                builder: [WORK, CARRY, MOVE]
            }
        }
    }
}

module.exports = spawnPopulation;
