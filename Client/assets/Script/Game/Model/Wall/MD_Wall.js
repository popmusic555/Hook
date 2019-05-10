
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
    // 穿越速度
    this.attr.crossSpeed = 0;
    // 价值
    this.attr.cost = 0;
    // 携带金币
    this.attr.coins = 0;
    // 加速力
    this.attr.acceleratePower = 0;
    // GameOver速度
    this.attr.endSpeed = 0;

    // 用户游戏内数据
    this.gamedata = {};
    // 关卡ID
    this.gamedata.pass = 0;
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


module.exports = MWall;