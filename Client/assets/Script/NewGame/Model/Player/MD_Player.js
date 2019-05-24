
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
    this.attr.maxVelocity = cc.v2(20000 , 20000);
    // 最小速度
    // this.attr.minVelocity = cc.Vec2.ZERO;
    this.attr.minVelocity = cc.v2(30 , -20000);
    // 反弹力
    this.attr.bouncePower = 100;
    // 加速力
    this.attr.acceleratePower = 0;

    // 初始发射速度
    this.attr.launchingVelocity = 1000;
    // 获取金币倍率
    this.attr.coinsRadio = 0;
    // 能量上限
    this.attr.energyLimit = 20;
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
    // 游戏全局动画
    this.gamedata.globalAni = null;
    // 游戏内获取到的金币奖励
    this.gamedata.rewardsCoins = 0;
    // 游戏内获取到的能量
    this.gamedata.energy = 0;
    // 游戏里程
    this.gamedata.mileage = 0;

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

    var cfg = Global.Model.Game.levelsItemConfig.player;

    this.attr.elastic = data.elastic;
    this.attr.bouncePower = data.bounce + cfg[Global.Model.Game.getLevelByItemID(1)].playerBounce;
    this.attr.acceleratePower = data.accelerate;
    this.attr.coinsRadio = data.getCoins * cfg[Global.Model.Game.getLevelByItemID(6)].getCoins;
    this.attr.offlineRewards = data.offlineReward + cfg[Global.Model.Game.getLevelByItemID(3)].offlineRewards;
    this.attr.energyLimit = data.energyLimit + cfg[Global.Model.Game.getLevelByItemID(2)].energyLimit;
    this.attr.launchingVelocity = cfg[Global.Model.Game.getLevelByItemID(0)].launchSpeed;
    

    if (passID == 0) {
        this.gamedata.energy = this.attr.energyLimit;
    }

    console.log("UpdateByPass Player" , passID);
};

/**
 * 重置游戏内数据
 * 
 */
MPlayer.resetGamedata = function () {
    this.gamedata.playerObj = null;
    this.gamedata.globalAni = null;
    this.gamedata.rewardsCoins = 0;
    this.gamedata.energy = 0;
    this.gamedata.mileage = 0;
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
    if (num < 0) {
        num = 0;
    }
    var mileage = Global.Common.Utils.Converter.toMileage(num);
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
    this.gamedata.rewardsCoins = num;
    console.log("this.gamedata.rewardsCoins" , this.gamedata.rewardsCoins , this.attr.coinsRadio);
};

/**
 * 增加能量
 * 
 * @param {any} num 
 */
MPlayer.addEnergy = function (num) {
    var energy = this.gamedata.energy + num;
    this.gamedata.energy = Math.min(energy , this.attr.energyLimit);
}

/**
 * 减少能量
 * 
 * @param {any} num 
 */
MPlayer.reduceEnergy = function (num) {
    var energy = this.gamedata.energy - num;
    this.gamedata.energy = Math.max(energy , 0);
    console.log("reduceEnergy" , num);
}
/**
 * 能量是否足够
 * 
 * @param {any} num 
 */
MPlayer.isEnoughEnergy = function (num) {
    if (this.gamedata.energy >= num) {
        return true;
    }
    return false;
}

/**
 * 获取能量
 * 
 */
MPlayer.getEnergy = function () {
    return this.gamedata.energy;
};

/**
 * 获取速度计
 * 
 */
MPlayer.getSpeedPower = function () {
    return Global.Common.Utils.Converter.toSpeedPower(this.getPlayerObj().getVelocity().x);
};

MPlayer.setPlayerObj = function (playerObj) {
    this.gamedata.playerObj = playerObj;
};

MPlayer.getPlayerObj = function () {
    return this.gamedata.playerObj;
};

MPlayer.setGlobalAni = function (ani) {
    this.gamedata.globalAni = ani;
};

MPlayer.getGlobalAni = function (ani) {
    return this.gamedata.globalAni;
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

    // 在Y轴速度正向时 不可触发碰撞逻辑
    if (player.isPositiveVelocityY()) {
        return;
    }

    this.triggerFloor(contact , player , floor , Global.Model.MFloor.getAttr());
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

            if (this.type == Enum.TYPE.PLAYER) {
                // 墙体2
                var canCross = player.isCanCrossWall();
                if (canCross) {
                    // 穿越忽略系统碰撞
                    contact.disabled = true;
                    // 穿越速度
                    if (!player.getWallLaunchVelocity()) {
                        playerVelocity.x += Global.Model.MWall.getAccelerate();
                        playerVelocity.x = this.limitVelocityX(playerVelocity.x);
                        player.crossWall2(playerVelocity);    
                    }
                }
                else
                {
                    // 停止
                    player.stop();
                    player.crossWall2(null);
                    player.scheduleOnce(function () {
                        var worldPos = wall.node.parent.convertToWorldSpaceAR(wall.node.position);
                        var nodePos = player.node.parent.convertToNodeSpaceAR(worldPos);
                        player.node.x = nodePos.x - 25;
                    } , 0);
                }    
            }
            else
            {
                this.type = Enum.TYPE.PLAYER;
                player.unBindMonster();

                var canCross = player.isCanCrossWall();
                if (canCross) {
                    // 穿越忽略系统碰撞
                    // contact.disabled = false;
                    // 穿越速度
                    if (!player.getWallLaunchVelocity()) {
                        playerVelocity.x += Global.Model.MWall.getAccelerate();
                        playerVelocity.x = this.limitVelocityX(playerVelocity.x);
                        player.crossWall2(playerVelocity);
                    }
                }
                else
                {
                    // 停止
                    player.stop();
                    player.crossWall2(null);
                    player.scheduleOnce(function () {
                        var worldPos = wall.node.parent.convertToWorldSpaceAR(wall.node.position);
                        var nodePos = player.node.parent.convertToNodeSpaceAR(worldPos);
                        player.node.x = nodePos.x - 25;
                    } , 0);
                }    
            }
            break;
        case 3:
            // 墙体3
            contact.disabled = true;
            var reLaunchVelocity = player.getWallLaunchVelocity();
            console.log("reLaunchVelocity" , reLaunchVelocity.x , reLaunchVelocity.y);
            // 播放穿墙动画 并发射
            player.crossWall3(reLaunchVelocity);
            var y = player.node.parent.convertToWorldSpaceAR(player.node.position).y;
            wall.setHoleWithWorldPosY(y);
            wall.showHole();
            player.showHoleAni();

            // 获取奖励
            var attr = Global.Model.MWall.getAttr();
            MPlayer.addReward(attr.cost , attr.coins , attr.energy);
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
            model = Global.Model.MEnergy;
            this.collisionMEnergy(contact , player , monster);
            break;
        case Enum.TYPE.ROCKET:
            model = Global.Model.MRocket;
            this.collisionMRocket(contact , player , monster);
            break;
        case Enum.TYPE.JUMP:
            model = Global.Model.MJump;
            this.collisionMJump(contact , player , monster);
            break;
        case Enum.TYPE.JUMP_FIST:
            model = Global.Model.MJump;
            this.collisionMJump(contact , player , monster.getJump());
            break;
        case Enum.TYPE.OIL:
            model = Global.Model.MOil;
            this.collisionOil(contact , player , monster);
            break;
        case Enum.TYPE.PLANE:
            model = Global.Model.MPlane;
            this.collisionMPlane(contact , player , monster);
            break;
        case Enum.TYPE.CAR:
            model = Global.Model.MCar;
            this.collisionMCar(contact , player , monster);
            break;
    }

    // console.log(model.getAttr().cost , model.getAttr().coins ,model.getAttr().energy);

    // // 增加金币
    // this.addCoins(model.getAttr().cost);
    // // 增加携带的金币
    // this.addCarryCoins(model.getAttr().coins);
    // // 增加能量
    // this.addEnergy(model.getAttr().energy);
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

    this.triggerNormal(contact , player , monster , Global.Model.MNormal.getAttr());
}

MPlayer.collisionMFlyNormal = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerFly(contact , player , monster , Global.Model.MFly.getAttr());
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

    this.triggerNormal(contact , player , monster , Global.Model.MCoins.getAttr());
}

MPlayer.collisionMFlyCoins = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerFly(contact , player , monster , Global.Model.MFlyCoins.getAttr());
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

    this.triggerBoom(contact , player , monster , Global.Model.MBoom.getAttr());
}

MPlayer.collisionMFlyBoom = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerFlyBoom(contact , player , monster , Global.Model.MFlyBoom.getAttr());
}

MPlayer.collisionMEnergy = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerFly(contact , player , monster , Global.Model.MEnergy.getAttr());
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

    this.triggerClip(contact , player , monster , Global.Model.MClip.getAttr());
}

MPlayer.collisionMRocket = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerRocket(contact , player , monster , Global.Model.MRocket.getAttr());
}

MPlayer.collisionMJump = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerJump(contact , player , monster , Global.Model.MJump.getAttr());
}

MPlayer.collisionMPlane = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerPlane(contact , player , monster , Global.Model.MPlane.getAttr());
}

MPlayer.collisionOil = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }
    this.triggerOil(contact , player , monster , null);
}

MPlayer.collisionMCar = function (contact , player , monster) {
    // 休眠状态下不可触发碰撞逻辑
    if (player.isSleep() || monster.isSleep()) {
        console.log("当前玩家或者怪物休眠");
        return;
    }

    this.triggerCar(contact , player , monster , Global.Model.MCar.getAttr());
}

// MPlayer.collisionMNormal = function () {
    
// }

MPlayer.triggerNormal = function (contact , player , normal , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            
            // 怪物死亡
            normal.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();
            // 怪物死亡
            normal.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 怪物死亡
            normal.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            normal.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
            }
            else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                player.onAttack();
                // 怪物死亡
                normal.onDeath(player);
                // 获取奖励
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerFly = function (contact , player , fly , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            fly.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            // 怪物死亡
            fly.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();
            // 怪物死亡
            fly.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 怪物死亡
            fly.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            fly.onDeath(player);
            // 获取奖励
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                fly.onDeath(player);
                // 获取奖励
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                player.onAttack();
                // 怪物死亡
                fly.onDeath(player);  
                // 获取奖励
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy); 
            }
            break;
    }
}

MPlayer.triggerBoom = function (contact , player , boom , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            boom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(boom);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MPlayer.getAttr();
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            // 怪物死亡
            boom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(boom);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlayer.getAttr();
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            // 怪物死亡
            boom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(boom);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MPlayer.getAttr();
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            // 怪物死亡
            boom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(boom);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
            }
            else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                player.onAttack();
                // 怪物死亡
                boom.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
                MPlayer.boom(boom);
            }
            break;
    }
}

MPlayer.triggerFlyBoom = function (contact , player , flyboom , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            flyboom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(flyboom);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            flyboom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(flyboom);
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();

            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            flyboom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(flyboom);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();

            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            flyboom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(flyboom);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();

            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            flyboom.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            MPlayer.boom(flyboom);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                flyboom.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
                MPlayer.boom(flyboom);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                player.onAttack();
                // 怪物死亡
                flyboom.onDeath(player); 
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
                MPlayer.boom(flyboom);   
            }
            break;
    }
}

MPlayer.triggerClip = function (contact , player , clip , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除原绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 绑定
            this.type = Enum.TYPE.CLIP;
            player.bindMonster(clip);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();
            // 怪物死亡
            clip.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 怪物死亡
            clip.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            clip.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
            }
            else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                console.log("Clip反弹力" , selfAttr.bouncePower + otherAttr.bouncePower);
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 绑定
                this.type = Enum.TYPE.CLIP;
                player.bindMonster(clip);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerRocket = function (contact , player , rocket , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
        case Enum.TYPE.ROCKET:
            // 解除原绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 绑定
            this.type = Enum.TYPE.ROCKET;
            player.bindMonster(rocket);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();

            // // 火箭乱飞
            // rocket.setVelocity(cc.v2(velocityX + 300 , velocityY + 600));

            // 怪物死亡
            rocket.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 怪物死亡
            rocket.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            rocket.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                rocket.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                console.log("Rocket反弹力" , 0 + otherAttr.bouncePower);
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 绑定
                this.type = Enum.TYPE.ROCKET;
                player.bindMonster(rocket);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerJump = function (contact , player , jump , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
        case Enum.TYPE.ROCKET:
        case Enum.TYPE.JUMP:
            // 解除原绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 绑定
            this.type = Enum.TYPE.JUMP;
            player.bindMonster(jump);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();
            // 怪物死亡
            jump.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            jump.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                jump.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 绑定
                this.type = Enum.TYPE.JUMP;
                player.bindMonster(jump);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerPlane = function (contact , player , plane , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
        case Enum.TYPE.ROCKET:
        case Enum.TYPE.JUMP:
        case Enum.TYPE.PLANE:
            // 解除原绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 绑定
            this.type = Enum.TYPE.PLANE;
            player.bindMonster(plane);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();
            // 怪物死亡
            plane.onDeath(player);
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                plane.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 绑定
                this.type = Enum.TYPE.PLANE;
                player.bindMonster(plane);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerOil = function (contact , player , oil , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;
    switch (this.type) {
        case Enum.TYPE.CLIP:
        case Enum.TYPE.ROCKET:
        case Enum.TYPE.JUMP:
        case Enum.TYPE.CAR:
            // 怪物死亡
            oil.onDeath(player);
            break;
        case Enum.TYPE.PLAYER:
            player.onAttack();
            // 怪物死亡
            oil.onDeath(player);
            break;
        case Enum.TYPE.PLANE:
            // 飞机加速
            var selfAttr = Global.Model.MPlane.getAttr();
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.oilAccelerate , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);

            // 怪物死亡
            oil.onDeath(player);
            // 添加新油桶
            var plane = player.getBindMonster();
            plane.generateOil(oil.node.name);
            break;
    }
}

MPlayer.triggerCar = function (contact , player , car , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
        case Enum.TYPE.ROCKET:
        case Enum.TYPE.JUMP:
        case Enum.TYPE.PLANE:
        case Enum.TYPE.CAR:
            // 解除原绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();
            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            // 绑定
            this.type = Enum.TYPE.CAR;
            player.bindMonster(car , cc.v2(100 , 50));
            MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();
            if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                car.onDeath(player);
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            else
            {   
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , 0 , otherAttr.elastic , otherAttr.bouncePower);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , 0 , otherAttr.acceleratePower);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);
                // 绑定
                this.type = Enum.TYPE.CAR;
                player.bindMonster(car , cc.v2(100 , 50));
                MPlayer.addReward(otherAttr.cost , otherAttr.coins , otherAttr.energy);
            }
            break;
    }
}

MPlayer.triggerFloor = function (contact , player , floor , attr) {
    var Calculator = Global.Common.Utils.Calculator;
    var selfAttr = this.getAttr();
    var otherAttr = attr;
    var velocity = player.getVelocity();
    var velocityX = velocity.x;
    var velocityY = velocity.y;

    switch (this.type) {
        case Enum.TYPE.CLIP:
            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // // 处理X轴速度 (加速力处理)
            // velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
            // // 限定X速度 (限定速度区间)
            // velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            break;
        case Enum.TYPE.ROCKET:
            selfAttr = Global.Model.MRocket.getAttr();
            break;
        case Enum.TYPE.JUMP:
            selfAttr = Global.Model.MJump.getAttr();

            var jump = player.getBindMonster();

            if (jump.isUseSkill()) {
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , 0 , selfAttr.skillBounce , 0 , 0);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.skillAccelerate , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
            }
            else
            {
                // 处理Y轴速度 (弹性、反弹力处理)
                velocityY = Calculator.processVelocityY(velocityY , 0 , selfAttr.floorBounce , 0 , 0);
                // 限定Y速度 (限定速度区间)
                velocityY = this.limitVelocityY(velocityY);
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.floorAccelerate , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);
            }
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            jump.setVelocity(newVelocity);
            jump.reduceBounceTimes();
            break;
        case Enum.TYPE.PLANE:
            selfAttr = Global.Model.MPlane.getAttr();

            // 解除绑定
            this.type = Enum.TYPE.PLAYER;
            player.unBindMonster();

            // 处理Y轴速度 (弹性、反弹力处理)
            console.log("selfAttr.endRideBounce" , selfAttr.endRideBounce);
            velocityY = Calculator.processVelocityY(velocityY , 0 , selfAttr.endRideBounce , 0 , 0);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , selfAttr.endRideAccelerate , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            player.setVelocity(newVelocity);
            break;
        case Enum.TYPE.CAR:
            selfAttr = Global.Model.MCar.getAttr();

            // 解除绑定
            // this.type = Enum.TYPE.PLAYER;
            // player.unBindMonster();
            // player.static();

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , 0 , 0 , 0 , 0);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , 0 , 0);
            // 限定X速度 (限定速度区间)
            velocityX = this.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            var car = player.getBindMonster();
            car.setVelocity(newVelocity);
            car.setDuration(selfAttr.duration * 60);
            car.scheduleOnce(function () {
                car.node.rotation = 0;
            } , 0);

            break;
        case Enum.TYPE.PLAYER:
            selfAttr = Global.Model.MPlayer.getAttr();

            // 处理Y轴速度 (弹性、反弹力处理)
            console.log("Floor反弹力" , selfAttr.bouncePower + otherAttr.bouncePower);
            velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
            // 限定Y速度 (限定速度区间)
            velocityY = this.limitVelocityY(velocityY);

            if (player.animation.getState() == Enum.P_ANI_STATE.SKILL) {
                // 技能状态下 清除范围内怪物 不减速
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 震屏
                player.shockScreen();
                // 显示触地动画
                player.showTouchdownAni();

                MPlayer.quake(player);
            }
            else if (player.animation.getState() == Enum.P_ANI_STATE.IMPACT) {
                // 冲击状态下 清除范围内怪物 不减速
                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 震屏
                player.shockScreen();
                // 显示触地动画
                player.showTouchdownAni();

                MPlayer.quake(player);
            }
            else
            {   
                // 非技能、冲击状态下 减速
                // 处理X轴速度 (加速力处理)
                velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower , 0);
                // 限定X速度 (限定速度区间)
                velocityX = this.limitVelocityX(velocityX);

                var newVelocity = cc.v2(velocityX , velocityY);
                // 玩家对象设置新速度
                player.setVelocity(newVelocity);

                // 判断是否结束游戏
                var isGameOver = this.isGameOver(newVelocity);
                if (isGameOver) {
                    // 当前游戏结束
                    console.log("当前游戏结束");
                    player.static();
                    Global.Model.Game.showSettlementView();
                }
                else
                {
                    // 显示触地动画
                    player.showTouchdownAni();
                    player.onHurt();
                }
            }
            break;
    }
}

MPlayer.onTouched = function () {
    if (!this.gamedata.playerObj) {
        return;
    }
    this.gamedata.playerObj.onTouched();
}
/**
 * 增加金币
 * 
 * @param {any} num 
 */
MPlayer.addCoins = function (num) {
    this.addRewardCoins(num);
    // 展示UI动画
    console.log("addCoins" , num);
    if (num > 0) {
        var ani = this.getPlayerObj().getComponentInChildren("CoinsRewardAni");
        ani.showWithCoinsNum(num);    
    }
}

/**
 * 增加携带金币
 * 
 * @param {any} num 
 */
MPlayer.addCarryCoins = function (num) {
    this.addRewardCoins(num);
    // 展示UI动画
    console.log("addCarryCoins" , num);
}

MPlayer.addCarryEnergy = function (num) {
    this.addEnergy(num);
    console.log("addCarryEnergy" , num);
    
    if (num >= Global.Common.Const.ENERGY_RATIO) {
        var ani = Global.Model.Game.getUIView().getComponentInChildren("EnergyCarryAni");
        ani.show();
    }
}

MPlayer.addReward = function (cost , coins , energy) {
    // 增加金币
    this.addCoins(cost * this.attr.coinsRadio);
    // 增加携带的金币
    this.addCarryCoins(coins * this.attr.coinsRadio);
    // 增加能量
    this.addCarryEnergy(energy);  
},

/**
 * 爆炸摧毁范围内怪物
 *
 */
MPlayer.boom = function (boom) {
    var worldPos = boom.node.convertToWorldSpaceAR(cc.v2(0,0));

    var rect = new cc.rect(worldPos.x - 120 , worldPos.y - 120 , 240 ,  240);

    var monsters = this.getMonsterForAABB(rect);
    var len = monsters.length;
    for (let index = 0; index < len; index++) {
        var monster = monsters[index];
        if (!monster.isSleep() && !monster._IsBind) {
            monster.onDeath(this.getPlayerObj());
            var attr = null;
            switch (monster.getType()) {
                case Enum.TYPE.NORMAL:
                    attr = Global.Model.MNormal.getAttr()
                    break;
                case Enum.TYPE.NORMAL_FLY:
                    attr = Global.Model.MFly.getAttr()
                    break;
                case Enum.TYPE.COINS:
                    attr = Global.Model.MCoins.getAttr()
                    break;
                case Enum.TYPE.COINS_FLY:
                    attr = Global.Model.MFlyCoins.getAttr()
                    break;
                case Enum.TYPE.BOOM:
                    attr = Global.Model.MBoom.getAttr()
                    break;
                case Enum.TYPE.BOOM_FLY:
                    attr = Global.Model.MFlyBoom.getAttr()
                    break;
                case Enum.TYPE.ENERGY:
                    attr = Global.Model.MEnergy.getAttr()
                    break;
                case Enum.TYPE.CLIP:
                    attr = Global.Model.MClip.getAttr()
                    break;
                case Enum.TYPE.ROCKET:
                    attr = Global.Model.MRocket.getAttr()
                    break;
                case Enum.TYPE.JUMP:
                    attr = Global.Model.MJump.getAttr()
                    break;
                case Enum.TYPE.PLANE:
                    attr = Global.Model.MPlane.getAttr()
                    break;
                case Enum.TYPE.CAR:
                    attr = Global.Model.MCar.getAttr()
                    break;
            }
            // 获取奖励
            MPlayer.addReward(attr.cost , attr.coins , attr.energy);
        }
    }
}

/**
 * 地震摧毁范围内怪物
 *
 */
MPlayer.quake = function (player) {
    var worldPos = player.node.convertToWorldSpaceAR(cc.v2(0,0));
    // var rect = new cc.rect(worldPos.x - 150 , worldPos.y - 30 , 300 ,  80);
    var rect = new cc.rect(worldPos.x - 150 , worldPos.y - 1000 , 300 ,  2000);
    var monsters = this.getMonsterForAABB(rect);

    var isShowBigBoomAni = false;

    var len = monsters.length;
    for (let index = 0; index < len; index++) {
        var monster = monsters[index];
        if (!monster.isSleep() && !monster._IsBind) {
            var attr = null;
            switch (monster.getType()) {
                case Enum.TYPE.NORMAL:
                    monster.onDeath(player);
                    attr = Global.Model.MNormal.getAttr();
                    isShowBigBoomAni = true;
                    // 获取奖励
                    MPlayer.addReward(attr.cost , attr.coins , attr.energy);
                    break;
                case Enum.TYPE.COINS:
                    monster.onDeath(player);
                    attr = Global.Model.MCoins.getAttr();
                    isShowBigBoomAni = true;
                    // 获取奖励
                    MPlayer.addReward(attr.cost , attr.coins , attr.energy);
                    break;
                case Enum.TYPE.BOOM:
                    var Calculator = Global.Common.Utils.Calculator;
                    var selfAttr = this.getAttr();
                    var otherAttr = Global.Model.MBoom.getAttr();
                    var velocity = player.getVelocity();
                    var velocityX = velocity.x;
                    var velocityY = velocity.y;

                    // 处理Y轴速度 (弹性、反弹力处理)
                    velocityY = Calculator.processVelocityY(velocityY , selfAttr.elastic , selfAttr.bouncePower , otherAttr.elastic , otherAttr.bouncePower);
                    // 限定Y速度 (限定速度区间)
                    velocityY = this.limitVelocityY(velocityY);
                    // 非技能、冲击状态下 减速
                    // 处理X轴速度 (加速力处理)
                    velocityX = Calculator.processVelocityX(velocityX , selfAttr.acceleratePower , otherAttr.acceleratePower);
                    // 限定X速度 (限定速度区间)
                    velocityX = this.limitVelocityX(velocityX);
                    var newVelocity = cc.v2(velocityX , velocityY);
                    // 玩家对象设置新速度
                    player.setVelocity(newVelocity);

                    monster.onDeath(player);
                    attr = otherAttr;
                    isShowBigBoomAni = true;
                    // 获取奖励
                    MPlayer.addReward(attr.cost , attr.coins , attr.energy);
                    break;
                case Enum.TYPE.CLIP:
                    monster.onDeath(player);
                    attr = Global.Model.MClip.getAttr();
                    isShowBigBoomAni = true;
                    // 获取奖励
                    MPlayer.addReward(attr.cost , attr.coins , attr.energy);
                    break;
            }
        }
    }

    if (isShowBigBoomAni) {
        this.getGlobalAni().showBigBoom(player);
    }
},

// MPlayer.getMonsterForAABB = function (worldRect) {
//     var result = [];
//     var colliderList = cc.director.getPhysicsManager().testAABB(worldRect);
//     var len = colliderList.length;
//     for (let index = 0; index < len; index++) {
//         var collider = colliderList[index];
//         var gBase = collider.getComponent(Global.GameObj.GBase);
//         if (gBase.getType() >= Enum.TYPE.NORMAL && gBase.getType() != Enum.TYPE.JUMP_FIST && gBase.getType() != Enum.TYPE.OIL) {
//             result.push(gBase);
//         }
//     }
//     return result;
// },

MPlayer.getMonsterForAABB = function (worldRect) {
    var result = [];
    // var colliderList = cc.director.getPhysicsManager().testAABB(worldRect);
    // var len = colliderList.length;
    // for (let index = 0; index < len; index++) {
    //     var collider = colliderList[index];
    //     var gBase = collider.getComponent(Global.GameObj.GBase);
    //     if (gBase.getType() >= Enum.TYPE.NORMAL && gBase.getType() != Enum.TYPE.JUMP_FIST && gBase.getType() != Enum.TYPE.OIL) {
    //         result.push(gBase);
    //     }
    // }

    var gameView = Global.Model.Game.getGameView();
    var monsterView = gameView.getComponentInChildren("VMonster");
    
    var monsterList = monsterView.getComponentsInChildren(Global.GameObj.GBase);

    var len = monsterList.length;
    for (let index = 0; index < len; index++) {
        var monster = monsterList[index];
        var gBase = monster;
        var gBaseWorldPos = gBase.node.convertToWorldSpaceAR(cc.v2(0,0));
        if (gBaseWorldPos.x <= worldRect.xMax && 
            gBaseWorldPos.x >= worldRect.xMin &&
            gBaseWorldPos.y <= worldRect.yMax &&
            gBaseWorldPos.y >= worldRect.yMin) 
        {
            if (gBase.getType() >= Enum.TYPE.NORMAL && gBase.getType() != Enum.TYPE.JUMP_FIST && gBase.getType() != Enum.TYPE.OIL) {
                result.push(gBase);
            }    
        }
    }

    return result;
},



module.exports = MPlayer;