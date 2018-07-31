var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 refill');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.currentTarget = findConstructionSite(creep);
            if(creep.memory.currentTarget){
                creep.memory.building = true;
                creep.say('🚧 build');
            }
        }
        if(creep.memory.building) {
            if(creep.memory.currentTarget) {
                let target = Game.getObjectById(creep.memory.currentTarget.id);
                let buildResult = creep.build(target);
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if(buildResult == ERR_INVALID_TARGET){
                    creep.memory.building = false;
                    creep.memory.repairing = true;
                    creep.say("reinforce");
                    let targetRoomPos = getRoomPositionFromMemoryPos(creep.memory.currentTarget.pos);
                    console.log(targetRoomPos.lookFor(LOOK_STRUCTURES)[0].pos);
                    creep.memory.currentTarget = {id: targetRoomPos.lookFor(LOOK_STRUCTURES)[0].id,
                        pos: targetRoomPos.lookFor(LOOK_STRUCTURES)[0].pos};                
                }
            }
            else {
                creep.memory.building = false;
            }
        }
        if(creep.memory.repairing) {
            console.log(creep.memory.currentTarget.id);
            if(creep.memory.currentTarget) {
                if(creep.repair(Game.getObjectById(creep.memory.currentTarget.id)) != OK) {
                    creep.memory.repairing = false;
                    creep.memory.currentTarget = null;
                }
            }
            else{
                creep.memory.repairing = false;
            }
        }
        if(!creep.memory.building && !creep.memory.repairing) {
            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            })[0];
            
            if(creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

let findConstructionSite = function(creep) {
    let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    //finds least-frequently targeted sites
    if(sites.length > 0){
        let siteFrequency = sites.map(function(site) {
            return creep.room.find(FIND_MY_CREEPS).filter((curCreep) => {
                return site.id == curCreep.memory.currentSite;
            }).length;
        });
        let siteToTarget = sites[siteFrequency.indexOf(Math.min.apply(Math, siteFrequency))];
        return {id: siteToTarget.id, pos: siteToTarget.pos};
    }
    return null;
}

let getRoomPositionFromMemoryPos = function(pos) {
    return new RoomPosition(pos.x, pos.y, pos.roomName);
};

module.exports = roleBuilder;