
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
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,

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

    static:function () {
        this._super();
        this._IsUpdate = false;
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
        velocityX = Global.Model.MJump.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateShadow:function () {
        var aniNode = this._Shadow.shadow.node;
        var nodepos = aniNode.parent.convertToNodeSpaceAR(cc.v2(0 , 95));
        aniNode.y = nodepos.y;

        var scale = (-55 - aniNode.y) / 300;
        scale = Math.max(scale , 0);
        scale = Math.min(scale , 1);
        aniNode.scale = (1  - scale);
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
        Global.Model.MJump.handleCollision(contact, selfCollider, otherCollider);
    },
});
