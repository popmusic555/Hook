
var Processor = require("Processor");
var GameCommon = require("GameCommon");
var BuildingGenerator = require("BuildingGenerator");
var MArtillery = require("MArtillery");

var GamePlayer = cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type:cc.AudioClip,
            default:null,
        },

        sound:{
            type:[cc.AudioClip],
            default:[],
        },

        processor:Processor,
        artillery:MArtillery,
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
        // this.player.injection(this.processor);
        GameCommon.GAME_VIEW = this;
    },

    start () {
        GameCommon.GetUIView().setTouchListener(this);
    },

    update (dt) {
    },

    onTouched:function () {
        this.artillery.startEmit();
    },

    playSound:function (index) {
        cc.audioEngine.playEffect(this.sound[index] , false);
    },
});
