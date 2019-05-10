
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var MonsterConfig = require("MonsterConfig");
var DataManager = require("DataManager");
var GameCommon = require("GameCommon");

cc.Class({
    extends: GameMonster,

    properties: {
        model:sp.Skeleton,
        // 爆炸动画
        boomEffect:sp.Skeleton,

        cost:{
            default:0,
            visible:false,
        },
        coinsAddValue:0,
    },

    // onLoad () {},

    start () {
        this._super();
        // this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
        // 初始化数据
        this.initData(MonsterConfig.getDataByLevel("MFlyCoinsConfig" , DataManager.Userdata.getLevelByIndex(12)));
    },

    initData:function (cfg) {
        var data = this.getPlayerData();
        data.elasticity = cfg.elasticity;
        data.heightAddedValue = cfg.heightAddValue;
        data.minHeight = cfg.minHeight;
        data.speedAddedValue = cfg.speedAddValue;
        this.coinsAddValue = cfg.addCoins;
        this.cost = cfg.cost;
    },

    handleFloor:function (self , other) {

    },

    handleMonster:function (self , other) {

    },

    handlePlayer:function (self , other) {
        var player = other;
        if (player.isImpact()) {
            self.beKill(player);
        }
        else
        {
            player.attack();
            player.SyncParam(self.getPlayerData());
            player.ApplyAllParam(player);    
            self.beKill(player);

            if (player.isSuperAtk())
            {
                player.unSuperAtk();
            }
        }
        GameCommon.GetUIView().getEnergyPower().addEnergyForOne();
        GameCommon.GetUIView().getCoinsValue().addCoins(10);
    },

    beKill:function (gameObject) {
        console.log("爆炸并死亡");
        this.stopAndSleep();
        
        var linearVelocity = gameObject.getLinearVelocity();
        this.setLinearVelocity(new cc.Vec2(linearVelocity.x , 0));

        this.model.node.active = false;
        this.boomEffect.node.active = true;
        this.boomEffect.animation = "boom_fxjbgbl";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this));  
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {

    },
});
