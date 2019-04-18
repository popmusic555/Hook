
var MapManager = require("MapManager");

// 相机跟随脚本
cc.Class({
    extends: cc.Component,

    properties: {
        targetFollow:cc.Node,
        // 锚点位置
        anchorPos:cc.Vec2,

        // 地图
        map:MapManager,

        _StopPosX:null,
    },

    onLoad () {

    },

    start () {
        this._StopPosX = null;
    },

    lateUpdate: function (dt) {
        // this.map.updateMap(this.node.x , this.node.y);
        // this.generator.generatorMonster(this.node.x);
        this.updatePos();
        this.map.updateMap(this.node.x , this.node.y);
    },

    updatePos:function () {
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

});
