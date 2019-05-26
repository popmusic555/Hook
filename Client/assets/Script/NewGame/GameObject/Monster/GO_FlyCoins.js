
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");

/**
 * 普通怪物对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 人物对象
        _Player:GO_Base,
        // ani
        animation:sp.Skeleton,
        // 死亡动画
        deathAni:sp.Skeleton,
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,
        _IsDeath:false,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;
    },

    update (dt) {
        
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        this.updateVelocity();
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }
        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MFlyCoins.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
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
        Global.Model.MFlyCoins.handleCollision(contact, selfCollider, otherCollider);
    },

    onDeath:function (player) {
        if (this._IsDeath) {
            return;
        }
        this._IsDeath = true;
        this._CurRelativeVelocity.x = 0;
        this.sleep();
        this.static();
        this.showDeathAni();
        if (player) {
            this.setVelocityX(player.getVelocityX());
            // 随机获取任务碎片
            var fragment = Global.Model.MPlayer.getFragmentForRandom();
            if (fragment != -1) {
                Global.Model.MPlayer.addFragment(fragment);
            }
            // 增加击杀数量
            Global.Model.MPlayer.addOneKillNum();
        }
    },

    onDeathWithWall:function () {
        this._IsUpdate = false;
        this.static();
        this.onDeath();
    },

    showDeathAni:function () {
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_fxjbgbl";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },
});
