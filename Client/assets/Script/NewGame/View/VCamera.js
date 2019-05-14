
// var MapManager = require("MapManager");
var VMap = require("VMap");
var VBuild = require("VBuild");
var VWall = require("VWall");
var VMonster = require("VMonster");

// 相机跟随脚本
cc.Class({
    extends: cc.Component,

    properties: {
        targetFollow:cc.Node,
        // 锚点位置
        anchorPos:cc.Vec2,
        // 地图
        map:VMap,
        // 建筑
        building:VBuild,
        // 墙体
        wall:VWall,
        // 怪物
        monster:VMonster,

        _StopPosX:null,
    },

    onLoad () {

    },

    start () {
        this._StopPosX = null;
    },

    lateUpdate: function (dt) {
        this.updateCamera();
        this.map.updateMap(this.node.x , this.node.y);
        this.building.updateBuild(this.node.x , this.node.y);
        this.wall.updateWall(this.node.x , this.node.y);
        this.monster.updateMonster(this.node.x , this.node.y);

        this.node.x += 20;
    },

    updateCamera:function () {
        if (!this.targetFollow) {
            return;
        }

        var x = this.targetFollow.x - this.anchorPos.x;
        var y = this.targetFollow.y - this.anchorPos.y;

        if (y < 0) {
            y = 0;
        }

        if (this._StopPosX && x > this._StopPosX) {
            x = this._StopPosX;
        }

        this.node.x = x;
        this.node.y = y;
    },

    stopFollowWithPosX:function (x) {
        this._StopPosX = x;
    },
    /**
     * 设置跟随目标
     * 
     * @param {any} taraget 
     */
    setFollow:function (taraget) {
        this.targetFollow = taraget;
    },

    /**
     * 设置跟随锚点
     * 
     * @param {any} vec2 
     */
    setFollowAnchor:function (vec2) {
        this.anchorPos = vec2;
    },
});
