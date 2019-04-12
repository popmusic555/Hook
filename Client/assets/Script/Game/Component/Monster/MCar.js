
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");

var ANIMATION_NAME = {
    RUN:"gbl_run",
    SIT:"ljr_run",
};

var COLLIDER = {
    RUN:[
        new cc.Vec2(-9,18),
        new cc.Vec2(173,18),
        new cc.Vec2(54,105),
    ],
    SIT:[
        new cc.Vec2(-10,-4),
        new cc.Vec2(172,-4),
        new cc.Vec2(39,182),
        new cc.Vec2(-6,120),
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

        duration:0,

        _IsTouch:false,
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
                this.setAnimation(GameEnum.MONSTER_STATE[this._State]);
                // 改变碰撞框
                this.setCollider(GameEnum.MONSTER_STATE[this._State]);
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

    fristUpdateFollow:function () {
        this._FirstSyncFollow = false;
        if (!this.isHavePlayer()) {
            return;
        }
        var player = this.getFollowPlayer();
        this.SyncPosition(player , -52 , -85);
        this.node.rotation = -30;
    },

    updateFollow:function () {
        if (!this.isHavePlayer()) {
            return;
        }
        var player = this.getFollowPlayer();
        player.SyncPosition(this , 52 , 85);
        player.SyncLinearVelocity(this);
    },

    // update (dt) {},
    lateUpdate(dt) {
        this._super(dt);
    },

    handleFloor:function (self , other) {
        this.scheduleOnce(function () {
            this.node.rotation = 0;    
        } , 0);

        this.scheduleOnce(function () {
            var player = this.getController();
            if (player) {
                this.turnOffControl();
                this.beKill(player);
                player.visible(true);
                player.wakeUp();
                player.SyncParam(this.getPlayerData());
                player.ApplyAllParam(player);
            }
        } , this.duration);

        this._IsTouch = true;
    },

    handleMonster:function (self , other) {
        var player = self.getController();
        var monster = other;
        if (player) {
            // 当前怪物被控制中
            if (monster.priority >= this.priority) {
                // 碰撞到的怪物优先级较高
                // 解除控制
                this.turnOffControl();
                this.beKill(player);
                // 重新唤醒player
                player.visible(true);
                player.wakeUp();
                // 怪物和人重新处理碰撞逻辑
                monster.handlePlayer(monster , player);
            }
            else
            {
                // 碰撞到的怪物优先级较低
                monster.onControlFail(this);
            }
        }
        else
        {
            this.beKill(monster);
        }
    },

    handlePlayer:function (self , other) {
        var player = other;
        if (player.isImpact()) {
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
            // self.setAngularVelocity(200);
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
        this.boomEffect.animation = "boom_hjpgbl";
        this.boomEffect.setCompleteListener(this.onDeath.bind(this));
    },

    onControlFail:function (monster) {
        console.log("控制失败");
        this.beKill(monster);
    },

    onDeath:function () {
        this.node.destroy();  
    },

    // 被点击
    onTouched:function () {
        if (!this._IsTouch) {
            return;
        }
        this.SyncNewParam(this.getPlayerData() , 0 , 0 , 0 , 50 , null);
        this.ApplyAllParam(this);
        var move = cc.moveBy(0.1 , 30 , 0);
        this.animation.node.runAction(cc.sequence(move , move.reverse()));  
    },
});
