
cc.Class({
    extends: cc.Component,

    properties: {
        coinsLabel:cc.Label,
        // 金币
        coins:0,
    },

    // onLoad () {},

    start () {
        
    },

    update (dt) {
        this.setCoins(Global.Model.MPlayer.getRewardsCoins());
    },

    setCoins:function (num) {
        this.coins = num;
        this.coinsLabel.string = this.coins;
    },
});
