
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
            cmd:"refresh",
            headicon:"www.headicon.com",
            nickname:"大王饶命",
        });
    },

    hide:function () {
        this.node.active = false;
    },

    onCloseBtn:function () {
        this.hide();
    },
    
});
