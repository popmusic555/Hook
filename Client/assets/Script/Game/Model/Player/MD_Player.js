
/**
 * 用户模型
 * 处理与所有其他物体碰撞
 */
var MPlayer = {};
var Enum = Global.Common.Enum;

/**
 * 用户数据初始化
 */
MPlayer.init = function () {
    // 类型
    this.type = Enum.TYPE.PLAYER;
    // 用户属性
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

    // 初始发射速度
    this.attr.launchingVelocity = cc.Vec2.ZERO;
    // 能量上限
    this.attr.energyLimit = 0;
    // 离线奖励
    this.attr.offlineRewards = 0;
    // 冲击速度
    this.attr.impactSpeed = 0;
    // GameOver速度
    this.attr.endSpeed = 0;

    // 用户游戏内数据
    this.gamedata = {};
    
    // 游戏内获取到的金币奖励
    this.gamedata.rewardsCoins = 0;
    // 游戏内获取到的能量
    this.gamedata.energy = 0;
    // 游戏里程
    this.gamedata.mileage = 0;
    

    // 所有升级选项等级
    this.levels = [];

    this.resetGamedata();
};

/**
 * 根据关卡更新PassID
 * 
 * @param {any} passID 关卡ID
 */
MPlayer.updateByPass = function (passID) {
    
};

/**
 * 重置游戏内数据
 * 
 */
MPlayer.resetGamedata = function () {
    this.gamedata.rewardsCoins = 0;
    this.gamedata.energy = 0;
    this.gamedata.mileage = 0;
};

/**
 * 初始化所有升级选项等级
 * 
 * @param {any} levels 所有升级选项的等级
 */
MPlayer.initLevels = function (levels) {
    var len = levels.length;
    for (let index = 0; index < len; index++) {
        this.levels[index] = levels[index];
    }
};

/**
 * 获取用户属性
 * 
 * @returns 用户属性
 */
MPlayer.getAttr = function () {
    return this.attr;
};

/**
 * 获取里程
 * 
 * @returns 里程值
 */
MPlayer.getMileage = function () {
    return this.gamedata.mileage;
};

/**
 * 设置里程
 * 
 * @param {any} num 实际速度
 */
MPlayer.setMileage = function (num) {
    var mileage = Global.Common.Utils.toMileage(num);
    this.gamedata.mileage = mileage;
};

/**
 * 获取金币奖励
 * 
 * @returns 奖励
 */
MPlayer.getRewardsCoins = function () {
    return this.gamedata.rewardsCoins;
};

/**
 * 增加金币奖励
 * 
 * @param {any} num 增加的值
 */
MPlayer.addRewardCoins = function (num) {
    this.gamedata.rewardsCoins += num;
};

/**
 * 获取能量
 * 
 */
MPlayer.getEnergy = function () {
    return this.gamedata.energy;
};

/**
 * 限定X速度
 * 
 * @param {any} x 速度值
 */
MPlayer.limitVelocityX = function (x) {
    x = Math.max(x , this.getAttr().minVelocity.x);
    x = Math.min(x , this.getAttr().maxVelocity.x);
    return x;
};
/**
 * 限定Y速度
 * 
 * @param {any} y 速度值
 */
MPlayer.limitVelocityY = function (y) {
    y = Math.max(y , this.getAttr().minVelocity.y);
    y = Math.min(y , this.getAttr().maxVelocity.y);
    return y;
}

/**
 * 是否游戏结束
 * 
 */
MPlayer.isGameOver = function (velocity) {
    if (velocity.x <= this.attr.endSpeed) {
        return true;
    }
    return false;
};

MPlayer.launching = function () {
      
};

/**
 * 处理碰撞逻辑
 * 
 * @param {any} contact 碰撞数据
 * @param {any} self 自身
 * @param {any} other 碰撞到的对象
 */
MPlayer.handleCollision = function (contact , selfCollider , otherCollider) {
    // 碰撞到对象类型
    var selfObj = selfCollider.node.getComponent(Global.GameObj.GBase);
    var otherObj = otherCollider.node.getComponent(Global.GameObj.GBase);
    var type = otherObj.getType();
    switch (type) {
        case Enum.TYPE.FLOOR:
            // 玩家落在地板上 不可忽略系统碰撞，以防穿透地板
            this.collisionFloor(contact , selfCollider , otherCollider);
            break;
        case Enum.TYPE.WALL:
            // 玩家撞到墙上 不可忽略系统碰撞，以防穿透墙体
            this.collisionWall(contact , selfCollider , otherCollider);
            break;
        case Enum.TYPE.PLAYER:
            // 玩家无法与玩家碰撞
            break;
        default:
            // 玩家落在怪物上
            // 落在怪物上时忽略系统碰撞的逻辑，自己计算XY轴上的速度
            contact.disabled = true;
            this.collisionMonster(contact , selfCollider , otherCollider);
            break;
    }
};

/**
 * 碰撞到地板
 * 碰撞地板正常弹起
 * 
 * @param {any} contact 碰撞参数
 * @param {any} playerCollider 玩家碰撞器
 * @param {any} floorCollider 地板碰撞器
 */
MPlayer.collisionFloor = function (contact , playerCollider , floorCollider) {
    var player = playerCollider.node.getComponent(Global.GameObj.GBase);
    var floor = floorCollider.node.getComponent(Global.GameObj.GBase);

    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep()) {
        return;
    }

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        return;
    }

    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr =  Global.Model.MFloor.getAttr();
    // 处理X轴速度 (加速力处理)
    var velocityX = Calculator.processVelocityX(floor.getVelocity().x , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
    // 限定X速度 (限定速度区间)
    velocityX = this.limitVelocityX(velocityX);
    // 处理Y轴速度 (弹性、反弹力处理)
    var velocityY = Calculator.processVelocityY(floor.getVelocity().y , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
    // 限定Y速度 (限定速度区间)
    velocityY = this.limitVelocityX(velocityY);

    var newVelocity = cc.v2(velocityX , velocityY);
    // 玩家对象设置新速度
    player.setVelocity(newVelocity);

    // 判断是否结束游戏
    var isGameOver = this.isGameOver(newVelocity);

    if (isGameOver) {
        // 当前游戏结束
    }
};

/**
 * 碰撞到墙
 * 碰撞到墙体1时 判定是否可以穿越
 * 碰撞到墙体2时 判定是否穿越
 * 碰撞到墙体3时 穿越墙体并播放穿越墙体动画
 * 
 * @param {any} contact 碰撞参数
 * @param {any} playerCollider 玩家碰撞器
 * @param {any} wallCollider 墙体碰撞器
 */
MPlayer.collisionWall = function (contact , playerCollider , wallCollider) {
    var player = playerCollider.node.getComponent(Global.GameObj.GBase);
    var wall = wallCollider.node.getComponent(Global.GameObj.GBase);

    var playerVelocity = player.getVelocity();

    var wallTag = wallCollider.tag;

    switch (wallTag) {
        case 1:
            // 墙体1
            var mWall = Global.Model.MWall;
            var crossSpeed = mWall.isCross(playerVelocity);

            break;
        case 2:
            // 墙体2
            var canCross = true;
            if (canCross) {
                // 穿越
                // 穿越是 忽略系统碰撞
                contact.disabled = true;
            }
            else
            {
                // 停止
            }
            break;
        case 3:
            // 墙体3
            // 播放穿墙动画 并发射
            var reLaunchVelocity = null;
            break;
    
        default:
            break;
    }


}

/**
 * 碰撞到怪物
 * 
 * @param {any} contact 碰撞参数
 * @param {any} playerCollider 玩家碰撞器
 * @param {any} monsterCollider 怪物碰撞器
 */
MPlayer.collisionMonster = function (contact , playerCollider , monsterCollider) {
    var player = playerCollider.node.getComponent(Global.GameObj.BaseObject);
    var monster = monsterCollider.node.getComponent(Global.GameObj.BaseObject);

    var type = monster.getType();
    switch (type) {
        case Enum.TYPE.NORMAL:
            
            break;
        case Enum.TYPE.NORMAL_FLY:
            
            break;
        case Enum.TYPE.COINS:
            
            break;
        case Enum.TYPE.COINS_FLY:
            
            break;
        case Enum.TYPE.BOOM:
            
            break;
        case Enum.TYPE.BOOM_FLY:
            
            break;
        case Enum.TYPE.CLIP:
            
            break;
        case Enum.TYPE.ENERGY:
            
            break;
        case Enum.TYPE.ROCKET:
            
            break;
        case Enum.TYPE.JUMP:
            
            break;
        case Enum.TYPE.OIL:
            
            break;
        case Enum.TYPE.PLANE:
            
            break;
        case Enum.TYPE.CAR:
            
            break;
    }
}

module.exports = MPlayer;