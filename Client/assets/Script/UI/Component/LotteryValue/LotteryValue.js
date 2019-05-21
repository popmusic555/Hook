
cc.Class({
    extends: cc.Component,

    properties: {
        lotteryLabel:cc.Label,
        // 速度
        num:0,
    },

    // onLoad () {},

    start () {

    },

    update (dt) {
        this.setLotteryNum(Global.Model.Game.lottery);
    },

    /**
     * 设置速度
     * 
     * @param {any} num 速度值
     */
    setLotteryNum:function (num) {
        this.num = num;
        this.lotteryLabel.string = num;
    },
});
