cc.Class({
    extends: cc.Component,

    properties: {
        // follow:cc.Node,
        // 世界坐标
        worldPosY:0,
    },

    // onLoad () {},

    start () {

    },

    lateUpdate (dt) {

        // new cc.Node().rotation

        var nodePos = this.node.parent.convertToNodeSpaceAR(cc.v2(0 , this.worldPosY));

        // this.node.x = this.follow.x;
        this.node.x = 0;
        this.node.y = nodePos.y;
    },
});
