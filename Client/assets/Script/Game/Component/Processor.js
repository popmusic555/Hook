
var CollisionProcessor = require("CollisionProcessor");

cc.Class({
    extends: cc.Component,

    properties: {
        _CollisionProcessor:null,
    },

    onLoad () {
        this._CollisionProcessor = new CollisionProcessor();
    },

    start () {
    },

    // update (dt) {},

    lateUpdate (dt) {
        this._CollisionProcessor.handle();
    },

    /**
     * 获取处理器
     * 
     */
    getCollisionProcessor:function () {
        return this._CollisionProcessor;
    },
    /**
     * 触发碰撞
     * 
     */
    triggerCollision:function (contact, selfGameObject, otherGameObject , callback , target) {
        this._CollisionProcessor.triggerCollision(contact, selfGameObject, otherGameObject , callback , target);
    },
});
