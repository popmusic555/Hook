cc.Class({
    extends: cc.Component,

    properties: {
        lotteryNumLabel:cc.Label,
        arrow:cc.Node,
        lotteryNum:0,

        _AngleList:null,
        _LotteryList:null,
        _LastAngle:0,
        _Lock:false,
    },

    // onLoad () {},

    start () {
        this._AngleList = [30 , 90 , 150 , 210 , 270 , 330];
        this._LotteryList = [2 , 4 , 3 , 2 , 4 , 3];
    },

    // update (dt) {},

    onStartBtn:function () {
        this.turnOn(Global.Common.Utils.random(0 , 5));
    },

    onCloseBtn:function () {
        this.hide();
    },

    hide:function () {
        this.node.active = false;  
    },

    turnOn:function (index) {
        if (this._Lock) {
            return;
        }
        this._Lock = true;
        this.lotteryNum = index;
        var angle = this._AngleList[this.lotteryNum] + 1080 - this._LastAngle + Global.Common.Utils.random(10 , 50);
        var action = cc.sequence(cc.rotateBy(3.0 , angle).easing(cc.easeExponentialOut()) , cc.callFunc(function () {
            console.log("获取转盘奖励" , this.lotteryNum);
            this._LastAngle = this.arrow.rotation % 360;
            this._Lock = false;
            Global.Model.Game.setLotteryNum(this._LotteryList[this.lotteryNum]);
            this.refreshLotteryLabel();
        } , this));
        action.setTag(10);
        this.arrow.runAction(action);
    },

    show:function () {
        this.node.active = true;
        this.lotteryNum = 0;
        this._LastAngle = 0;
        this.arrow.rotation = 0;
        this.refreshLotteryLabel();
        this.node.stopActionByTag(10);
    },

    refreshLotteryLabel:function () {
        var num = Global.Model.Game.lottery;
        if (num <= 0) {
            this.lotteryNumLabel.string = "当前无奖励倍数";
        }
        else
        {
            this.lotteryNumLabel.string = "x " + num;
        }
    }
});
