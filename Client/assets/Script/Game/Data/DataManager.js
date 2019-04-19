
/**
 * 数据管理器
 * 
 */
var DataManager = {};

DataManager.Userdata = {};

DataManager.Userdata.init = function () {
    // 发射速度
    this.launchingSpeed = 1500;
    // 墙体位置
    this.WallPosSpeed = [6000 , 12000];
    // 墙体厚度
    this.WallWidth = 2100;
    // 关卡序号
    this.PassID = 0;
    // 最大关卡序号
    this.MaxPassID = 0;
};

DataManager.Userdata.isInWall = function (x) {
    var passId = DataManager.Userdata.getPassID();

    var posx = DataManager.Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + DataManager.Userdata.WallWidth;

    if (!DataManager.Userdata.isLeftWall(x) && !DataManager.Userdata.isRightWall(x)) {
        return true;        
    }
    return false;  
},

DataManager.Userdata.isLeftWall = function (x) {
    var passId = DataManager.Userdata.getPassID();

    var posx = DataManager.Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + DataManager.Userdata.WallWidth;

    if (x < leftPosX) {
        return true;
    }

    return false;
};

DataManager.Userdata.isRightWall = function (x) {
    var passId = DataManager.Userdata.getPassID();

    var posx = DataManager.Userdata.getWallPosByPassID(passId);

    var leftPosX = posx;
    var rightPosX = posx + DataManager.Userdata.WallWidth;

    if (x > rightPosX) {
        return true;
    }

    return false;
};

DataManager.Userdata.getWallPosByPassID = function (passId) {
    if (passId >= this.WallPosSpeed.length) {
        this.WallPosSpeed.push(this.WallPosSpeed[this.WallPosSpeed.length-1] + 30000);
    }
    return this.WallPosSpeed[passId];
}

DataManager.Userdata.setPassID = function (passId) {
    this.PassID = passId;
}

DataManager.Userdata.getPassID = function () {
    return this.PassID;
}

DataManager.Userdata.setMaxPassID = function (passId) {
    this.MaxPassID = passId;
}

DataManager.Userdata.getMaxPassID = function () {
    return this.MaxPassID;
}

DataManager.Userdata.init();

module.exports = DataManager;