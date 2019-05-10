
var GO_Player = require("GO_Player");
var GO_Floor = require("GO_Floor");

cc.Class({
    extends: cc.Component,

    properties: {
        // 人物对象节点
        player:GO_Player,
        // 地板对象节点
        floor:GO_Floor,
        // 普通怪物列表节点
        
        // 夹子怪物列表节点

        // 墙体节点列表
    },

    // onLoad () {},

    start () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;
    },

    // update (dt) {},
});
