
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    show:function () {
        this.node.active = true;
        // var len = this.node.childrenCount;
        // for (let index = 0; index < len; index++) {
        //     const item = this.node.children[index];
        //     item.active = false;
        // }
        // var action = cc.sequence(cc.delayTime(0.7) , cc.callFunc(function () {
        // },bind(this)));
        // this.runAction(cc.repeat(action , 5));
    },

    hide:function () {
        // var len = this.node.childrenCount;
        // for (let index = 0; index < len; index++) {
        //     const item = this.node.children[index];
        //     item.active = false;
        // }
        this.node.active = false;
    },
});
