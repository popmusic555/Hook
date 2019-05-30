

cc.Class({
    extends: cc.Component,

    properties: {
        _Datas:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    /**
     * 刷新
     *
     */
    refresh:function (datas) {
        this._Datas = datas;
    },
});
