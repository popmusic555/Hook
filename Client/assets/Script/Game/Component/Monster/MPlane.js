
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");
var MOil = require("MOil");

var ANIMATION_NAME = {
    RUN:"gbl_run",
    SIT:"ljr_run",
};

var COLLIDER = {
    RUN:[
        new cc.Vec2(-20,-66),
        new cc.Vec2(66,-13),
        new cc.Vec2(18,68),
        new cc.Vec2(-61,-5),
    ],
    SIT:[
        new cc.Vec2(-24,-68),
        new cc.Vec2(67,-16),
        new cc.Vec2(72,75),
        new cc.Vec2(10,95),
        new cc.Vec2(-75,16),
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
        boomEffect2:sp.Skeleton,

        mOilPrefab:cc.Prefab,

        // 油桶怪生成时间
        oilCreateTime:0,
        // 油桶怪运动时间
        oilMoveTime:0,
        // 油桶生成的次数
        oilCreateNum:0,

        // 油桶怪物
        _MOil:null,
        // 油桶是否跟随
        _OilFollow:false,
        // 油桶怪生成的距离
        _OilCeateDis:0,
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
        this._OilCeateDis = 500 + cc.view.getVisibleSize().width * 0.5 + 40;
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

    // update (dt) {},
    lateUpdate(dt) {
        this._super(dt);
    },

    handleFloor:function (self , other) {
        var player = self.getController();
        if (player) {
            self.turnOffControl();
            self.beKill(player);

            player.visible(true);
            player.wakeUp();
            player.SyncParam(self.getPlayerData());
            player.ApplyAllParam(player);
        }
        else
        {
            self.beKill(self);
        }
    },

    handleMonster:function (self , other) {
        var player = self.getController();
        var monster = other;
        if (player) {
            // 当前怪物被控制中
            if (monster.priority >= self.priority) {
                // 碰撞到的怪物优先级较高
                // 解除控制
                self.turnOffControl();
                self.beKill(player);
                // 重新唤醒player
                player.visible(true);
                player.wakeUp();
                // 怪物和人重新处理碰撞逻辑
                monster.handlePlayer(monster , player);
            }
            else
            {
                // 碰撞到的怪物优先级较低
                monster.onControlFail(self);
                var mOil = monster.getComponent(MOil);
                if (mOil) {
                    self.addMonsterOil(player , mOil);
                }
            }
        }
        else
        {
            self.beKill(self);
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
            self.SyncParam(self.getPlayerData());
            self.ApplyAllParam(self);
            // 改变状态
            self.state = GameEnum.MONSTER_STATE.SIT;
            // 开启和怪物的碰撞
            self.canMonster = true;
            // 不显示玩家
            player.sleep();
            player.visible(false);
            
            self.addMonsterOil(player , null);
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

    // 添加油桶怪
    addMonsterOil:function (player , mOil) {
        if (this.oilCreateNum > 0) {
            if (!mOil || (mOil && mOil.getMPlaneName() == this.node.name)) {
                this.oilCreateNum--;
                var node = this.createOil();
                var mOil = node.getComponent(MOil); 
                mOil.setPlayer(player);
                mOil.setMPlaneName(this.node.name);
                mOil.setCreateDis(this._OilCeateDis);
                mOil.setTimes(this.oilCreateTime , this.oilMoveTime , 0.5);
                mOil.setCreatePosX(this.node.x + this._OilCeateDis);
                mOil.setCreatePosY(this.node.y + 600);
                this.node.parent.addChild(node);     
            }
        }   

        this.node.stopActionByTag(1);

        var action = cc.sequence(cc.delayTime(this.oilCreateTime + this.oilMoveTime + 0.5) , cc.callFunc(function () {
            var player = this.getController();
            if (player) {
                this.turnOffControl();
                this.beKill(player);

                player.visible(true);
                player.wakeUp();
                player.SyncParam(this.getPlayerData());
                player.ApplyAllParam(player);
            }
        } , this));
            
        action.setTag(1);
        this.node.runAction(action);
    },

    createOil:function () {
        var mOil = cc.instantiate(this.mOilPrefab);
        return mOil;
    },

    oilFollow:function () {
        this._OilFollow = true;  
    },

    unOilFollow:function () {
        this._OilFollow = false;
    },

    isOilFollow:function () {
        return this._OilFollow;  
    },

    onDeath:function () {
        this.node.destroy();  
    },

    // 被点击
    onTouched:function () {
        var player = this.getController();
        if (player) {
            this.SyncNewParam(this.getPlayerData() , 0 , 300 , 0 , 0 , null);
            this.ApplyAllParam(this);
        }
    },
});
