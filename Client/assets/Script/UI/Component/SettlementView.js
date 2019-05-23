
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

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },
});
