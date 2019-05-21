
var LaunchPower = require("LaunchPower");

cc.Class({
    extends: cc.Component,

    properties: {
        spAni:sp.Skeleton,
        effectSomke:sp.Skeleton,
        launchPower:LaunchPower,

        _LaunchingCallback:null,
        // 发射力量进度
        _Power:0,
        // 发射速度
        _LaunchSpeed:0,
    },

    // onLoad () {},

    start () {
        this.spAni.setEventListener(this.onLaunching.bind(this));
    },

    // update (dt) {},

    lateUpdate (dt) {
        var distanceLeft = cc.Camera.main.node.x - cc.view.getVisibleSize().width * 0.5 + 812;

        if (distanceLeft >= cc.view.getVisibleSize().width) {
            console.log("大炮删除");
            this.node.destroy();
        }
    },

    launching:function (speed , callback) {
        this.launchPower.close(); 
        this._Power = this.launchPower.getPower();
        this._LaunchSpeed = speed * this._Power;

        this.spAni.loop = false;
        this.spAni.animation = "fashe";  
        this._LaunchingCallback = callback;
    },

    onLaunching:function (trackEntry , event) {
        if (event.data.name == "yanwu") {
            this.effectSomke.node.active = true;     
            this._LaunchingCallback(this._LaunchSpeed , this._LaunchSpeed);
        }
    },
});
