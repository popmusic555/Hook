
/**
 * 普通怪物模型
 * 只处理与地板、墙体产生的碰撞
 */
var MNormal = {};

var Enum = Global.Common.Enum;

/**
 * 普通怪物数据初始化
 */
MNormal.init = function () {
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
    // 携带金币
    this.attr.coins = 0;
};

/**
 * 处理碰撞逻辑
 * 
 * @param {any} contact 碰撞参数
 * @param {any} self 自身
 * @param {any} other 碰撞到对象
 */
MNormal.handleCollision = function (contact , self , other) {
    // 碰撞到对象类型
    var type = other.getType();
    switch (type) {
        case Enum.TYPE.FLOOR:
            // 怪物落在地板上 不可忽略系统碰撞，以防穿透地板
            this.collisionFloor(contact , self , other);
            break;
        case Enum.TYPE.WALL:
            // 玩家撞到墙上 不可忽略系统碰撞，以防穿透墙体
            this.collisionWall(contact , self , other);
            break;
        case Enum.TYPE.PLAYER:
            // 怪物无法与玩家碰撞
            break;
        default:
            // 怪物无法与怪物碰撞
            break;
    }
};

/**
 * 碰撞到地板
 * 碰撞地板正常弹起
 * 
 * @param {any} contact 碰撞参数
 * @param {any} player 玩家对象
 * @param {any} floor 地板对象
 */
MNormal.collisionFloor = function (contact , player , floor) {
    
};

/**
 * 碰撞到墙
 * 碰撞到墙体的任何物体都必须停止
 * 
 * @param {any} contact 碰撞参数
 * @param {any} player 玩家对象
 * @param {any} wall 墙体对象
 */
MNormal.collisionWall = function (contact , player , floor) {

};

module.exports = MNormal;
