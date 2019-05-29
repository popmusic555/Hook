
cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type:cc.AudioClip,
            default:null,
        },
        _ProgressNum1:0,
        _ProgressNum2:0,
        progressLabel:cc.Label,
    },

    // onLoad () {},

    start () {
        cc.audioEngine.playMusic(this.bgm, true);

        cc.director.preloadScene("MainScene" , function (completedCount , totalCount , item) {
            var progress = completedCount / totalCount;
            this._ProgressNum1 = Math.max(progress , this._ProgressNum1) * 0.5;
        }.bind(this) , function () {
            this._ProgressNum1 = 0.5;
        }.bind(this))

        cc.director.preloadScene("NewGameScene" , function (completedCount , totalCount , item) {
            var progress = completedCount / totalCount;
            this._ProgressNum2 = Math.max(progress , this._ProgressNum2) * 0.5;
        }.bind(this) , function () {
            this._ProgressNum2 = 0.5;
        }.bind(this))

        // this.runNextScene();
        this.runNextScene1();
    },

    update (dt) {
        var progress = (this._ProgressNum1+this._ProgressNum2);
        if (progress == 1) {
            // this.runNextScene();
            this._ProgressNum1 = 1;
            this._ProgressNum2 = 1;
        }
        this.progressLabel.string = "- " + Math.floor(Math.min(progress , 1) * 100) + "% -";
    },

    runNextScene1:function () {
        cc.director.loadScene("MainScene");
    },

    runNextScene:function () {
        // cc.director.loadScene("MainScene");

        // 微信登录

        // 服务器登录
        Global.Common.Http.req("logonGame" , {
            uuid:"qawsedrftgyhujikolpzxcvbnm",
            userSource:1,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            // 升级项等级
            var levels = [];
            for (let index = 0; index < 16; index++) {
                const item = resp[index];
                levels.push(parseInt(item));
            }
            console.log(levels);
            Global.Model.Game.initLevels(levels);
            // 金币
            Global.Model.Game.setCoins(parseInt(resp[16]));
            // 复活次数
            Global.Model.Game.setRevive(parseInt(resp[17]));
            // 最大里程
            Global.Model.Game.setHighestMileage(parseInt(resp[18]));
            // 最大关卡
            Global.Model.Game.setMaxPass(parseInt(resp[19]));
            // 离线时间
            Global.Model.Game.setOfflineTime(parseInt(resp[20]));
        }.bind(this));

        // 轮盘信息获取
        Global.Common.Http.req("lotteryRecored" , {
            uuid:"qawsedrftgyhujikolpzxcvbnm",
            type:0,
            video:0,
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
        }.bind(this));

        // 任务信息获取
        Global.Common.Http.req("getTasks" , {
            uuid:"qawsedrftgyhujikolpzxcvbnm",
        } , function (resp , url) {
            console.log("Response " , url , resp);
            // 任务ID
            var taskId = parseInt(resp[0]) - 1;
            Global.Model.Game.getTask().id = taskId;
            if (taskId == 0) {
                // 任务0 击杀100小怪
                // 目标值
                // 任务进度
                Global.Model.Game.setKillNum(parseInt(resp[2]));
            }
            else if (taskId == 1) {
                // 任务1 邀请一个好友
                // 目标值
                // 任务进度
            }
            else if (taskId == 2) {
                // 任务2 收集拼图
                // 目标值
                // 任务进度
                Global.Model.Game.initFragment(parseInt(resp[2]));
            }
            // 任务状态
            
        }.bind(this))
    },
});
