
var PlayerConfig = require("PlayerConfig");
var DataManager = require("DataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // 刻度
        scaleImg:cc.SpriteFrame,
        scaleLayout:cc.Layout,
        // 能量槽1
        energySlot1:cc.ProgressBar,
        // 能量槽2
        energySlot2:cc.ProgressBar,
        // 能量上限
        _EnergyLimit:0,
        // 当前能量值
        curEnergy:0,
    },

    // onLoad () {},

    start () {
        var energyLimit = Global.Model.MPlayer.getAttr().energyLimit;
        this.setEnergyLimit(energyLimit);
        this.initScale();
        Global.Model.MPlayer.addEnergy(energyLimit);
        this.setEnergy(Global.Model.MPlayer.getEnergy());
    },

    update(dt) {
        this.setEnergy(Global.Model.MPlayer.getEnergy());
    },

    // 初始化刻度
    initScale:function () {
        var scaleNum = this._EnergyLimit / Global.Common.Const.ENERGY_RATIO;
        for (let index = 0; index < scaleNum - 1; index++) {
            var node = new cc.Node();
            node.name = "Scale";
            var sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = this.scaleImg;
            this.scaleLayout.node.addChild(node);
        }
        var num = this.scaleLayout.node.height / scaleNum;
        this.scaleLayout.paddingBottom = num - 6;
        this.scaleLayout.spacingY = num - 12;
    },

    // 设置能量值
    setEnergy:function (num) {
        if (num > this._EnergyLimit) {
            return;
        }
        this.curEnergy = num;
        this.energySlot1.progress = this.curEnergy / this._EnergyLimit;
        this.energySlot2.progress = Math.floor(this.curEnergy / Global.Common.Const.ENERGY_RATIO) / (this._EnergyLimit / Global.Common.Const.ENERGY_RATIO);
    },

    // 设置能量值上限
    setEnergyLimit:function (num) {
        this._EnergyLimit = num;
    },

    // 能量槽抖动
    shake:function () {
        var upAction = cc.moveBy(0.02 , 0 , 5);
        var downAction = upAction.reverse();
        var rightAction = cc.moveBy(0.02 , 5 , 0);
        var leftAction = rightAction.reverse();

        var action1 = cc.repeat(cc.sequence(upAction , downAction , downAction , upAction) , 2);
        var action2 = cc.repeat(cc.sequence(leftAction , rightAction , rightAction , leftAction) , 2);
        this.node.runAction(cc.sequence(action1 , action2));
    }

    // update (dt) {},
});
