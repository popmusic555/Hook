
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
        this.settlementView.node.active = true;
        this.settlementView.setParam(Global.Model.MPlayer.getRewardsCoins() , Global.Model.MPlayer.getMileage());
    },

    showSetView:function () {
        // 暂停
        // 停止物理系统
        var manager = cc.director.getPhysicsManager();
        manager.enabled = false;

        // 停止SP动画
        var components = Global.Model.Game.getGameView().getComponentsInChildren(sp.Skeleton);
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.timeScale = 0;
        }

        // 停止节点动画
        var resumeNodes = cc.director.getActionManager().pauseAllRunningActions();
        this.setView.setResumeNode(resumeNodes);
        this.setView.node.active = true;
    },

    onSetBtn:function () {
        this.showSetView();  
    },  
});
