
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
        cc.director.loadScene("MainScene");
    },

    onVideoBtn:function () {
        
    },

    onContinueBtn:function () {
        cc.director.loadScene("GameScene");
    },

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },
});
