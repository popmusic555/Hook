
cc.Class({
    extends: cc.Component,

    properties: {
        coinsLabel:cc.Label,
        // 金币
        coins:0,
    },

    // onLoad () {},

    start () {
        this.setCoins(this.coins);
    },

    // update (dt) {},

    setCoins:function (num) {
        this.coins = num;
        this.coinsLabel.string = this.coins;
    },

    addCoins:function (num) {
        this.coins += num;
        this.setCoins(this.coins);
    },

    getCoins:function () {
        return this.coins;
    }
});
