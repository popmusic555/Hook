
var GameMonster = require("GameMonster");
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");

cc.Class({
    extends: GameMonster,

    properties: {
        model:sp.Skeleton,
        // 爆炸动画
        boomEffect:sp.Skeleton,
        boomEffect2:sp.Skeleton,
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
    },

    // update (dt) {},

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
            
            if (!monster.isSleep) {
                monster.beKill(this);    
            }
        }

        return result;
    },
});
