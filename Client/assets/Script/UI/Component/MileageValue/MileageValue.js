var DataManager = require("DataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        progress1:cc.ProgressBar,
        progress2:cc.Slider,
        bestIcon:cc.Node,

        maxMileageLabel:cc.Label,
        curMileageLabel:cc.Label,
        bestMileageLabel:cc.Label,

        // 最大里程数
        maxMileage:0,
        // 当前里程数
        curMlieage:0,
        // 最好成绩
        bestMileage:0,
    },

    // onLoad () {},

    start () {
        var wallPosX = Global.Model.MWall.getPosXByPassID(Global.Model.Game.maxPass);
        this.setMaxMileage(Global.Common.Utils.Converter.toMileage(wallPosX));
        this.setBestMileage(Global.Model.Game.mileage);
    },

    update(dt) {
        this.setCurMileage(Global.Model.MPlayer.getMileage());
    },

    // 设置最大里程数
    setMaxMileage:function (num) {
        this.maxMileage = num;

        this.maxMileageLabel.string = this.maxMileage;

        // var progress = this.getCurProgress();
        // this.setCurMileage(progress);
        // progress = this.getBestProgress();
        // this.setBestMileage(progress);
    },

    // 设置当前里程
    setCurMileage:function (num) {
        this.curMlieage = num;

        this.curMileageLabel.string = this.curMlieage;

        var progress = this.getCurProgress();
        this.setCurProgress(progress);

        if (progress >= 1) {
            this.maxMileageLabel.node.active = false;
        }

        if (this.curMlieage >= this.bestMileage) {
            this.bestIcon.active = false;
        }
    },

    // 最好成绩
    setBestMileage:function (num) {
        this.bestMileage = num;

        this.bestMileageLabel.string = this.bestMileage;

        var progress = this.getBestProgress();
        this.setBestProgress(progress);
    },

    // update (dt) {},

    // 获取当前进度
    getCurProgress:function () {
        var progress = this.curMlieage / this.maxMileage;  
        return progress;
    },

    // 获取最好成绩进度
    getBestProgress:function () {
        var progress = this.bestMileage / this.maxMileage;
        return progress;
    },

    setCurProgress:function (num) {
        num = Math.min(num , 1);

        this.progress1.progress = num;
        this.progress2.progress = num;
    },

    setBestProgress:function (num) {
        var posx = this.bestIcon.parent.width * (num - 0.5);
        this.bestIcon.x = posx;
    }
});
