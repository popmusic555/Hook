

var GO_Base = require("GO_Base");
/**
 * 普通怪物对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 主体
        subject:cc.Node,
        
        _Jump:null,
    },

    // onLoad () {},

    start () {
        this._Jump = this.subject.getComponent("GO_Jump");
    },

    getJump:function () {
        return this._Jump;  
    },

    update (dt) {
        // this.node.x = 0;
        // this.node.y = 0;
    },

    lateUpdate (dt) {
        this.node.x = 0;
        this.node.y = 0;
        this.setVelocity(this._Jump.getVelocity());
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
        this._Jump.onBeginContact(contact, this._Jump, otherCollider);
    },
});
