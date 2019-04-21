
var GameEnum = require("GameEnum");
var GameCommon = require("GameCommon");

cc.Class({
    extends: cc.Component,

    properties: {
        // 人物模型
        model:sp.Skeleton,
        // 人物状态
        _State:null,
        // 状态锁
        _StateLock:false,
        // 攻击动作
        _AtkAction:null,

        // 0 随机 1  发射 2 撞墙
        _CurActionID:0,
        // 0-4
        _CurAtkActionID:0,
    },

    onLoad () {
        this.transitionState(GameEnum.PLAYER_STATE.NULL);
        this._CurActionID = 1;
        this._CurAtkActionID = 0;
    },

    start () {
    },

    // lateUpdate:function () {
    //     console.log("this.model.node.y" , this.model.node.y);  
    // },

    setActionID:function (id) {
        this._CurActionID = id;
    },

    setState:function (state) {
        this._State = state;
        // this.model.node.y = 0;
        console.log("Change setState" , this._State);
        switch (this._State) {
            case GameEnum.PLAYER_STATE.NULL:
                // this.setSpriteFrame(null);
                this.setAnimation(null);
                console.log("State NULL");
                break;
            case GameEnum.PLAYER_STATE.STATIC:
                this.setAnimation("shoot");
                // console.log("State STATIC");
                break;
            case GameEnum.PLAYER_STATE.EMIT:
                this.setAnimation("shoot");
                // console.log("State EMIT");
                break;
            case GameEnum.PLAYER_STATE.FLY:
                var num = this._CurActionID;
                // this._CurAtkActionID = num;
                if (num == 0) {
                    this.setAnimation("fly" + GameCommon.GET_RANDOM(1 , 3));
                }
                else if (num == 1)
                {
                    this.setAnimation("shoot");   
                    this._CurActionID = 0;                     
                }
                else if (num == 2) {
                    this.setAnimation("impact");                        
                }
                this._CurAtkActionID = 0;
                // console.log("State FLY");
                break;
            case GameEnum.PLAYER_STATE.DROP:
                var num = this._CurActionID;
                // GameCommon.GET_RANDOM(1 , 3)
                if (num == 0) {
                    num = GameCommon.GET_RANDOM(1 , 3);
                    this.setAnimation("down" + num);
                    this._CurAtkActionID = num;
                }
                else if (num == 1)
                {
                    num = GameCommon.GET_RANDOM(1 , 3);
                    this.setAnimation("down" + num);
                    this._CurAtkActionID = num;
                }
                else if (num == 2) {
                    this.setAnimation("impact");
                    this._CurAtkActionID = 4;
                }
                // console.log("State DROP");
                break;
            case GameEnum.PLAYER_STATE.HIT:
                var num = GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation("hurt" + num);
                // console.log("State HIT");
                break;
            case GameEnum.PLAYER_STATE.ATK:
                var num = this._CurAtkActionID;
                if (num == 0) {
                    num = GameCommon.GET_RANDOM(1 , 2);
                    this.setAnimation("touch" + num);
                }
                else if (num == 4)
                {
                    this.setAnimation("touch2");
                }
                else
                {
                    this.setAnimation("touch" + num);
                }
                // console.log("State ATK");
                break;
            case GameEnum.PLAYER_STATE.SUPER_ATK:
                this.setAnimation("appear");
                // console.log("State SUPER_ATK");
                break;
            case GameEnum.PLAYER_STATE.DEAD1:
                this.setAnimation("lose1");
                // console.log("State DEAD1");
                break;
            case GameEnum.PLAYER_STATE.DEAD2:
                this.setAnimation("lose2");
                // this.model.node.x += -25;
                // console.log("State DEAD2");
                break;
            case GameEnum.PLAYER_STATE.HITWALL:
                this.setAnimation("impact");
                break;
            default:
                break;
        }

    },

    getState:function () {
        return this._State;
    },

    isState:function (state) {
        return state == this._State;
    },

    // 转换状态
    transitionState:function (state) {
        if (state == this._State) {
            return;
        }

        if (this.isStateLocked()) {
            return;
        }

        this.setState(state);
    },

    // 转换并在一定时间内锁定状态
    transitionStateAndLock:function (state , lockTime) {
        this.unlockState();
        this.transitionState(state);
        this.lockState();
        if (lockTime) {
            if (!this._AtkAction) {
                this._AtkAction = cc.sequence(cc.delayTime(lockTime) , cc.callFunc(function () {
                    this.unlockState();
                    this._AtkAction = null;
                }.bind(this)));
                this._AtkAction.setTag(1);
                this.node.runAction(this._AtkAction);
            }
        }
        else
        {
            this.node.stopActionByTag(1);
            this._AtkAction = null;
        }
    },

    lockState:function () {
        this._StateLock = true;
    },

    unlockState:function () {
        this._StateLock = false;
    },

    isStateLocked:function () {
        return this._StateLock;
    },

    setAnimation:function (aniName) {
        this.model.node.active = true;
        if (aniName) {
            this.model.animation = aniName;    
        }
        else
        {
            this.model.node.active = false;
        }
    },

    hide:function () {
        this.animationNode.active = false;        
    },

    show:function () {
        this.animationNode.active = true;        
    },

    // update (dt) {
        
    // },
});
