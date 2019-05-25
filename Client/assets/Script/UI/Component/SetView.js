
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
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    show:function () {
        // 暂停
        // 停止物理系统
        var manager = cc.director.getPhysicsManager();
        manager.enabled = false;

        // 停止SP动画
        var components = Global.Model.Game.getGameView().getComponentsInChildren(sp.Skeleton);
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.timeScale = 0;
        }

        // 停止节点动画
        var resumeNodes = cc.director.getActionManager().pauseAllRunningActions();
        this.setResumeNode(resumeNodes);
        this.node.active = true;

    },

    hide:function () {
        this.node.active = false;
    },
});
