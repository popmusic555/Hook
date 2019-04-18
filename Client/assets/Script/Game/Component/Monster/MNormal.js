
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");

cc.Class({
    extends: GameMonster,

    properties: {
        model:sp.Skeleton,
        // 爆炸动画
        boomEffect:sp.Skeleton,
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
            self.beKill(player , true);
        }
        else if (player.isSuperAtk())
        {
            self.beKill(player , true);
        }
        else
        {
            player.attack();
            player.SyncParam(self.getPlayerData());
            player.ApplyAllParam(player);    
            self.beKill(player);
        }
    },

    beKill:function (gameObject , dontAni) {
        console.log("爆炸并死亡" , gameObject.node.name);
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
