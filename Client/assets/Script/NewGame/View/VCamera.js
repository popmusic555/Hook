
// var MapManager = require("MapManager");
var VMap = require("VMap");
var VBuild = require("VBuild");
var VWall = require("VWall");
var VMonster = require("VMonster");
var VArtillery = require("VArtillery");

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

        _XFollow:true,
        _YFollow:true,
    },

    onLoad () {
        this._XFollow = true;
        this._YFollow = true;
    },

    start () {
    },

    lateUpdate: function (dt) {
        this.updateCamera();
        this.map.updateMap(this.node.x , this.node.y);
        this.building.updateBuild(this.node.x , this.node.y);
        this.wall.updateWall(this.node.x , this.node.y);
        this.monster.updateMonster(this.node.x , this.node.y);
    },

    updateCamera:function () {
        if (!this.targetFollow) {
            return;
        }

        if (this._XFollow) {
            var x = this.targetFollow.x - this.anchorPos.x;
            this.node.x = x;
        }
        
        if (this._YFollow) {
            var y = this.targetFollow.y - this.anchorPos.y;
            if (y < 0) {
                y = 0;
            }
            this.node.y = y;    
        }
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

    setStopXFollow:function () {
        this._XFollow = false;
    },

    setStartXFollow:function () {
        this._XFollow = true;  
    },

    setStopYFollow:function () {
        this._YFollow = false;
    },
    
    setStartYFollow:function () {
        this._YFollow = true;  
    },
});
