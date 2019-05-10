
/**
 * 夹子怪物模型
 * 只处理与地板产生的碰撞
 */
var MClip = {};

var Enum = Global.Common.Enum;

/**
 * 夹子怪物数据初始化
 */
MClip.init = function () {
    // 类型
    this.type = Enum.TYPE.CLIP;
    // 怪物属性
    this.attr = {};
    // 弹性
    this.attr.elastic = 0;
    // 最大速度
    this.attr.maxVelocity = cc.Vec2.ZERO;
    // 最小速度
    this.attr.minVelocity = cc.Vec2.ZERO;
    // 反弹力
    this.attr.bouncePower = 0;
    // 加速力
    this.attr.acceleratePower = 0;
    // 价值
    this.attr.cost = 0;
    // 携带金币
    this.attr.coins = 0;
};

module.exports = MClip;
