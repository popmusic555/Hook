
var LBase = require("LBase");

cc.Class({
    extends: cc.Component,

    properties: {
        // 关卡ID
        passID:0,
        // 怪物列表
        monsterList:[LBase],

        _IsUpdate:false,
    },

    // onLoad () {},

    start () {
        this.passID = -1;
    },

    // update (dt) {},

    launching:function () {
        this._IsUpdate = true;
    },

    /**
     * 更新怪物
     *
     * @param {*} cameraX
     * @param {*} cameraY
     */
    updateMonster:function (cameraX , cameraY) {
        // if (true) {
        //     return;
        // }

        if (!this._IsUpdate) {
            return;
        }

        // 更新关卡ID
        this._RefreshPassID();

        var distanceLeft = cameraX - cc.view.getVisibleSize().width * 0.5 - this.node.x;
        var distanceRight = cameraX + cc.view.getVisibleSize().width * 0.5 - this.node.x;

        var len = this.monsterList.length;
        for (let index = 0; index < len; index++) {
            var list = this.monsterList[index];
            list.updateMonster(distanceLeft , distanceRight);
        }
    },

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    _RefreshPassID:function () {
        var passID = Global.Model.MWall.getPassID();
        if (passID > this.passID) {
            this.refreshByPassID(passID);
        }
    },

    /**
     * 根据关卡ID刷新
     *
     * @param {*} passID 关卡ID
     */
    refreshByPassID:function (passID) {
        this.setPassID(passID);

        var len = this.monsterList.length;
        for (let index = 0; index < len; index++) {
            var list = this.monsterList[index];
            list.refreshByPassID(passID);
        }
    },

});
