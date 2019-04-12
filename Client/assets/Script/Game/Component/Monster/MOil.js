
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");

cc.Class({
    extends: GameMonster,

    properties: {
        model:sp.Skeleton,
        // 爆炸动画
        boomEffect:sp.Skeleton,
        // Tips
        tips:cc.Node,
        // 生成次数
        createTimes:0,


        _Player:null,
        _CeateDis:0,
        _StayTimes:0,
        _MoveTimes:0,
        _EndTimes:0,

        _CreatePosX:0,
        _CreatePosY:0,

        _TipsPos:null,
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));

        var action = cc.sequence(cc.delayTime(this._StayTimes) , cc.callFunc(function () {
            var speed = this._CeateDis / this._MoveTimes;
            speed = this.getPlayer().getLinearVelocity().x - speed;
            this.setLinearVelocityX(speed);
            this.hideTips();
            this.setPlayer(null);
        } , this) , cc.delayTime(this._MoveTimes + this._EndTimes) , cc.callFunc(function () {
            //
        } , this));

        this.node.runAction(action);

        this._TipsPos = cc.v2(this.tips.x , this.tips.y);
    },

    setPlayer:function (player) {
        this._Player = player;
    },

    getPlayer:function () {
        return this._Player;  
    },

    setMPlaneName:function (name) {
        this._MPlaneName = name;
    },

    getMPlaneName:function () {
        return this._MPlaneName;   
    },

    setCreateDis:function (dis) {
        this._CeateDis = dis;  
    },

    setTimes:function (stay , move , end) {
        this._StayTimes = stay; 
        this._MoveTimes = move;
        this._EndTimes = end;
    },

    setCreatePosX:function (x) {
        this._CreatePosX = x;
        this.node.x = x;
    },

    setCreatePosY:function (y) {
        this._CreatePosY = y;
        this.node.y = y;
    },

    // update (dt) {
    // },

    lateUpdate(dt) {
        this._super(dt);
        var player = this.getPlayer();
        if (player) {
            this.node.x = player.node.x + this._CeateDis;
        }

        if (this.tips.active) {
            var pos = this.tips.parent.convertToWorldSpaceAR(this._TipsPos);
            pos = cc.Camera.main.getWorldToCameraPoint(pos);
            if (pos.y > cc.view.getVisibleSize().height - 60) {
                pos.y = cc.view.getVisibleSize().height - 60;
            }
            if (pos.y < 0 + 60) {
                pos.y = 0 + 60;
            }
            pos = cc.Camera.main.getCameraToWorldPoint(pos);
            pos = this.tips.parent.convertToNodeSpaceAR(pos);
            this.tips.x = pos.x;
            this.tips.y = pos.y;
        }
    },

    handleFloor:function (self , other) {

    },

    handleMonster:function (self , other) {

    },

    handlePlayer:function (self , other) {
        var player = other;
        self.beKill(player);
    },

    onControlFail:function (monster) {
        this.beKill(monster);
    },

    showTips:function () {
        this.tips.active = true;
    },

    hideTips:function () {
        this.tips.active = false;
    },

    beKill:function (gameObject) {
        console.log("爆炸并死亡");
        this.stopAndSleep();
        
        var linearVelocity = gameObject.getLinearVelocity();
        this.setLinearVelocity(new cc.Vec2(linearVelocity.x , 0));

        this.model.node.active = false;
        this.boomEffect.node.active = true;
        this.boomEffect.animation = "boom_spz";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this));  
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {

    },
});
