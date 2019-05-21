
cc.Class({
    extends: cc.Component,

    properties: {
        speedLabel:cc.Label,
        // 速度
        speed:0,
    },

    // onLoad () {},

    start () {

    },

    update (dt) {
        this.setSpeed(Global.Model.MPlayer.getSpeedPower());
    },

    /**
     * 设置速度
     * 
     * @param {any} num 速度值
     */
    setSpeed:function (num) {
        this.speed = num;
        this.speedLabel.string = num;
    },
});
