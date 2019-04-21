
var MPlayer = require("MPlayer");
var DataManager = require("DataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        animation:sp.Skeleton,
        player:MPlayer,
    },

    // onLoad () {},

    start () {  
    },

    // update (dt) {},

    startEmit:function () {
        this.animation.loop = false;
        this.animation.animation = "fashe";  
        this.animation.setCompleteListener(this.onEmitEnd.bind(this));
    },

    onEmitEnd:function () {
        this.player.node.active = true;
        // this.player.startLaunching(DataManager.Userdata.launchingSpeed , 1280 * 2);
        this.player.startLaunching(DataManager.Userdata.launchingSpeed , 300);
        var cameraFollow = cc.Camera.main.getComponent("CameraFollow");
        cameraFollow.targetFollow = this.player.node;
    }
});
