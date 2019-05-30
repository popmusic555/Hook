cc.Class({
    extends: cc.Component,

    properties: {
        lotteryNumLabel:cc.Label,
        lotteryBtnLabel:cc.Label,
        arrow:cc.Node,
        bgAni:sp.Skeleton,
        arrowAni:sp.Skeleton,
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
        Global.Common.Audio.playEffect("btn1Click" , false);
        if (this._Lock) {
            return;
        }
        this._Lock = true;
        var freeNum = Global.Model.Game.freeLottery;
        if (freeNum > 0) {
            this.startLottery(0);
        }
        else
        {
            // 视频开启
            this.startLottery(1);
        }
    },

    onCloseBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();
    },

    hide:function () {
        this.node.active = false;  
    },

    startLottery:function (isVideo) {
        // 轮盘奖励获取
        Global.Common.Http.req("lotteryRecored" , {
            uuid:Global.Model.Game.uuid,
            type:1,
            video:isVideo,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            // 轮盘免费次数
            Global.Model.Game.setFreeLottery(parseInt(resp[0]));
            // 奖励倍数
            Global.Model.Game.setLotteryNum(parseInt(resp[2]));
            // 抽奖时间
            var lotteryTime = parseInt(resp[3]);
            Global.Model.Game.setLotteryTime(lotteryTime);
            // 当前时间
            var time = Global.Common.Timer.correct(parseInt(resp[4]));
            if (time - lotteryTime >= Global.Common.Const.LOTTERY_TIME) {
                Global.Model.Game.setLotteryNum(0);
            }

            var arr = [];
            for (let index = 0; index < this._LotteryList.length; index++) {
                const element = this._LotteryList[index];
                if (element == Global.Model.Game.lottery) {
                    arr.push(index);
                }
            }

            this.turnOn(arr[Global.Common.Utils.random(0 , arr.length-1)]);

        }.bind(this));
    },

    turnOn:function (index) {
        this.lotteryNum = index;
        var angle = this._AngleList[this.lotteryNum] + 1080 - this._LastAngle + Global.Common.Utils.random(10 , 50);
        var action = cc.sequence(cc.rotateBy(3.0 , angle).easing(cc.easeExponentialOut()) , cc.callFunc(function () {
            console.log("获取转盘奖励" , this.lotteryNum);
            this.bgAni.node.active = true;
            this.bgAni.animation = "zhuanpan";
            this.bgAni.setCompleteListener(function () {
                this.bgAni.active = false;
            }.bind(this));
            this.arrowAni.node.active = true;
            this.arrowAni.animation = "shouji_y";
            this.arrowAni.setCompleteListener(function () {
                this.arrowAni.active = false;
            }.bind(this));

            this._LastAngle = this.arrow.rotation % 360;
            this._Lock = false;
            this.refreshLotteryLabel();
        } , this));
        action.setTag(10);
        this.arrow.runAction(action);
    },

    show:function () {
        // 当前转盘倍数是否超时
        var curTime = Global.Common.Timer.getTime();
        if (curTime > Global.Model.Game.lotteryTime >= Global.Common.Const.LOTTERY_TIME) {
            // 超时倍数清零
            Global.Model.Game.setLotteryNum(0);
        }

        this.node.active = true;
        this.lotteryNum = 0;
        this._LastAngle = 0;
        this._Lock = false;
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

        var freeNum = Global.Model.Game.freeLottery;
        if (freeNum > 0) {
            this.lotteryBtnLabel.string = "免  费";
        }
        else
        {
            this.lotteryBtnLabel.string = "看视频转转盘";
        }
    }
});
