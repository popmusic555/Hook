
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");
var PlayerModel = require("PlayerModel");
var GameCommon = require("GameCommon");
var GameConst = require("GameConst");

cc.Class({
    extends: GameObject,

    properties: {
        // 冲击速度
        impactVelocity:0,

        globalAni:[sp.Skeleton],
        // throughHoleAni:sp.Skeleton,
        // 主角运动状态
        _RunState:GameEnum.PLAYER_RUNSTATE.NORMAL,
        _PlayerModel:null,

        // 碰撞到Floor时运算的数据
        _FloorData:null,

        _SuperAtkLock:false,

        isLaunching:{
            default:false,
            visible:false,
        },
    },

    // onLoad () {},

    start () {
        this._PlayerModel = this.getComponent(PlayerModel);
        var uiview = GameCommon.GetUIView();
        // uiview.setTouchListener(this);

        this._FloorData = this.getComponent("FloorData");
    },

    lateUpdate (dt) {
        this._super(dt);

        // 切换人物状态
        if (this.getLinearVelocity().y > 0) {
            this.getPlayerModel().transitionState(GameEnum.PLAYER_STATE.FLY);
        }
        else if (this.getLinearVelocity().y < 0) {
            this.getPlayerModel().transitionState(GameEnum.PLAYER_STATE.DROP);
        }

        if (this.getRunState() == GameEnum.PLAYER_RUNSTATE.NORMAL) {
            // 方向为下 并且值大于冲击速度
            if (this.getLinearVelocity().y < -this.impactVelocity) {
                this.setRunState(GameEnum.PLAYER_RUNSTATE.IMPACT);
            }
        }

        if (this.getPlayerModel().getState() == GameEnum.PLAYER_STATE.HIT) {
            this.setAngularVelocity(260);
        }
        else
        {
            this.setAngularVelocity(0);
            this.node.rotation = 0;
        }

        // if (this.throughHoleAni.node.active) {
        //     this.updateThroughHoleAni();
        // }
        this.updateGlobalAni();
    },

    // 开始发射
    startLaunching:function (speedX , speedY) {
        var uiview = GameCommon.GetUIView();
        uiview.setTouchListener(this);
        this.isLaunching = true;
        // var speedY = Math.tan(angle * Math.PI / 180) * speedX;
        this.setLinearVelocity(speedX , speedY);  
        this.setGravityScale(GameConst.GRAVITY_SCALE);
    },

    getPlayerModel:function (state) {
        return this._PlayerModel;
    },

    setRunState:function (state) {
        this._RunState = state;
    },

    getRunState:function () {
        return this._RunState;            
    },

    isImpact:function () {
        if (this.getRunState() == GameEnum.PLAYER_RUNSTATE.IMPACT) {
            return true;
        }  
        return false;
    },

    isSuperAtk:function () {
        if (this.getRunState() == GameEnum.PLAYER_RUNSTATE.SUPER_ATK) {
            return true;
        }  
        return false;
    },

    visible:function (flag) {
        if (flag) {
            this.getPlayerModel().unlockState();    
        }
        else
        {
            this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.NULL);    
        }
    },

    getFloorData:function () {
        return this._FloorData;
    },

    onCollision:function (contact , selfGameObj , otherGameObj) {
        // 碰撞不同类型的游戏物体触发不同的逻辑
        switch (otherGameObj.ObjectType) {
            // 当前碰撞到Floor
            case GameEnum.GAMEOBJ_TYPE.FLOOR:
                if (selfGameObj.canFloor) {
                    console.log(selfGameObj.node.name , "碰撞Floor" , otherGameObj.node.name);
                    this._SuperAtkLock = true;
                    this.onFloor(contact , selfGameObj , otherGameObj);
                }
                break;
        }
    },

    onEndCollision:function (contact , selfGameObj , otherGameObj) {
        switch (otherGameObj.ObjectType) {
            // 当前碰撞到Floor
            case GameEnum.GAMEOBJ_TYPE.FLOOR:
                this._SuperAtkLock = false;
                break;
        }
    },

    onFloor:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            contact.disabled = true;
            return;
        }

        // 向上运动时屏蔽碰撞逻辑
        if (other.riseIgnore && self.getLinearVelocity().y > 0) {
            contact.disabled = true;
            return;
        }

        // 处理碰撞逻辑
        this.handleFloor(self , other);
    },

    // 处理Floor逻辑
    handleFloor:function (self , other) {
        this.SyncParam(this.getFloorData());
        this.ApplyAllParam(this);
        if (this.isImpact()) {
            this.unImpact();
            if (this.killImpactMonster()) {
                this.showBigBoomAni();    
            }
        }
        else if (this.isSuperAtk())
        {
            this.unSuperAtk();
            if (this.killImpactMonster()) {
                this.showBigBoomAni();    
            }
        }
        else
        {
            if (this.getLinearVelocity().x <= 10) {
                this.dead();
                this.stop();
            }
            else
            {
                this.hit();
            }
        }
    },

    onTouched:function () {
        if (this._SuperAtkLock) {
            return;
        }

        this.superAtk();
    },

    attack:function () {
        this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.ATK , 0.3);
    },

    hit:function () {
        this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.NULL);
        this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.HIT);
    },

    dead:function () {
        this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.DEAD2);
    },

    superAtk:function () {
        this.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.SUPER_ATK);    
        var y = -Math.abs(this.getLinearVelocity().y);
        // if (y < -2000) {
        y = -2500;
        // }
        this.setLinearVelocityY(y);
        this.setRunState(GameEnum.PLAYER_RUNSTATE.SUPER_ATK);
    },

    unSuperAtk:function () {
        this.getPlayerModel().unlockState();
        this.setRunState(GameEnum.PLAYER_RUNSTATE.NORMAL);
    },

    unImpact:function () {

    },

    // showThroughHoleAni:function (pos) {
    //     this.throughHoleAni.node.active = true;
    //     this.throughHoleAni.animation = "posui";
    //     this.throughHoleAni.node.y = pos.y;
    //     this.throughHoleAni.setCompleteListener(function () {
    //         this.throughHoleAni.node.active = false;
    //     }.bind(this));
    // },

    showThroughHoleAni:function (pos) {
        var throughHoleAni = this.globalAni[0];
        throughHoleAni.node.active = true;
        throughHoleAni.animation = "posui";
        throughHoleAni.node.y = pos.y;
        throughHoleAni.setCompleteListener(function () {
            throughHoleAni.node.active = false;
        }.bind(this));
    },

    showBigBoomAni:function () {
        var bigBoomAni = this.globalAni[1];
        bigBoomAni.node.active = true;
        bigBoomAni.animation = "boom_big";
        bigBoomAni.setCompleteListener(function () {
            bigBoomAni.node.active = false;
        }.bind(this));
    },

    // updateThroughHoleAni:function () {
    //     this.throughHoleAni.node.parent.x = this.node.x;
    //     // this.throughHoleAni.node.parent.y = this.node.y;
    // },

    updateGlobalAni:function () {
        var len = this.globalAni.length;
        for (let index = 0; index < len; index++) {
            var ani = this.globalAni[index];
            if (ani.node.active) {
                ani.node.parent.x = this.node.x;
            }
        }  
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
    killImpactMonster:function () {
        var result = false;

        var worldPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));

        var rect = new cc.rect(worldPos.x - 150 , worldPos.y - 80 , 300 ,  80);

        var monsters = this.getMonsterForAABB(rect);
        var len = monsters.length;
        for (let index = 0; index < len; index++) {
            result = true;
            var monster = monsters[index];
            
            if (!monster.isSleep) {
                monster.beKill(this , true);    
            }
        }

        return result;
    },

});
