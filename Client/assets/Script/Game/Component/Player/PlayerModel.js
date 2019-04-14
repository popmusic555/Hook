
var GameEnum = require("GameEnum");
var GameCommon = require("GameCommon");

cc.Class({
    extends: cc.Component,

    properties: {
        // 人物模型
        model:sp.Skeleton,
        // 人物状态
        _State:GameEnum.PLAYER_STATE.STATIC,
        // 状态锁
        _StateLock:false,
        // 攻击动作
        _AtkAction:null,
    },

    onLoad () {
        this.transitionState(GameEnum.PLAYER_STATE.STATIC);
    },

    start () {
    },

    // lateUpdate:function () {
    //     console.log("this.model.node.y" , this.model.node.y);  
    // },

    setState:function (state) {
        this._State = state;
        // this.model.node.y = 0;
        console.log("Change setState" , this._State);
        switch (this._State) {
            case GameEnum.PLAYER_STATE.NULL:
                // this.setSpriteFrame(null);
                this.setAnimation(null);
                // console.log("State NULL");
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
                var num = GameCommon.GET_RANDOM(1 , 3);
                this.setAnimation("fly" + num);
                // console.log("State FLY");
                break;
            case GameEnum.PLAYER_STATE.DROP:
                var num = GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation("down" + num);
                // console.log("State DROP");
                break;
            case GameEnum.PLAYER_STATE.HIT:
                var num = GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation("hurt" + num);
                // console.log("State HIT");
                break;
            case GameEnum.PLAYER_STATE.ATK:
                var num = GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation("touch" + num);
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
                // console.log("State DEAD2");
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
