
var Skybox = require("Skybox");
var MountainBg = require("MountainBg");
var FloorBg = require("FloorBg");
var Cloud = require("Cloud");

cc.Class({
    extends: cc.Component,

    properties: {
        skybox:Skybox,
        mountainBg:MountainBg,
        floorBg:FloorBg,
        cloud:Cloud,

        // 关卡ID
        passID:0,
    },

    // onLoad () {},

    start () {
        this.passID = -1;
    },

    // update (dt) {},

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    updateMap:function (cameraX , cameraY) {
        this._RefreshPassID();

        var xDistance = cameraX - cc.view.getVisibleSize().width * 0.5 - this.node.x;
        var yDistance = cameraY - cc.view.getVisibleSize().height * 0.5 - this.node.y;
        this.skybox.refresh(xDistance , yDistance);
        this.mountainBg.refresh(xDistance , yDistance);
        this.floorBg.refresh(xDistance , yDistance);
        this.cloud.refresh(xDistance , yDistance);
    },

    _RefreshPassID:function () {
        var passID = Global.Model.MWall.getPassID();
        if (passID > this.passID) {
            this.refreshByPassID(passID);
        }
    },

    /**
     * 根据关卡ID刷新
     *
     * @param {*} passID 关卡ID
     */
    refreshByPassID:function (passID) {
        this.setPassID(passID);
        console.log("VMap refreshByPassID");
        this.skybox.refreshByPassID(passID);
        this.mountainBg.refreshByPassID(passID);
        this.floorBg.refreshByPassID(passID);
        this.cloud.refreshByPassID(passID);
    },
});
