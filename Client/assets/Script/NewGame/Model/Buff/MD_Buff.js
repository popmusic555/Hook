
/**
 * Buff模型
 * 挂载在怪物上，以修改X与Y轴上速度
 */
var MBuff = {};

/**
 * Buff数据初始化
 */
MBuff.init = function () {
    // 类型
    this.type = Enum.TYPE.NORMAL;
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
};

module.exports = MBuff;
