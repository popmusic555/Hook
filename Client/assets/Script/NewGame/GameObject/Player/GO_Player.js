
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");
var Ani_Player = require("Ani_Player");

/**
 * 玩家对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 玩家动画
        animation:Ani_Player,
        // 玩家状态
        state:{
            default:GlobalEnum.P_STATE.READY,
            type:GlobalEnum.P_STATE,
        },
    },

    // onLoad () {},

    start () {
        Global.Model.MPlayer.setPlayerObj(this);
    },

    update (dt) {

        var velocityX = this.getVelocity().x;
        var velocityY = this.getVelocity().y;

        if (velocityY > 0) {
            this.animation.transState(GlobalEnum.P_ANI_STATE.FLY);
        }
        else if (velocityY < 0) {
            this.animation.transState(GlobalEnum.P_ANI_STATE.DROP);
        }

        if (this.animation.getState() == GlobalEnum.P_ANI_STATE.DROP) {
            if (Global.Model.MPlayer.isImpact(velocityY)) {
                
            }
        }

    },

    /**
     * 发射
     * 
     * @param {any} velocity 发射速度
     */
    launching:function (velocity) {
        this.state = GlobalEnum.P_STATE.LAUNCH;
        this.animation.transState(GlobalEnum.P_ANI_STATE.LAUNCH);
        this.run(velocity , Global.Common.Const.GRAVITY_SCALE);
        // 播放发射音效
    },

    /**
     * 碰撞回调
     * 在碰撞时回调函数
     * 
     * @param {any} contact 碰撞参数
     * @param {any} selfCollider 自身碰撞器
     * @param {any} otherCollider 被碰撞对象碰撞器
     */
    onBeginContact:function (contact, selfCollider, otherCollider) {
        Global.Model.MPlayer.handleCollision(contact, selfCollider, otherCollider);
    },
});
