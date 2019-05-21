
/**
 * 普通怪物模型
 * 只处理与地板、墙体产生的碰撞
 */
var MCoins = {};

var Enum = Global.Common.Enum;

/**
 * 普通怪物数据初始化
 */
MCoins.init = function () {
    // 类型
    this.type = Enum.TYPE.COINS;
    // 怪物属性
    this.attr = {};
    // 弹性
    this.attr.elastic = 0;
    // 最大速度
    // this.attr.maxVelocity = cc.Vec2.ZERO;
    this.attr.maxVelocity = cc.v2(20000 , 20000);
    // 最小速度
    // this.attr.minVelocity = cc.Vec2.ZERO;
    this.attr.minVelocity = cc.v2(300 , 0);
    // 反弹力
    this.attr.bouncePower = 0;
    // 加速力
    this.attr.acceleratePower = 0;
    // 价值
    this.attr.cost = 0;
    // 携带金币
    this.attr.coins = 0;
    // 携带能量
    this.attr.energy = 0;
};

/**
 * 处理碰撞逻辑
 * 
 * @param {any} contact 碰撞参数
 * @param {any} selfCollider 自身碰撞器
 * @param {any} otherCollider 碰撞到的对象
 */
MCoins.handleCollision = function (contact , selfCollider , otherCollider) {
    var selfObj = selfCollider.node.getComponent(Global.GameObj.GBase);
    var otherObj = otherCollider.node.getComponent(Global.GameObj.GBase);
    // 碰撞到对象类型
    var type = otherObj.getType();
    switch (type) {
        case Enum.TYPE.FLOOR:
            // 怪物落在地板上 不可忽略系统碰撞，以防穿透地板
            this.collisionFloor(contact , selfCollider , otherCollider);
            break;
        case Enum.TYPE.WALL:
            // 玩家撞到墙上 不可忽略系统碰撞，以防穿透墙体
            this.collisionWall(contact , selfCollider , otherCollider);
            break;
        case Enum.TYPE.PLAYER:
            // 怪物无法与玩家碰撞
            break;
        default:
            // 怪物无法与怪物碰撞
            contact.disabled = true;
            break;
    }
};

/**
 * 碰撞到地板
 * 碰撞地板正常弹起
 * 
 * @param {any} contact 碰撞参数
 * @param {any} monsterCollider 怪物碰撞器
 * @param {any} floorCollider 地板碰撞器
 */
MCoins.collisionFloor = function (contact , monsterCollider , floorCollider) {
    var monster = monsterCollider.node.getComponent(Global.GameObj.GBase);
    var floor = floorCollider.node.getComponent(Global.GameObj.GBase);
};

/**
 * 碰撞到墙
 * 碰撞到墙体的任何物体都必须停止
 * 
 * @param {any} contact 碰撞参数
 * @param {any} monsterCollider 怪物碰撞器
 * @param {any} wallCollider 墙体碰撞器
 */
MCoins.collisionWall = function (contact , monsterCollider , wallCollider) {
    var monster = monsterCollider.node.getComponent(Global.GameObj.GBase);
    var wall = wallCollider.node.getComponent(Global.GameObj.GBase);

    var wallTag = wallCollider.tag;

    switch (wallTag) {
        case 1:
            // 墙体1
            contact.disabled = true;
            break;
        case 2:
            // 墙体2
            monster.onDeath();
            break;
        case 3:
            // 墙体3
            contact.disabled = true;
            break;
    
        default:
            break;
    }
};

/**
 * 获取用户属性
 * 
 * @returns 用户属性
 */
MCoins.getAttr = function () {
    return this.attr;
};

/**
 * 限定X速度
 * 
 * @param {any} x 速度值
 */
MCoins.limitVelocityX = function (x) {
    x = Math.max(x , this.getAttr().minVelocity.x);
    x = Math.min(x , this.getAttr().maxVelocity.x);
    return x;
};
/**
 * 限定Y速度
 * 
 * @param {any} y 速度值
 */
MCoins.limitVelocityY = function (y) {
    y = Math.max(y , this.getAttr().minVelocity.y);
    y = Math.min(y , this.getAttr().maxVelocity.y);
    return y;
}

/**
 * 根据关卡更新PassID
 * 
 * @param {any} passID 关卡ID
 */
MCoins.updateByPass = function (passID) {
    console.log("MCoins UpdateByPass " , passID);
};

module.exports = MCoins;
