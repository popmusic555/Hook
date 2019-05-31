
var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    show:function () {
        this.node.active = true;
        WxAdapter.postMsgToOpenData({
            cmd:"rank",
        });
    },

    hide:function () {
        this.node.active = false;
    },

    onCloseBtn:function () {
        this.hide();
    },
    
});
