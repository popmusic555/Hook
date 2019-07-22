
cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel:cc.Label,
        textLabel:cc.Label,
        okBtn:cc.Button,
        cancelBtn:cc.Button,

        _Callback:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    setCancel:function (flag) {
        this.cancelBtn.node.active = flag;
        if (flag) {
            this.okBtn.node.x = 140;
        }
        else
        {
            this.okBtn.node.x = 0;
        }
    },

    show:function (params) {
        this.titleLabel.string = params.title;
        this.textLabel.string = params.text;
        this._Callback = params.click;
        this.node.active = true;
    },

    hide:function () {
        this.node.active = false;
    },

    onOK:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this._Callback(false);
    },

    onCancel:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this._Callback(true);
    },
});
