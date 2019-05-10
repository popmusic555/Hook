
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");
var MonsterConfig = require("MonsterConfig");
var DataManager = require("DataManager");
var GameCommon = require("GameCommon");

var ANIMATION_NAME = {
    RUN:"car_gbl_run",
    SIT:"car_ljr_run01",
    SIT4FLOOR:"car_ljr_runtx",
};

var COLLIDER = {
    RUN:[
        new cc.Vec2(10,-15),
        new cc.Vec2(170,-15),
        new cc.Vec2(100,65),
        new cc.Vec2(40,65),
    ],
    SIT:[
        new cc.Vec2(0,-30),
        new cc.Vec2(195,-30),
        new cc.Vec2(85,120),
        new cc.Vec2(-30,30),
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

        cost:{
            default:0,
            visible:false,
        },

        _IsTouch:false,
    },

    // onLoad () {},

    start () {
        this._super();
        this._IsTouch = false;
        // this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
        
        // 初始化数据
        this.initData(MonsterConfig.getDataByLevel("MCarConfig" , DataManager.Userdata.getLevelByIndex(11)));
    },

    initData:function (cfg) {
        var data = this.getPlayerData();
        data.elasticity = cfg.elasticity;
        data.heightAddedValue = cfg.heightAddValue;
        data.minHeight = cfg.minHeight;
        data.speedAddedValue = cfg.speedAddValue;
        this.cost = cfg.cost;
        this.duration = cfg.duration;
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
        this.setAnimation("SIT4FLOOR");

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

                if (player.isSuperAtk())
                {
                    player.unSuperAtk();
                }

                if (player.isImpact())
                {
                    player.unImpact();
                }
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
            self.SyncNewParam(this.getPlayerData() , 0 , 300 , 0 , 0 , null);
            // self.SyncParam(this.getPlayerData());
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
        GameCommon.GetUIView().getEnergyPower().addEnergyForOne();
        GameCommon.GetUIView().getCoinsValue().addCoins(10);
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
        this.SyncNewParam(this.getPlayerData() , 0 , 0 , 0 , 30 , null);
        this.ApplyAllParam(this);
        var move = cc.moveBy(0.1 , 30 , 0);
        this.animation.node.runAction(cc.sequence(move , move.reverse()));  
    },
});
