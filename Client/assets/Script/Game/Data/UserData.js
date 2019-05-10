
var PassConfig = require("PassConfig");
var LevelUpConfig = require("LevelUpConfig");
var GameConst = require("GameConst");

/**
 * 数据管理器
 */
var Userdata = {};

Userdata.init = function () {
    // 当前各项数值等级
    // this.allLevel = [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
    this.allLevel = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // 金币总量
    this.totalCoins = 0;
    // 墙体位置 
    this.WallPos = [];
    var maxPassID = PassConfig.getMaxPassID();
    var passNum = PassConfig.getPassNum();
    for (let index = 0; index < passNum; index++) {
        var lastPassLength = this.WallPos.length ? this.WallPos[this.WallPos.length-1] : 0;
        var wallPos = lastPassLength + PassConfig.getDataByPassID(index).wallpos;
        this.WallPos.push(wallPos);
    }
    // 墙体厚度
    this.WallWidth = 2100;
    // 关卡序号
    this.PassID = 0;
    // 最大关卡序号
    // this.MaxPassID = 0;
};

Userdata.isInWall = function (x) {
    var passId = Userdata.getPassID();

    var posx = Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + Userdata.WallWidth;

    if (!Userdata.isLeftWall(x) && !Userdata.isRightWall(x)) {
        return true;        
    }
    return false;  
},

Userdata.isLeftWall = function (x) {
    var passId = Userdata.getPassID();

    var posx = Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + Userdata.WallWidth;

    if (x < leftPosX) {
        return true;
    }

    return false;
};

Userdata.isRightWall = function (x) {
    var passId = Userdata.getPassID();

    var posx = Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + Userdata.WallWidth;

    if (x > rightPosX) {
        return true;
    }

    return false;
};

Userdata.getWallPosByPassID = function (passId) {
    if (passId >= this.WallPos.length) {
        this.WallPos.push(this.WallPos[this.WallPos.length-1] + PassConfig.getDataByPassID(passId).wallpos);
    }
    return this.WallPos[passId];
}

Userdata.setPassID = function (passId) {
    this.PassID = passId;
}

Userdata.getPassID = function () {
    return this.PassID;
}

Userdata.setMaxPassID = function (passId) {
    var maxPassID = this.getMaxPassID();
    this.MaxPassID = Math.max(passId , maxPassID);
}

Userdata.getMaxPassID = function () {
    return this.MaxPassID || 0;
}

Userdata.setMaxMileage = function (num) {
    var mileage = this.getMaxMileage();
    this.maxMileage = Math.max(num , mileage);
}

Userdata.getMaxMileage = function () {
    return this.maxMileage || 0;
}

Userdata.getLevelByIndex = function (index) {
    return this.allLevel[index];
};

Userdata.setLevelByIndex = function (index , level) {
    if (level <= LevelUpConfig.getMaxLevelByIndex(index)) {
        this.allLevel[index] = level;
    }
};

Userdata.toNextLevelByIndex = function (index) {
    var nextLevel = this.getLevelByIndex(index) + 1;
    this.setLevelByIndex(index , nextLevel);
};

Userdata.getPassMileage = function (passId) {
    var pos = 0;
    for (let index = 0; index < passId+1; index++) {
        pos += PassConfig.getDataByPassID(index).wallpos;
    }
    return pos / 30;
};

// Userdata.init();
module.exports = Userdata;