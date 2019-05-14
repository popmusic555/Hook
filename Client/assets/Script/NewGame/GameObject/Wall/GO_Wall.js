
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");

/**
 * 玩家对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
    },

    // onLoad () {},

    start () {
        
    },

    update (dt) {
        
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
        Global.Model.MWall.handleCollision(contact, selfCollider, otherCollider);
    },
});
