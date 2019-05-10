

cc.Class({
    extends: cc.Component,

    properties: {
        // spine动画
        spAni:sp.Skeleton,
        // 人物状态
        _State:null,
        // 状态锁
        _StateLock:false,

        // 动作ID
        _ActionID:0
    },

    onLoad () {
    },

    start () {
    },

    setState:function (state) {
        var lastState = this._State;
        this._State = state;
        switch (this._State) {
            case Global.Common.Enum.P_ANI_STATE.NULL:
                this.setAnimation(null);
                break;
            case Global.Common.Enum.P_ANI_STATE.READY:
                this.setAnimation("shoot");
                break;
            case Global.Common.Enum.P_ANI_STATE.LAUNCH:
                this._ActionID = 0;
                // this.setAnimation("shoot");
                break;
            case Global.Common.Enum.P_ANI_STATE.FLY:
                // 动作ID
                if (this._ActionID == 0) {
                    this._ActionID = Global.Common.Utils.random(1 , 3);
                    this.setAnimation("shoot");
                }
                else
                {
                    this._ActionID = Global.Common.Utils.random(1 , 3);
                    this.setAnimation("fly" + this._ActionID);
                }
                break;
            case Global.Common.Enum.P_ANI_STATE.DROP:
                if (this._ActionID <= 2) {
                    this.setAnimation("down" + Global.Common.Utils.random(1 , 2));
                }
                else
                {
                    this.setAnimation("down" + this._ActionID);
                }
                break;
            case Global.Common.Enum.P_ANI_STATE.HURT:
                var num = GameCommon.GET_RANDOM(1 , 2);
                this.setAnimation("hurt" + num);
                // console.log("State HIT");
                break;
            case Global.Common.Enum.P_ANI_STATE.ATTACK:
                if (lastState == Global.Common.Enum.P_ANI_STATE.DROP) {
                    // 上一次在下落状态 根据动作ID播放动画
                    if (this._ActionID == 1)
                    {
                        this.setAnimation("touch1");
                    }
                    else if (this._ActionID == 2)
                    {
                        this.setAnimation("touch2");
                    }
                    else if (this._ActionID == 3) {
                        this.setAnimation("touch3");
                    }
                }
                else
                {
                    this.setAnimation("touch" +  + Global.Common.Utils.random(1 , 2));
                }
                break;
            case Global.Common.Enum.P_ANI_STATE.SKILL:
                this.setAnimation("appear");
                break;
            case Global.Common.Enum.P_ANI_STATE.DEATH1:
                this.setAnimation("lose1");
                break;
            case Global.Common.Enum.P_ANI_STATE.DEATH2:
                this.setAnimation("lose2");
                break;
            case Global.Common.Enum.P_ANI_STATE.HITWALL:
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

    setAnimation:function (aniName) {
        if (aniName) {
            this.model.node.active = true;
            this.model.animation = aniName;    
        }
        else
        {
            this.model.node.active = false;
        }
    },

    /**
     * 转换状态
     * 
     * @param {any} state 新状态
     */
    transState:function (state) {
        if (state == this._State) {
            return;
        }
        if (this.isLockedState()) {
            return;
        }
        this.setState(state);
    },

    // 转换并在一定时间内锁定状态
    transStateAndLock:function (state , lockTime) {
        this.unlockState();
        this.transState(state);
        this.lockState();

        this.node.stopActionByTag(1);
        this._AtkAction = null;
        if (lockTime) {
            this._AtkAction = cc.sequence(cc.delayTime(lockTime) , cc.callFunc(function () {
                this.unlockState();
                this._AtkAction = null;
            }.bind(this)));
            this._AtkAction.setTag(1);
            this.node.runAction(this._AtkAction);
        }
    },

    lockState:function () {
        this._StateLock = true;
    },

    unlockState:function () {
        this._StateLock = false;
    },

    isLockedState:function () {
        return this._StateLock;
    },
});
