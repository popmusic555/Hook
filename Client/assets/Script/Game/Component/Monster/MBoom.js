
var GameMonster = require("GameMonster");
var GameObject = require("GameObject");
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
        boomEffect2:sp.Skeleton,

        cost:{
            default:0,
            visible:false,
        },
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
        // 初始化数据
        this.initData(MonsterConfig.getDataByLevel("MBombConfig" , DataManager.Userdata.getLevelByIndex(14)));
    },

    // update (dt) {},
    initData:function (cfg) {
        var data = this.getPlayerData();
        data.elasticity = cfg.elasticity;
        data.heightAddedValue = cfg.heightAddValue;
        data.minHeight = cfg.minHeight;
        data.speedAddedValue = cfg.speedAddValue;
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
            player.SyncParam(this.getPlayerData());
            player.ApplyElasticityParam(player);    
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
        if (gameObject.ObjectType == GameEnum.GAMEOBJ_TYPE.PLAYER) {
            var player = gameObject;
            player.SyncParam(this.getPlayerData());
            player.ApplySpeedParam(player);    
        }

        this.stopAndSleep();
        
        var linearVelocity = gameObject.getLinearVelocity();
        this.setLinearVelocity(new cc.Vec2(linearVelocity.x , 0));
        this.setGravityScale(0);

        this.model.node.active = false;
        this.boomEffect.node.active = true;
        this.boomEffect2.node.active = true;
        this.boomEffect.animation = "boom_zdgbl";
        this.boomEffect2.animation = "gbl_zd_boom";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this)); 

        // 爆炸清除周围所有怪物
        this.killOtherMonster();
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {
        
    },

    // 获取矩形范围内的怪物
    getMonsterForAABB:function (worldRect) {
        var result = [];
        var colliderList = cc.director.getPhysicsManager().testAABB(worldRect);
        var len = colliderList.length;
        for (let index = 0; index < len; index++) {
            var collider = colliderList[index];

            var gameObject = collider.getComponent(GameObject);
            if (gameObject.ObjectType == GameEnum.GAMEOBJ_TYPE.MONSTER) {
                result.push(gameObject);    
            }
            
        }
        return result;
    },

    // 击杀冲击范围内的怪物
    killOtherMonster:function () {
        var result = false;

        var worldPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));

        var rect = new cc.rect(worldPos.x - 120 , worldPos.y - 120 , 240 ,  240);

        var monsters = this.getMonsterForAABB(rect);
        var len = monsters.length;
        for (let index = 0; index < len; index++) {
            result = true;
            var monster = monsters[index];
            
            if (!monster.isSleep && !monster.getController()) {
                monster.beKill(this);    
            }
        }
        return result;
    },
});
