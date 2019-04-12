
var GameMonster = require("GameMonster");
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
        this.boomEffect.animation = "boom_fxzdgbl";
        this.boomEffect2.animation = "gbl_zd_boom";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this)); 

        // 爆炸清除周围所有怪物
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {
        
    },
});
