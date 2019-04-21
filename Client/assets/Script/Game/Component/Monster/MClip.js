
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameCommon = require("GameCommon");

var ANIMATION_NAME = {
    RUN:"xg_srh",
    SIT1:"xg_srh_lvr1",
    SIT2:"xg_srh_lvr2",
};

var COLLIDER = {
    RUN:[
        new cc.Vec2(-53,-45),
        new cc.Vec2(40,-45),
        new cc.Vec2(25,40),
        new cc.Vec2(-20,40),
    ],
    SIT1:[
        new cc.Vec2(-25,-65),
        new cc.Vec2(65,25),
        new cc.Vec2(30,65),
        new cc.Vec2(-65,-5),
    ],
    SIT2:[
        new cc.Vec2(5,-50),
        new cc.Vec2(65,0),
        new cc.Vec2(-40,50),
        new cc.Vec2(-65,5),
    ]
};

cc.Class({
    extends: GameMonster,

    properties: {
        collider:cc.PhysicsPolygonCollider,
        animation:sp.Skeleton,
        state:{
            get(){
                return this._State || GameEnum.MONSTER_STATE.RUN;
            },
            set(value){
                this.setState(value);
            },
            type:GameEnum.MONSTER_STATE,
        },
        // 爆炸动画
        boomEffect:sp.Skeleton,
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
    },

    setState:function (value) {
        if (this._State == value) {
            return;
        }
        this._State = value;
        switch (this._State) {
            case GameEnum.MONSTER_STATE.RUN:
                // 改变动画
                this.setAnimation(GameEnum.MONSTER_STATE[this._State]);
                // 改变碰撞框
                this.setCollider(GameEnum.MONSTER_STATE[this._State]);
                break;
            case GameEnum.MONSTER_STATE.SIT:
                var stateName = GameEnum.MONSTER_STATE[this._State] + GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation(stateName);
                // 改变碰撞框
                this.setCollider(stateName);
                break;
        }
    },

    setAnimation:function (stateName) {
        var name = ANIMATION_NAME[stateName];
        this.animation.animation = name;
    },

    setCollider:function (stateName) {
        var points = COLLIDER[stateName];
        this.collider.points = points;
        this.collider.apply();
    },

    handleFloor:function (self , other) {
        var player = self.getController();
        if (player) {
            self.turnOffControl();
            self.beKill(player);

            player.wakeUp();
            player.visible(true);

            var floor = other;
            player.handleFloor(player , floor);
        }
        else
        {
            // 无法在正常状态下碰撞到地板
        }
    },

    handleMonster:function (self , other) {
        var player = self.getController();
        var monster = other;
        if (player) {
            // 解除控制
            this.turnOffControl();
            this.beKill(player);
            // 重新唤醒player
            player.wakeUp();
            player.visible(true);

            // 怪物和人重新处理碰撞逻辑
            monster.handlePlayer(monster , player);
        }
        else
        {
            // 无法在正常状态下碰撞到怪物
        }
    },

    handlePlayer:function (self , other) {
        var player = other;
        if (player.isImpact()) {
            self.beKill(player);
        }
        else if (player.isSuperAtk())
        {
            self.beKill(player);
        }
        else
        {
            self.turnOnControl(player);
            self.SyncParam(this.getPlayerData());
            self.ApplyAllParam(self);
            // 改变状态
            self.state = GameEnum.MONSTER_STATE.SIT;
            // 开始旋转
            self.setAngularVelocity(200);
            // 开启和怪物的碰撞
            self.canMonster = true;
            // 不显示玩家
            player.sleep();
            player.visible(false);
        }
    },

    beKill:function (gameObject) {
        console.log("爆炸并死亡");
        this.stopAndSleep();
        
        var linearVelocity = gameObject.getLinearVelocity();
        this.setLinearVelocity(new cc.Vec2(linearVelocity.x , 0));
        this.setGravityScale(0);

        this.animation.node.active = false;
        this.boomEffect.node.active = true;
        this.boomEffect.animation = "boom_jzgbl";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this));  
    },

    onDeath:function () {
        this.node.destroy();    
    },

    onTouched:function () {

    },
});
