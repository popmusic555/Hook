
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
    },

    onLoad () {

    },

    start () {
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
        this.node.x = x;
        this.node.y = y;
    }

});
