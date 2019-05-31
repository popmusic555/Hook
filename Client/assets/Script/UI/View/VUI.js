
var SetView = require("SetView");
var SettlementView = require("SettlementView");
var VRecvive = require("VRecvive");

var EnergyPower = require("EnergyPower");
var SpeedPower = require("SpeedPower");
var CoinsValue = require("CoinsValue");
var MileageValue = require("MileageValue");

cc.Class({
    extends: cc.Component,

    properties: {
        // 结算界面
        settlementView:SettlementView,
        // 复活界面
        recviveView:VRecvive,
        // 设置界面
        setView:SetView,
    },

    onLoad () {
        Global.Model.Game.setUIView(this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    start () {
    },

    // update (dt) {},

    onTouched:function () {
        Global.Model.MPlayer.onTouched();
    },

    showRecvive:function () {
        // 显示超越界面
        this.recviveView.show();
    },

    showSettlementView:function () {
        var mplayer = Global.Model.MPlayer;
        var mWall = Global.Model.MWall;
        this.settlementView.show(mplayer.getMileage() , mWall.getPassID() , mplayer.getRewardsCoins() , mplayer.getKillNum() , mplayer.getFragment() , mplayer.getLaunchPower());
    },

    showSetView:function () {
        this.setView.show();
    },

    onSetBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.showSetView();  
    },  
});
