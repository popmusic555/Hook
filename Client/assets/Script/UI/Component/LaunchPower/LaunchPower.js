
// 发射力量槽

cc.Class({
    extends: cc.Component,

    properties: {
        launchProgress:[cc.Sprite],
        launchPower:[cc.Float],

        _Progress:0,
    },

    // onLoad () {},

    start () {
        this._Progress = -1;
        this.open();
    },

    open:function () {
        var action = cc.repeatForever(cc.sequence(cc.delayTime(0.1) , cc.callFunc(function () {
            this._Progress += 1;
            if (this._Progress > 7) {
                this._Progress = 0;
            }
            this.setProgress(this._Progress);
        } , this)));
        action.setTag(10);
        this.node.runAction(action);
    },

    close:function () {
        this.node.stopActionByTag(10);
    },

    isOpen:function () {
        var action = this.node.getActionByTag(10);
        // if (action) {
        //     return true;
        // }
        // return false;
        return !!action;
    },

    setProgress:function (progress) {
        this.launchProgress[progress].node.active = true;
        if (progress == 0) {
            var len = this.launchProgress.length;
            for (let index = 1; index < len; index++) {
                var item = this.launchProgress[index];
                item.node.active = false;
            }
        }
    },

    getProgress:function () {
        return this._Progress;
    },

    getPower:function () {
        return this.launchPower[this.getProgress()];
    },

    // update (dt) {},
});
