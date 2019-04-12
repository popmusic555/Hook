
var MPlayer = require("MPlayer");
var Processor = require("Processor");
var GameConst = require("GameConst");
var BuildingGenerator = require("BuildingGenerator");

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

        GameConst.GAME_VIEW = this;
    },

    start () {
        // console.log("cc.Camera.main.getCameraToWorldPoint(0 , 0)" , cc.Camera.main.getCameraToWorldPoint(cc.v2(0,0)));
    },

    update (dt) {
        // console.log("cc.Camera.main.getCameraToWorldPoint(0 , 0)" , cc.Camera.main.getCameraToWorldPoint(cc.v2(0,0)));
    },
});
