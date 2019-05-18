
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");

/**
 * 玩家对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 墙体地板资源
        floorRes:[cc.SpriteFrame],
        // 破洞
        hole:cc.Node,
        // 地板
        floor:cc.Sprite,

        _PassID:0,
        _PassPosX:-1,
    },

    // onLoad () {},

    start () {
        this.floor.spriteFrame = this.floorRes[this._PassID];
        this._PassPosX = this.node.x;
    },

    update (dt) {
    },

    lateUpdate (dt) {
        // 切换关卡
        var distanceLeft = cc.Camera.main.node.x - cc.view.getVisibleSize().width * 0.5 + 812;
        if (distanceLeft >= this._PassPosX + 90 && this._PassPosX != -1) {
            console.log("Change NextPass");
            Global.Model.MWall.nextPass();
            this._PassPosX = -1;
        }
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

    setHoleWithWorldPosX:function (worldPosx) {
        var x = this.hole.parent.convertToNodeSpaceAR(cc.v2(0 , y)).y;
        this.hole.x = x;
    },

    setHoleWithWorldPosY:function (worldPosy) {
        var y = this.hole.parent.convertToNodeSpaceAR(cc.v2(0 , worldPosy)).y;
        this.hole.x = y;
    },

    showHole:function () {
        this.hole.active = true;
    },

    setPassID:function (passid) {
        this._PassID = passid;
    },
});
