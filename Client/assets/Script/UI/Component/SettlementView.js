
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
        Global.Common.Audio.playEffect("btn1Click" , false);
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    onVideoBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
    },

    onContinueBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("NewGameScene");
        }
    },

    show:function (mileage , maxPass , coins , killNum , fragmentList) {
        Global.Common.Audio.playMusic("settlement" , false);
        this.node.active = true;
        coins = coins;
        this.settlement(mileage , maxPass , coins , killNum , fragmentList);
        this.setParam(mileage , coins);
    },

    hide:function () {
        this.node.active = false;  
    },

    settlement:function (mileage , maxPass , coins , killNum , fragmentList) {
        // 设置最大历程
        var highestMileage = Global.Model.Game.mileage;
        if (mileage > highestMileage) {
            Global.Model.Game.setHighestMileage(mileage);
        }
        // 设置最大关卡数
        var curMaxPass = Global.Model.Game.maxPass;
        if (maxPass > curMaxPass) {
            Global.Model.Game.setMaxPass(maxPass);
        }
        
        // 增加金币 轮盘奖励加成
        Global.Model.Game.addCoins(coins);
        // 设置总击杀数量
        Global.Model.Game.addKillNum(killNum);
        // 设置任务碎片
        Global.Model.Game.addFragment(fragmentList);
    },

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },
});
