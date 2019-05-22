
cc.Class({
    extends: cc.Component,

    properties: {
        // 金币数量
        coins:cc.Label,
        // 复活次数
        revive:cc.Label,
        // 最大里程
        highestMileage:cc.Label,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    refresh:function () {
        var game = Global.Model.Game;
        this.coins.string = game.coins;
        this.revive.string = game.revive;
        this.highestMileage.string = game.mileage;
    },
});
