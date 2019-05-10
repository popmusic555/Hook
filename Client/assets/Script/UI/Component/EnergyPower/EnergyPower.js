
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
        var num = PlayerConfig.getDataByLevel(DataManager.Userdata.getLevelByIndex(2)).energyLimit;
        this.setEnergyLimit(num);
        this.initScale();
        this.setEnergy(num);
    },

    // 初始化刻度
    initScale:function () {
        var scaleNum = this._EnergyLimit / 10;
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
        this.energySlot2.progress = Math.floor(this.curEnergy / 10) / (this._EnergyLimit / 10);
    },

    // 增加1点能量值
    addEnergyForOne:function () {
        this.setEnergy(this.curEnergy + 1);
    },

    // 减少1点能量值
    reduceEnergyForOne:function () {
        this.setEnergy(this.curEnergy - 1);  
    },

    // 增加10点能量值
    addEnergyForTen:function () {
        this.setEnergy(this.curEnergy + 10);
    },

    // 减少1点能量值
    reduceEnergyForTen:function () {
        this.setEnergy(this.curEnergy - 10);  
    },

    // 能量是否足够
    isEnoughEnergy:function () {
        return this.curEnergy >= 10;
    },

    // 设置能量值上限
    setEnergyLimit:function (num) {
        this._EnergyLimit = num;
    }

    // update (dt) {},
});
