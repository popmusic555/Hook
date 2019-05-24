
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

        _Shadow:null,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;
        
        var shadow = this.node.getChildByName("Shadow").getComponent(cc.Sprite);
        this._Shadow = {
            // 阴影动画
            shadow:shadow,
            // 阴影动画位置
            shadowAni:this.node.position,
        };
    },

    update (dt) {
        
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        this.updateVelocity();
        this.updateShadow();
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }
        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MNormal.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateShadow:function () {
        // var aniNode = this._Shadow.shadow.node;
        // var nodepos = aniNode.parent.convertToNodeSpaceAR(cc.v2(0 , 90));
        // aniNode.y = nodepos.y;
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
        Global.Model.MNormal.handleCollision(contact, selfCollider, otherCollider);
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
        }
    },

    onDeathWithWall:function () {
        this._IsUpdate = false;
        this.static();
        this.onDeath(this._Player);
    },

    showDeathAni:function () {
        this._Shadow.shadow.node.active = false;
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_slm";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },
});
