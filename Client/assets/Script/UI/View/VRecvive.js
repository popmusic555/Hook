
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
            cmd:"gameinside",
            mileage:Global.Model.MPlayer.getMileage(),
        });

        this.schedule(function () {
            this.hide();
            Global.Model.Game.showSettlementView();
        }.bind(this) , 1 , 3 , 0);
    },

    hide:function () {
        this.node.active = false;
    },

    onRecvive:function () {
        this.hide();
        // 复活
        console.log("复活");
    },
});
