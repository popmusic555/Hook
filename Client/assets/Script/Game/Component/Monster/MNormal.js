
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var MonsterConfig = require("MonsterConfig");
var PlayerConfig = require("PlayerConfig");
var PassConfig = require("PassConfig");
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
    },

    // onLoad () {},

    start () {
        this._super();
        // 初始化数据
        this.initData(MonsterConfig.getDataByLevel("MNormalConfig" , DataManager.Userdata.getLevelByIndex(4)));
    },

    initData:function (cfg) {
        var data = this.getPlayerData();
        data.elasticity = cfg.elasticity;
        data.heightAddedValue = cfg.heightAddValue;
        data.speedAddedValue = cfg.speedAddValue;
        this.cost = cfg.cost;

        cfg = PlayerConfig.getDataByLevel(DataManager.Userdata.getLevelByIndex(1));
        data.minHeight = cfg.bouncHeight;
    },

    // update (dt) {},

    handleFloor:function (self , other) {

    },

    handleMonster:function (self , other) {

    },

    handlePlayer:function (self , other) {
        var player = other;
        if (player.isImpact()) {
            self.beKill(player , true);
            // self.beKill(player , false);
        }
        else if (player.isSuperAtk())
        {
            self.beKill(player , true);
            // self.beKill(player , false);
        }
        else
        {
            player.attack();

            var playerData = self.getPlayerData();
            player.SyncParam(playerData);
            player.speedAddedValue += PassConfig.getDataByPassID(DataManager.Userdata.getPassID()).mNormalAddValue;
            if (player.speedAddedValue > 0) {
                player.speedAddedValue = 0;
            }
            player.ApplyAllParam(player);    
            self.beKill(player);
        }
        GameCommon.GetUIView().getEnergyPower().addEnergyForOne();
        GameCommon.GetUIView().getCoinsValue().addCoins(10);
    },

    beKill:function (gameObject , dontAni) {
        console.log("爆炸并死亡" , gameObject.node.name);
        GameCommon.GAME_VIEW.playSound(2);
        this.stopAndSleep();
        
        var linearVelocity = gameObject.getLinearVelocity();
        this.setLinearVelocity(new cc.Vec2(linearVelocity.x , 0));

        this.model.node.active = false;

        if (dontAni) {
            this.onDeath();
        }
        else
        {
            this.boomEffect.node.active = true;
            this.boomEffect.animation = "boom_slm";
            this.boomEffect.setCompleteListener(this.onDeath.bind(this));  
        }
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {

    },
});
