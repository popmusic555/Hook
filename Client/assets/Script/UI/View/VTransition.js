
cc.Class({
    extends: cc.Component,

    properties: {
        // 动画
        ani:cc.Sprite,
    },

    onLoad () {
    },

    start () {
        if (Global.Model.Game.transition) {
            this.transitionEnd();
        }
        else
        {
            this.ani.node.parent.active = false;
        }
    },

    transitionWithScene:function (scenename) {
        console.log("scenename" , scenename);
        Global.Model.Game.transition = true;
        this.ani.node.parent.active = true;
        this.ani.node.x = 0 - this.ani.node.width * 0.5 - cc.view.getVisibleSize().width * 0.5
        console.log("this.ani.node.x" , this.ani.node.x);
        var action = cc.sequence(cc.moveBy(0.3 , cc.view.getVisibleSize().width + 350 , 0) , cc.callFunc(function () {
            cc.director.loadScene(scenename);    
        } , this));
        this.ani.node.runAction(action);
    },

    transitionEnd:function () {
        console.log("transitionEnd");
        Global.Model.Game.transition = false;
        this.ani.node.parent.active = true;
        this.ani.node.x = 0 - this.ani.node.width * 0.5 + cc.view.getVisibleSize().width * 0.5 + 350;
        var action = cc.sequence(cc.moveBy(0.3 , this.ani.node.width - 350 , 0) , cc.callFunc(function () {
            this.ani.node.parent.active = false;
        } , this));
        this.ani.node.runAction(action);
    },

    // update (dt) {},
});
