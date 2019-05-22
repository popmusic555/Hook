
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
        this.node.active = false;
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;  

        var components = Global.Model.Game.getGameView().getComponentsInChildren(sp.Skeleton);
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.timeScale = 1;
        }

        cc.director.getActionManager().resumeTargets(this._ResumeNode);
    },

    onBackBtn:function () {
        var transition = cc.find("Canvas/Transition");
        if (transition) {
            transition = transition.getComponent("VTransition");
            transition.transitionWithScene("MainScene");
        }
    },
});
