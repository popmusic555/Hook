
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

        // 地图节点
        mapNode:cc.Node,
        // 建筑节点
        buildNode:cc.Node,
        // 墙节点
        wallNode:cc.Node,
        // 怪物节点
        monsterNode:cc.Node,
        // 前景墙节点
        fgWallNode:cc.Node,
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

    // 震屏
    shockScreen:function () {
        this.shockNode(this.mapNode);
        this.shockNode(this.buildNode);
        this.shockNode(this.wallNode);
        // this.shockNode(this.monsterNode);
        this.shockNode(this.fgWallNode);
    },

    shockNode:function (node) {
        var upAction = cc.moveBy(0.02 , 0 , 10);
        var downAction = upAction.reverse();
        var action = cc.sequence(upAction , downAction , downAction , upAction);
        node.runAction(cc.repeat(action , 1));
    },

    // update (dt) {},
});
