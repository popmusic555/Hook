
var GameCommon = require("GameCommon");

cc.Class({
    extends: cc.Component,

    properties: {
        _ResumeNode:null,
    },

    // onLoad () {},

    start () {

    },

    setResumeNode:function (nodes) {
        this._ResumeNode = nodes;
    },

    // update (dt) {},

    onCloseBtn:function () {
        this.hide();
    },

    onBackBtn:function () {
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    onMusicBtn:function (target) {
        if (target.isChecked) {
            console.log("打开音乐");
        }
        else
        {
            console.log("关闭音乐");
        }
    },

    show:function () {
        this.node.active = true;
        Global.Model.Game.pauseGame();
    },

    hide:function () {
        this.node.active = false;
        Global.Model.Game.resumeGame();
    },
});
