
var GO_Player = require("GO_Player");
var GO_Floor = require("GO_Floor");

cc.Class({
    extends: cc.Component,

    properties: {
        // 人物配置表
        playerConfig:cc.JsonAsset,
        // 地板配置表
        floorConfig:cc.JsonAsset,
        // 墙体配置表
        wallConfig:cc.JsonAsset,

        // 人物对象节点
        player:GO_Player,
        // 地板对象节点
        floor:GO_Floor,
        // 普通怪物列表节点
        
        // 夹子怪物列表节点

        // 墙体节点列表
    },

    onLoad () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit
        ;
    },

    start () {
        Global.Model.MPlayer.setConfig(this.playerConfig.json);
        Global.Model.MFloor.setConfig(this.floorConfig.json);
        Global.Model.MWall.setConfig(this.wallConfig.json);

        Global.Model.MWall.setPassID(0);
    },

    // update (dt) {},
});
