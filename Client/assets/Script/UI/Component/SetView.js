
var GameCommon = require("GameCommon");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onCloseBtn:function () {
        this.node.active = false;
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;  

        var components = GameCommon.GAME_VIEW.node.getComponentsInChildren(sp.Skeleton);
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.timeScale = 1;
        }

        components = GameCommon.GAME_VIEW.node.getComponentsInChildren("MPlayer");
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.resume();
        }
    },

    onBackBtn:function () {
        cc.director.loadScene("MainScene");  
    },
});
