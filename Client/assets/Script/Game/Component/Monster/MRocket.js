
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");

var ANIMATION_NAME = {
    RUN:"xg_hj_run",
    SIT:"ljr_hj_run",
};

var COLLIDER = {
    RUN:[
        new cc.Vec2(-15,-65),
        new cc.Vec2(35,-5),
        new cc.Vec2(30,60),
        new cc.Vec2(-55,-30),
    ],
    SIT:[
        new cc.Vec2(35,-70),
        new cc.Vec2(45,55),
        new cc.Vec2(-40,45),
        new cc.Vec2(-55,0),
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

        _IsActivate:false,
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

    activate:function () {
        this._IsActivate = true;
    },

    isActivate:function () {
        return this._IsActivate;  
    },

    // update (dt) {},
    lateUpdate(dt) {
        this._super(dt);
        if (this.getLinearVelocity().y < 0 && !this.isSleep) {
            // 最高点脱离
            var player = this.getController();
            if (player) {
                this.turnOffControl();
                this.beKill(player);   
                player.visible(true);
                player.wakeUp();
            }
            else
            {
                if (this.isActivate()) {
                    // 当前怪物已脱离
                    this.beKill(this);
                }
                else
                {
                    // 当前火箭怪物控制失败
                }
            }
        }
    },

    handleFloor:function (self , other) {
        var player = self.getController();
        if (player) {
            self.turnOffControl();
            self.beKill(player);

            player.visible(true);
            player.wakeUp();

            var floor = other;
            player.handleFloor(player , floor);
        }
        else
        {
            this.beKill(this);
        }
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
            
            if (self.isActivate()) {
                // 当前怪物已脱离
                monster.beKill(this);
            }
            else
            {
                // 当前火箭怪物控制失败
                this.beKill(this);
            }
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
            self.activate();
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
        // this.beKill(monster);

        this.canPlayer = false;
        this.setLinearVelocity(monster.getLinearVelocity().x + 500, monster.getLinearVelocity().y + 250);
        this.setGravityScale(GameConst.GRAVITY_SCALE);
    },

    onDeath:function () {
        this.node.destroy();  
    },

    // 被点击
    onTouched:function () {
        var player = this.getController();
        if (player) {
            this.turnOffControl();
            this.state = GameEnum.MONSTER_STATE.RUN;
            this.canPlayer = false;
            player.visible(true);
            player.wakeUp();

            player.superAtk();
        }
    },
});
