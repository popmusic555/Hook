
var MPlayer = require("MPlayer");
var DataManager = require("DataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        animation:sp.Skeleton,
        smokeAni:sp.Skeleton,
        player:MPlayer,
    },

    // onLoad () {},

    start () {  
    },

    // update (dt) {},

    startEmit:function () {
        this.animation.loop = false;
        this.animation.animation = "fashe";  
        this.animation.setEventListener(this.onEmit.bind(this));
        this.animation.setCompleteListener(this.onEmitEnd.bind(this));
    },

    onEmit:function (trackEntry , event) {
        if (event.data.name == "yanwu") {
            this.smokeAni.node.active = true;        
            this.player.node.active = true;
            this.player.startLaunching();
            var cameraFollow = cc.Camera.main.getComponent("CameraFollow");
            cameraFollow.targetFollow = this.player.node;
            cameraFollow.anchorPos.x = -(cc.view.getVisibleSize().width / 2 - 250);
        }
    },  

    onEmitEnd:function () {
        
    }
});
