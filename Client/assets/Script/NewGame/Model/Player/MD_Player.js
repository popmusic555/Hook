
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
    // this.attr.maxVelocity = cc.Vec2.ZERO;
    this.attr.maxVelocity = cc.v2(9000 , 10000);
    // 最小速度
    // this.attr.minVelocity = cc.Vec2.ZERO;
    this.attr.minVelocity = cc.v2(0 , -10000);
    // 反弹力
    this.attr.bouncePower = 300;
    // 加速力
    this.attr.acceleratePower = 0;

    // 初始发射速度
    this.attr.launchingVelocity = cc.Vec2.ZERO;
    this.attr.coinsRadio = 0;
    // 能量上限
    this.attr.energyLimit = 0;
    // 离线奖励
    this.attr.offlineRewards = 0;
    // 冲击速度
    this.attr.impactSpeed = -3000;
    // GameOver速度
    this.attr.endSpeed = Global.Common.Const.GAMEOVER_SPEED;

    // 用户游戏内数据
    this.gamedata = {};
    
    // 游戏玩家对象
    this.gamedata.playerObj = null;
    // 游戏内获取到的金币奖励
    this.gamedata.rewardsCoins = 0;
    // 游戏内获取到的能量
    this.gamedata.energy = 0;
    // 游戏里程
    this.gamedata.mileage = 0;
    

    // 所有升级选项等级
    this.levels = [];

    this.config = null;

    this.resetGamedata();
};

MPlayer.setConfig = function (config) {
    this.config = config;
};

/**
 * 根据关卡更新PassID
 * 
 * @param {any} passID 关卡ID
 */
MPlayer.updateByPass = function (passID) {
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
    this.attr.coinsRadio = data.getCoins;
    this.attr.offlineRewards = data.offlineReward;
    this.attr.energyLimit = data.energyLimit;

    console.log("UpdateByPass " , passID);
};

/**
 * 重置游戏内数据
 * 
 */
MPlayer.resetGamedata = function () {
    this.gamedata.playerObj = null;
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
 * 增加能量
 * 
 * @param {any} num 
 */
MPlayer.addEnergy = function (num) {
    this.gamedata.energy += num;
}

MPlayer.setPlayerObj = function (playerObj) {
    this.gamedata.playerObj = playerObj;
};

MPlayer.getPlayerObj = function () {
    return this.gamedata.playerObj;
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

/**
 * 是否冲击
 *
 * @param {*} y Y轴速度
 * @returns 是否冲击
 */
MPlayer.isImpact = function (y) {
    if (y <= this.attr.impactSpeed) {
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

    switch (this.type) {
        case Enum.TYPE.CLIP:
            selfAttr = Global.Model.MClip.getAttr();
            // 解除变幻
            this.unTransform();
            // 取消夹子变幻
            // 夹子死亡动画
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 解除变幻
            this.unTransform();
            // 取消飞机变幻
            // 飞机死亡动画
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            break;
    }


    var otherAttr =  Global.Model.MFloor.getAttr();
    // 处理X轴速度 (加速力处理)
    var velocityX = Calculator.processVelocityX(player.getVelocity().x , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
    // 限定X速度 (限定速度区间)
    velocityX = this.limitVelocityX(velocityX);
    // 处理Y轴速度 (弹性、反弹力处理)
    var velocityY = Calculator.processVelocityY(player.getVelocity().y , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
    // 限定Y速度 (限定速度区间)
    velocityY = this.limitVelocityY(velocityY);

    var newVelocity = cc.v2(velocityX , velocityY);
    // 玩家对象设置新速度
    player.setVelocity(newVelocity);

    // 判断是否结束游戏
    var isGameOver = this.isGameOver(newVelocity);

    if (isGameOver) {
        // 当前游戏结束
        console.log("当前游戏结束");
        player.static();
    }
    else
    {
        // 显示触地动画
        player.showTouchdownAni();
        var isHurt = player.onHurt();
        if (isHurt) {
            // 受伤状态
        }
        else
        {
            // 反震状态
            // 震屏
            player.shockScreen();
        }
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
            contact.disabled = true;
            var mWall = Global.Model.MWall;
            playerVelocity.x += Global.Model.MWall.getAccelerate();
            var canCross = mWall.isCross(playerVelocity);
            player.crossWall1(canCross);
            if (!canCross) {
                // 无法穿越
                // 停止相机
                cc.Camera.main.node.getComponent("VCamera").setStopXFollow();
            }
            break;
        case 2:
            // 墙体2
            var canCross = player.isCanCrossWall();
            if (canCross) {
                // 穿越忽略系统碰撞
                contact.disabled = true;
                // 穿越速度
                playerVelocity.x += Global.Model.MWall.getAccelerate();
                playerVelocity.x = this.limitVelocityX(playerVelocity.x);
                player.crossWall2(playerVelocity);
            }
            else
            {
                // 停止
                player.stop();
                player.crossWall2(null);
            }
            break;
        case 3:
            // 墙体3
            contact.disabled = true;
            var reLaunchVelocity = player.getWallLaunchVelocity();
            // 播放穿墙动画 并发射
            player.crossWall3(reLaunchVelocity);
            var y = player.node.parent.convertToWorldSpaceAR(player.node.position).y;
            wall.setHoleWithWorldPosY(y);
            wall.showHole();
            player.showHoleAni();
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
    var player = playerCollider.node.getComponent(Global.GameObj.GBase);
    var monster = monsterCollider.node.getComponent(Global.GameObj.GBase);

    var model = null;
    var type = monster.getType();
    switch (type) {
        case Enum.TYPE.NORMAL:
            console.log("collisionMNormal");
            model = Global.Model.MNormal;
            this.collisionMNormal(contact , player , monster);
            break;
        case Enum.TYPE.NORMAL_FLY:
            console.log("collisionMFlyNormal");
            model = Global.Model.MFly;
            this.collisionMFlyNormal(contact , player , monster);
            break;
        case Enum.TYPE.COINS:
            console.log("collisionMCoins");
            model = Global.Model.MCoins;
            this.collisionMCoins(contact , player , monster);
            break;
        case Enum.TYPE.COINS_FLY:
            console.log("collisionMFlyCoins");
            model = Global.Model.MFlyCoins;
            this.collisionMFlyCoins(contact , player , monster);
            break;
        case Enum.TYPE.BOOM:
            console.log("collisionMBoom");
            model = Global.Model.MBoom;
            this.collisionMBoom(contact , player , monster);
            break;
        case Enum.TYPE.BOOM_FLY:
            console.log("collisionMFlyBoom");
            model = Global.Model.MFlyBoom;
            this.collisionMFlyBoom(contact , player , monster);
            break;
        case Enum.TYPE.CLIP:
            console.log("collisionMClip");
            model = Global.Model.MClip;
            this.collisionMClip(contact , player , monster);
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

    // 增加金币
    this.addCoins(model.getAttr().cost);
    // 增加携带的金币
    this.addCarryCoins(model.getAttr().coins);
    // 增加能量
    this.addEnergy(model.getAttr().energy);
}

MPlayer.collisionMNormal = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        console.log("玩家速度为正");
        return;
    }

    this.collisionNormal(contact , player , monster);
}

MPlayer.collisionMFlyNormal = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.collisionFly(contact , player , monster);
}

MPlayer.collisionMCoins = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        console.log("玩家速度为正");
        return;
    }

    this.collisionNormal(contact , player , monster);
}

MPlayer.collisionMFlyCoins = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.collisionFly(contact , player , monster);
}

MPlayer.collisionMBoom = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        console.log("玩家速度为正");
        return;
    }

    this.collisionNormal(contact , player , monster);
}

MPlayer.collisionMFlyBoom = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.collisionFly(contact , player , monster);
}

MPlayer.collisionMClip = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        console.log("玩家速度为正");
        return;
    }

    this.collisionNormal(contact , player , monster);
    this.transform(Enum.TYPE.CLIP , monster.animation.skeletonData);
}

// MPlayer.collisionMNormal = function () {
    
// }

MPlayer.collisionNormal = function (contact , player , normal) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr =  Global.Model.MNormal.getAttr();

    if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
        // 技能状态下 怪物直接被Kill 并且不处理Y轴上速度    
    }
    else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
        // 冲击状态下 怪物直接被Kill 并且不处理Y轴上速度
    }
    else
    {
        // 处理X轴速度 (加速力处理)
        var velocityX = Calculator.processVelocityX(player.getVelocity().x , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
        // 限定X速度 (限定速度区间)
        velocityX = this.limitVelocityX(velocityX);

        // 处理Y轴速度 (弹性、反弹力处理)
        var velocityY = Calculator.processVelocityY(player.getVelocity().y , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
        // 限定Y速度 (限定速度区间)
        velocityY = this.limitVelocityY(velocityY);

        var newVelocity = cc.v2(velocityX , velocityY);
        // 玩家对象设置新速度
        player.setVelocity(newVelocity);
    }

    // 怪物死亡
    normal.onDeath();
}

MPlayer.collisionFly = function (contact , player , fly) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr =  Global.Model.MNormal.getAttr();

    // 处理X轴速度 (加速力处理)
    var velocityX = Calculator.processVelocityX(player.getVelocity().x , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
    // 限定X速度 (限定速度区间)
    velocityX = this.limitVelocityX(velocityX);
    // 处理Y轴速度 (弹性、反弹力处理)
    var velocityY = Calculator.processVelocityY(player.getVelocity().y , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
    // 限定Y速度 (限定速度区间)
    velocityY = this.limitVelocityY(velocityY);

    var newVelocity = cc.v2(velocityX , velocityY);
    // 玩家对象设置新速度
    player.setVelocity(newVelocity);

    // 怪物死亡
    fly.onDeath();
}

MPlayer.collisionVehicle = function (contact , player , vehicle) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr =  Global.Model.MNormal.getAttr();

    // 处理X轴速度 (加速力处理)
    var velocityX = Calculator.processVelocityX(player.getVelocity().x , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
    // 限定X速度 (限定速度区间)
    velocityX = this.limitVelocityX(velocityX);

    var velocityY = player.getVelocity().y;
    
    if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
        // 技能状态下 怪物直接被Kill 并且不处理Y轴上速度    
    }
    else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
        // 冲击状态下 怪物直接被Kill 并且不处理Y轴上速度
    }
    else
    {
        // 处理Y轴速度 (弹性、反弹力处理)
        velocityY = Calculator.processVelocityY(player.getVelocity().y , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
        // 限定Y速度 (限定速度区间)
        velocityY = this.limitVelocityY(velocityY);
    }

    var newVelocity = cc.v2(velocityX , velocityY);
    // 玩家对象设置新速度
    player.setVelocity(newVelocity);

    // 怪物死亡
    normal.onDeath();
}

MPlayer.onTouched = function () {
    if (!this.gamedata.playerObj) {
        return;
    }
    this.gamedata.playerObj.onTouched();
}

MPlayer.addCoins = function (num) {
    this.addRewardCoins(num);
    // 展示UI动画
}

MPlayer.addCarryCoins = function (num) {
    this.addRewardCoins(num);
    // 展示UI动画
}

MPlayer.transform = function (type , skeletonData) {
    this.type = type;
    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 当前玩家变幻成夹子 并播放受伤
            this.gamedata.playerObj.transformClip(skeletonData);
            break;
        case Enum.TYPE.ROCKET:
            break;
        case Enum.TYPE.JUMP:
            break;
        case Enum.TYPE.PLANE:
            break;
        case Enum.TYPE.CAR:
            break;
    }
}

MPlayer.unTransform = function () {
    this.type = Enum.TYPE.PLAYER;
    this.gamedata.playerObj.transformOriginal();
}

module.exports = MPlayer;