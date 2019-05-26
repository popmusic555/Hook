cc.Class({
    extends: cc.Component,

    properties: {
        reward:0,
        // 奖励值
        rewardNumLabel:cc.Label,
    },

    // onLoad () {},

    start () {

    },

    show:function (reward) {
        this.node.active = true;
        this.reward = reward;

        this.rewardNumLabel.string = this.reward;
    },

    hide:function () {
        this.node.active = false;  
    },

    onCollectBtn:function () {
        console.log("收取离线奖励");
        this.collectReward(false);
        var vMain = this.node.parent.getComponentInChildren("VMain");
        vMain.refreshTopBar();
    },

    onDoubleBtn:function () {
        console.log("翻倍收取离线奖励");
        this.collectReward(true);
        var vMain = this.node.parent.getComponentInChildren("VMain");
        vMain.refreshTopBar();
    },

    onClose:function () {
        this.hide();  
    },

    collectReward:function (isDouble) {
        if (isDouble) {
            Global.Model.Game.addCoins(this.reward * 2);
        }
        else
        {
            Global.Model.Game.addCoins(this.reward);
        }
    },

    // update (dt) {},
});
