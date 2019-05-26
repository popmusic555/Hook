
cc.Class({
    extends: cc.Component,

    properties: {
        // 里程数
        mileageLabel:cc.Label,
        // 金币数
        coinsLabel:cc.Label,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onBackBtn:function () {
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    onVideoBtn:function () {
        
    },

    onContinueBtn:function () {
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("NewGameScene");
        }
    },

    show:function (mileage , coins , killNum , fragmentList) {
        this.node.active = true;
        coins = coins * (Global.Model.Game.lottery || 1);
        this.settlement(mileage , coins , killNum , fragmentList);
        this.setParam(mileage , coins);
    },

    hide:function () {
        this.node.active = false;  
    },

    settlement:function (mileage , coins , killNum , fragmentList) {
        // 设置最大历程
        var highestMileage = Global.Model.Game.mileage;
        if (mileage >= highestMileage) {
            Global.Model.Game.setHighestMileage(mileage);
        }
        // 增加金币 轮盘奖励加成
        Global.Model.Game.addCoins(coins);
        // 设置总击杀数量
        Global.Model.Game.setKillNum(killNum);
        // 设置任务碎片
        Global.Model.Game.addFragment(fragmentList);
    },

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },
});
