
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},

    start () {
        this.node.opacity = 0;

        cc.director.preloadScene("LoadingScene");

        var action = cc.sequence(cc.fadeIn(1.5) , cc.callFunc(function () {
            cc.loader.loadRes("Font/MFLiHei" , cc.Font , function (err, font) {
                console.log("" , err , font);
                this.node.runAction(cc.sequence(cc.delayTime(1.0) , cc.fadeOut(1.5) ,cc.callFunc(function () {
                    console.log("Run Next Scene");
                    cc.director.loadScene("LoadingScene");
                })));
            }.bind(this));
        } , this));

        this.node.runAction(action);
    },

    // update (dt) {},
});
