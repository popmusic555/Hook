cc.Class({
    extends: cc.Component,

    properties: {
        _TouchListener:null,
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    start () {

    },

    // update (dt) {},

    onTouched:function () {
        if (this._TouchListener) {
            this._TouchListener.onTouched();
        }
    },
    
    setTouchListener:function (gameObject) {
        this._TouchListener = gameObject;
    },
});
