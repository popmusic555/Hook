
/**
 * 墙体模型
 * 不处理任何碰撞
 */
var MWall = {};

var Enum = Global.Common.Enum;

/**
 * 墙体数据初始化
 */
MWall.init = function () {
    // 类型
    this.type = Enum.TYPE.WALL;
    // 墙体属性
    this.attr = {};
    // 墙体宽度
    this.attr.width = Global.Common.Const.WALL_WIDTH;
    // 穿越速度
    this.attr.crossSpeed = 0;
    // 价值
    this.attr.cost = 0;
    // 携带金币
    this.attr.coins = 0;
    // 携带能量
    this.attr.energy = 0;
    // 加速力
    this.attr.acceleratePower = 0;
    // GameOver速度
    this.attr.endSpeed = 0;
    // 距离上一关的距离
    this.attr.distance = 0;

    // 用户游戏内数据
    this.gamedata = {};
    // 关卡ID
    this.gamedata.pass = 0;

    // 墙体配置表
    var config = [];
    config[0] = {
        passid:0,
        crossSpeed:900,
        accelerate:-300,
        cost:100,
        carryCoins:0,
        carryEnergy:10,
        distance:6000,
    };
    this.config = config;
};

MWall.setConfig = function (config) {
    this.config = config;
};

/**
 * 根据关卡更新PassID
 * 
 * @param {any} passID 关卡ID
 */
MWall.updateByPass = function (passID) {
    var data = null;
    if (passID >= this.config.length) {
        data = this.config[this.config.length-1];    
    }
    else
    {
        data = this.config[passID];
    }

    this.attr.crossSpeed = data.crossSpeed;
    this.attr.acceleratePower = data.accelerate;
    this.attr.cost = data.cost;
    this.attr.coins = data.carryCoins;
    this.attr.energy = data.carryEnergy;
    this.attr.distance = data.distance;

    console.log("UpdateByPass " , passID);
};

/**
 * 获取关卡ID
 * 
 * @returns 关卡ID
 */
MWall.getPassID = function () {
    return this.gamedata.pass;
}

/**
 * 设置关卡ID
 * 
 * @param {any} passid 关卡ID
 */
MWall.setPassID = function (passid) {
    this.gamedata.pass = passid;
    // 更新关卡ID
    Global.Model.MPlayer.updateByPass(passid);
    Global.Model.MFloor.updateByPass(passid);
    Global.Model.MWall.updateByPass(passid);
}

/**
 * 是否游戏结束
 * 
 */
MWall.isGameOver = function (velocity) {
    if (velocity.x <= this.attr.endSpeed) {
        return true;
    }
    return false;
};

/**
 * 获取穿越速度
 * 
 */
MWall.getCrossSpeed = function () {
    return this.attr.crossSpeed;
};

/**
 * 是否可以穿越
 * 
 */
MWall.isCross = function (velocity) {
    if (velocity.x >= this.attr.crossSpeed) {
        return true;
    }
    return false;
}

/**
 * 根据关卡ID获取墙的位置
 *
 * @param {*} passid
 */
MWall.getPosXByPassID = function (passid) {
    if (!passid && passid != 0) {
        passid = this.getPassID();
    }

    var wallPosx = 0;
    for (let index = 0; index < passid+1; index++) {
        var cfg = this.config[index];
        wallPosx += cfg.distance;
    }

    return wallPosx;
};  

/**
 * 是否在墙体内
 *
 * @param {*} posx 在墙体内
 * @param {*} passid 关卡ID
 * @returns 是否在墙体内
 */
MWall.isInside = function (posx , passid) {
    if (!passid && passid != 0) {
        passid = this.getPassID();
    }

    var wallPosLeft = this.getPosXByPassID(passid);
    var wallPosRight = wallPosLeft + this.attr.width;

    if (posx >= wallPosLeft && posx <= wallPosRight) {
        return true;    
    }

    return false;
};


module.exports = MWall;