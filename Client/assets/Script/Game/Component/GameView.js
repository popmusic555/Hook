
var MPlayer = require("MPlayer");
var Processor = require("Processor");
var GameCommon = require("GameCommon");
var BuildingGenerator = require("BuildingGenerator");
var DataManager = require("DataManager");

var GamePlayer = cc.Class({
    extends: cc.Component,

    properties: {
        processor:Processor,
        player:MPlayer,
        buildGenerator:BuildingGenerator,
    },

    onLoad () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        // console.newlog = console.log;

        // console.log = function () {
            
        // }
        // 注入处理器
        this.player.injection(this.processor);
        GameCommon.GAME_VIEW = this;
    },

    start () {
        // console.log("cc.Camera.main.getCameraToWorldPoint(0 , 0)" , cc.Camera.main.getCameraToWorldPoint(cc.v2(0,0)));
        GameCommon.GetUIView().setTouchListener(this);
    },

    update (dt) {
        // console.log("cc.Camera.main.getCameraToWorldPoint(0 , 0)" , cc.Camera.main.getCameraToWorldPoint(cc.v2(0,0)));
    },

    onTouched:function () {
        // this.player.startLaunching(DataManager.Userdata.launchingSpeed , 1280 * 2);
        this.player.startLaunching(DataManager.Userdata.launchingSpeed , 300);
    },
});
