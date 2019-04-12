
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");

cc.Class({
    extends: GameObject,

    properties: {
        
    },

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    lateUpdate() {
        this._super();
        // var worldPos = cc.Camera.main.getCameraToWorldPoint(cc.v2(cc.view.getVisibleSize().width * 0.5 , 0));
        // this.node.x = this.node.parent.convertToNodeSpaceAR(worldPos).x;

        this.node.x = cc.Camera.main.node.x;
    },
});
