cc.Class({
    extends: cc.Component,

    properties: {
        follow:cc.Node,

        _Shadow:cc.Sprite,
    },

    // onLoad () {},

    start () {
        this._Shadow = this.node.getChildByName("Shadow").getComponent(cc.Sprite);
    },

    lateUpdate (dt) {
        if (cc.isValid(this.follow)) {
            var gameObj = this.follow.getComponent("GameObject");
            if (gameObj.isSleep) {
                this._Shadow.node.active = false;
            }
            else
            {
                this._Shadow.node.active = true;
                this.node.x = this.follow.x;
            }
        }
        else
        {
            this.node.destroy();
        }
    },

    setTarget:function (target) {
        this.follow = target;
    },
});
