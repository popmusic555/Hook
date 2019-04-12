
var GameMonster = require("GameMonster");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");
var MJump = require("MJump");

cc.Class({
    extends: GameMonster,

    properties: {
        _IsTouch:false,

        mJump:MJump,
    },

    // onLoad () {},

    start () {
        this._super();
        this.injection(cc.find("Canvas/Processor").getComponent("Processor"));
    },

    update (dt) {
        this.node.x = 0;
        this.node.y = 0;
        this.SyncLinearVelocity(this.mJump);
    },
    lateUpdate(dt) {
        this._super(dt);
    },

    onBeginContact:function (contact, selfCollider, otherCollider) {
        this._super(contact, this.mJump, otherCollider);
    },

    onEndContact:function (contact, selfCollider, otherCollider) {
        this._super(contact, this.mJump, otherCollider);
    },
});
