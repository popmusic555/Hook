
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    start () {

    },

    onTouched:function () {
        Global.Model.MPlayer.onTouched();
    },

    // update (dt) {},
});
