cc.Class({
    extends: cc.Component,

    properties: {
        lotteryNoLabel:cc.Label,
        lotteryNumLabel:cc.Label,
        lotteryTimeLabel:cc.Label,
        lotteryBtnLabel:cc.Label,
        arrow:cc.Node,
        lottery:cc.Node,
        bgAni:sp.Skeleton,
        lotteryAni:cc.Animation,
        arrowAni:sp.Skeleton,
        lotteryNum:0,

        _AngleList:null,
        _LotteryList:null,
        _LastAngle:0,
        _Lock:false,
        _Timecallback:null,
    },

    // onLoad () {},

    start () {
        this._AngleList = [0 , 300 , 240 , 180 , 120 , 60];
        this._LotteryList = [3 , 2 , 4 , 3 , 2 , 4];
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
        Global.Common.Audio.playEffect("btn1Click" , false);
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
        var angle = this._AngleList[this.lotteryNum] + 1080 - this._LastAngle + Global.Common.Utils.random(0 , 0);
        var action = cc.sequence(cc.rotateBy(3.0 , angle).easing(cc.easeExponentialOut()) , cc.callFunc(function () {
            console.log("获取转盘奖励" , this.lotteryNum);
            
            this.lotteryAni.node.active = true;
            this.lotteryAni.play();
            this.lotteryAni.getComponent(cc.ParticleSystem).resetSystem();
            this.lotteryAni.on('finished',function () {
                this.lotteryAni.off('finished',this.onFinished,this);
                this.lotteryAni.getComponent(cc.ParticleSystem).stopSystem();

                this.arrowAni.node.active = true;
                this.arrowAni.animation = "shouji_y";
                this.arrowAni.setCompleteListener(function () {
                    this.arrowAni.active = false;

                    this._LastAngle = this.lottery.rotation % 360;
                    this._Lock = false;
                    this.refreshLotteryLabel();

                }.bind(this));
            },this);
            
        } , this));
        action.setTag(10);
        this.lottery.runAction(action);
        var action1 = cc.rotateBy(3.0 , -360).easing(cc.easeExponentialOut());
        action1.setTag(10);
        this.arrow.runAction(action1);
        this.bgAni.node.active = true;
        this.bgAni.animation = "zhuanpan";
        this.bgAni.setCompleteListener(function () {
            this.bgAni.active = false;
        }.bind(this));
    },

    show:function () {
        // 当前转盘倍数是否超时
        var curTime = Global.Common.Timer.getTime();
        if (curTime - Global.Model.Game.lotteryTime >= Global.Common.Const.LOTTERY_TIME) {
            // 超时倍数清零
            Global.Model.Game.setLotteryNum(0);
        }

        this.node.active = true;
        this.lotteryNum = 0;
        this._LastAngle = 0;
        this._Lock = false;
        this.arrow.rotation = 0;
        this.lottery.rotation = 0;
        this.refreshLotteryLabel();
        this.arrow.stopActionByTag(10);
        this.lottery.stopActionByTag(10);
    },

    refreshLotteryLabel:function () {
        this.unschedule(this._Timecallback);
        var num = Global.Model.Game.lottery;
        if (num <= 0) {
            this.lotteryNoLabel.node.active = true;
            this.lotteryNumLabel.node.parent.active = false;
        }
        else
        {
            this.lotteryNoLabel.node.active = false;
            this.lotteryNumLabel.node.parent.active = true;
            this.lotteryNumLabel.string = "x " + num;
            this.lotteryTimeLabel.string = Global.Common.Utils.getTimeToTimeString(this.getLotteryTime());

            this._Timecallback = this.refreshTimes.bind(this);
            this.schedule(this._Timecallback , 1);
        }

        var freeNum = Global.Model.Game.freeLottery;
        if (freeNum > 0) {
            this.lotteryBtnLabel.string = "免  费";
        }
        else
        {
            this.lotteryBtnLabel.string = "看视频转转盘";
        }
    },

    refreshTimes:function () {
        this.lotteryTimeLabel.string = Global.Common.Utils.getTimeToTimeString(this.getLotteryTime());
    },

    getLotteryTime:function () {
        var curTime = Global.Common.Timer.getTime();
        return Global.Common.Const.LOTTERY_TIME - (curTime - Global.Model.Game.lotteryTime);
    },
});
