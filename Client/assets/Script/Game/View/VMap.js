
var Skybox = require("Skybox");
var MountainBg = require("MountainBg");
var FloorBg = require("FloorBg");

cc.Class({
    extends: cc.Component,

    properties: {
        skybox:Skybox,
        mountainBg:MountainBg,
        floorBg:FloorBg,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    updateMap:function (cameraX , cameraY) {
        var xDistance = cameraX - cc.view.getVisibleSize().width * 0.5 - this.node.x;
        var yDistance = cameraY - cc.view.getVisibleSize().height * 0.5 - this.node.y;
        this.skybox.refresh(xDistance , yDistance);
        this.mountainBg.refresh(xDistance , yDistance);
        this.floorBg.refresh(xDistance , yDistance);
    },

    // 根据关卡ID刷新地图
    refreshByPassID:function (passId) {
        this.skybox.refreshByPassID(passId);
        this.mountainBg.refreshByPassID(passId);
        this.floorBg.refreshByPassID(passId);
    },
});
