
/**
 * 地板模型
 * 不处理任何碰撞
 */
var MFloor = {};

var Enum = Global.Common.Enum;

/**
 * 地板数据初始化
 */
MFloor.init = function () {
    // 类型
    this.type = Enum.TYPE.FLOOR;
    // 地板属性
    this.attr = {};
    // 弹性
    this.attr.elastic = 0.5;
    // 最大速度
    this.attr.maxVelocity = cc.Vec2.ZERO;
    // 最小速度
    this.attr.minVelocity = cc.Vec2.ZERO;
    // 反弹力
    this.attr.bouncePower = 1400;
    // 加速力
    this.attr.acceleratePower = 0;

    this.config = null;
};

MFloor.setConfig = function (config) {
    this.config = config;
};

/**
 * 根据关卡更新PassID
 * 
 * @param {any} passID 关卡ID
 */
MFloor.updateByPass = function (passID) {
    var data = null;
    if (passID >= this.config.length) {
        data = this.config[this.config.length-1];    
    }
    else
    {
        data = this.config[passID];
    }

    this.attr.elastic = data.elastic;
    this.attr.bouncePower = data.bounce;
    this.attr.acceleratePower = data.accelerate;

    console.log("UpdateByPass " , passID);
};

/**
 * 获取用户属性
 * 
 * @returns 用户属性
 */
MFloor.getAttr = function () {
    return this.attr;
};

/**
 * 初始化
 * 
 * @param {any} elastic 弹性
 * @param {any} bouncePower 反弹力
 * @param {any} acceleratePower 加速力 
 */
MFloor.initialization = function (elastic , bouncePower , acceleratePower) {
    this.attr.elastic = elastic;
    this.attr.bouncePower = bouncePower;
    this.attr.acceleratePower = acceleratePower;
};


/**
 * 根据关卡刷新数值
 * 
 * @param {any} passID 
 */
MFloor.refreshByPass = function (passID) {
    var elastic = 0;
    var bouncePower = 0;
    var acceleratePower = 0;
    this.initialization(elastic,bouncePower,acceleratePower);
};

module.exports = MFloor;