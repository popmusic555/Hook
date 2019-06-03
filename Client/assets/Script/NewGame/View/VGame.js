
var GO_Player = require("GO_Player");
var GO_Floor = require("GO_Floor");

cc.Class({
    extends: cc.Component,

    properties: {
        // 人物配置表
        playerConfig:cc.JsonAsset,
        // 地板配置表
        floorConfig:cc.JsonAsset,
        // 墙体配置表
        wallConfig:cc.JsonAsset,

        // 怪物配置表
        // 普通怪物配置表
        mNormalConfig:cc.JsonAsset,
        // 飞行怪物配置表
        mFlyConfig:cc.JsonAsset,
        // 金币怪物配置表
        mCoinsConfig:cc.JsonAsset,
        // 飞行金币怪物配置表
        mFlyCoinsConfig:cc.JsonAsset,
        // 炸弹怪物配置表
        mBoomConfig:cc.JsonAsset,
        // 飞行炸弹怪物配置表
        mFlyBoomConfig:cc.JsonAsset,
        // 能量怪物配置表
        mEnergyConfig:cc.JsonAsset,
        // 夹子怪物配置表
        mClipConfig:cc.JsonAsset,
        // 火箭怪物配置表
        mRocketConfig:cc.JsonAsset,
        // 弹跳机怪物配置表
        mJumpConfig:cc.JsonAsset,
        // 飞机怪物配置表
        mPlaneConfig:cc.JsonAsset,
        // 汽车怪物配置表
        mCarConfig:cc.JsonAsset,

        // 升级配置表
        // 玩家升级配置表
        levelupPlayer:cc.JsonAsset,
        // 金币怪物升级配置表
        levelupCoins:cc.JsonAsset,
        // 飞行金币怪物升级配置表
        levelupFlyCoins:cc.JsonAsset,
        // 炸弹怪物升级配置表
        levelupBoom:cc.JsonAsset,
        // 飞行炸弹升级配置表
        levelupFlyBoom:cc.JsonAsset,
        // 能量怪物升级配置表
        levelupEnergy:cc.JsonAsset,
        // 夹子怪物升级配置表
        levelupClip:cc.JsonAsset,
        // 火箭怪物升级配置表
        levelupRocket:cc.JsonAsset,
        // 弹跳机怪物升级配置表
        levelupJump:cc.JsonAsset,
        // 飞机怪物升级配置表
        levelupPlane:cc.JsonAsset,
        // 汽车怪物升级配置表
        levelupCar:cc.JsonAsset,

        // 地图节点
        mapNode:cc.Node,
        // 建筑节点
        buildNode:cc.Node,
        // 墙节点
        wallNode:cc.Node,
        // 怪物节点
        monsterNode:cc.Node,
        // 前景墙节点
        fgWallNode:cc.Node,

        _IsGuide:false,
    },

    onLoad () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;
    },

    start () {
        Global.Common.Audio.playMusic("gameBgm" , true);

        this._IsGuide = true;

        Global.Model.Game.setGameView(this);

        Global.Model.Game.initPlayerLevelConfig(this.levelupPlayer.json);
        Global.Model.Game.initCoinsLevelConfig(this.levelupCoins.json);
        Global.Model.Game.initFlyCoinsLevelConfig(this.levelupFlyCoins.json);
        Global.Model.Game.initBoomLevelConfig(this.levelupBoom.json);
        Global.Model.Game.initFlyBoomLevelConfig(this.levelupFlyBoom.json);
        Global.Model.Game.initEnergyLevelConfig(this.levelupEnergy.json);
        Global.Model.Game.initClipLevelConfig(this.levelupClip.json);
        Global.Model.Game.initRocketLevelConfig(this.levelupRocket.json);
        Global.Model.Game.initJumpLevelConfig(this.levelupJump.json);
        Global.Model.Game.initPlaneLevelConfig(this.levelupPlane.json);
        Global.Model.Game.initCarLevelConfig(this.levelupCar.json);

        Global.Model.MPlayer.setConfig(this.playerConfig.json);
        Global.Model.MFloor.setConfig(this.floorConfig.json);
        Global.Model.MWall.setConfig(this.wallConfig.json);

        Global.Model.MNormal.setConfig(this.mNormalConfig.json);
        Global.Model.MFly.setConfig(this.mFlyConfig.json);
        Global.Model.MCoins.setConfig(this.mCoinsConfig.json);
        Global.Model.MFlyCoins.setConfig(this.mFlyCoinsConfig.json);
        Global.Model.MBoom.setConfig(this.mBoomConfig.json);
        Global.Model.MFlyBoom.setConfig(this.mFlyBoomConfig.json);
        Global.Model.MEnergy.setConfig(this.mEnergyConfig.json);
        Global.Model.MClip.setConfig(this.mClipConfig.json);
        Global.Model.MRocket.setConfig(this.mRocketConfig.json);
        Global.Model.MJump.setConfig(this.mJumpConfig.json);
        Global.Model.MPlane.setConfig(this.mPlaneConfig.json);
        Global.Model.MCar.setConfig(this.mCarConfig.json);

        Global.Model.MPlayer.resetGamedata();
        Global.Model.MPlayer.setFragmentRate(Global.Model.Game.getFragmentNum());
        Global.Model.MPlayer.setGuide(Global.Model.Game.guideStep , Global.Model.Game.monsterGuide);

        Global.Model.MWall.resetGamedata();
        // 设置关卡ID
        Global.Model.MWall.setPassID(0);

        // 当前转盘倍数是否超时
        var curTime = Global.Common.Timer.getTime();
        if (curTime - Global.Model.Game.lotteryTime >= Global.Common.Const.LOTTERY_TIME) {
            // 超时倍数清零
            Global.Model.Game.setLotteryNum(0);
        }
    },

    // 震屏
    shockScreen:function () {
        this.shockNode(this.mapNode);
        this.shockNode(this.buildNode);
        this.shockNode(this.wallNode);
        // this.shockNode(this.monsterNode);
        this.shockNode(this.fgWallNode);
    },

    shockNode:function (node) {
        var upAction = cc.moveBy(0.02 , 0 , 10);
        var downAction = upAction.reverse();
        var action = cc.sequence(upAction , downAction , downAction , upAction);
        node.runAction(cc.repeat(action , 1));
    },

    update (dt) {
        // 当前怪物超过3个怪物 技能引导开启
        if (Global.Model.MPlayer.getGuideStep() == 1 && this._IsGuide) {
            var num = 0;
            var player = Global.Model.MPlayer.getPlayerObj();
            var playerWorldPos = player.node.convertToWorldSpaceAR(cc.v2(0,0));
            var monsters = this.getComponentInChildren("LNormal").node.children;
            for (let index = 0; index < monsters.length; index++) {
                const monster = monsters[index];
                var monsterWorldPos = monster.convertToWorldSpaceAR(cc.v2(0,0));
                if (playerWorldPos.x >= monsterWorldPos.x) {
                    num++;
                }    
            }
            
            if (num >= 1) {
                var energyPower = Global.Model.Game.getUIView().getComponentInChildren("EnergyPower");
                energyPower.showGuide();
                Global.Model.Game.pauseGame();
                this._IsGuide = false;
            }
        }
    },
});
