
var GameCommon = require("GameCommon");
var SetView = require("SetView");
var SettlementView = require("SettlementView");

var EnergyPower = require("EnergyPower");
var SpeedPower = require("SpeedPower");
var CoinsValue = require("CoinsValue");
var MileageValue = require("MileageValue");

cc.Class({
    extends: cc.Component,

    properties: {
        // 结算界面
        settlementView:SettlementView,
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

    showSettlementView:function () {
        var mplayer = Global.Model.MPlayer;
        var mWall = Global.Model.MWall;
        this.settlementView.show(mplayer.getMileage() , mWall.getPassID() , mplayer.getRewardsCoins() , mplayer.getKillNum() , mplayer.getFragment());
    },

    showSetView:function () {
        this.setView.show();
    },

    onSetBtn:function () {
        this.showSetView();  
    },  
});
