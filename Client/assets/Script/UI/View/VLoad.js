
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
        this.wxLogin();
    },

    update (dt) {
        var progress = (this._ProgressNum1+this._ProgressNum2);
        if (progress == 1) {
            this.runNextScene();
            this._ProgressNum1 = 1;
            this._ProgressNum2 = 1;
        }
        this.progressLabel.string = "- " + Math.floor(Math.min(progress , 1) * 100) + "% -";
    },

    runNextScene:function () {
        cc.director.loadScene("MainScene");
    },

    login:function () {
        // cc.director.loadScene("MainScene");

        // 服务器登录
        Global.Common.Http.req("logonGame" , {
            uuid:Global.Model.Game.uuid,
            userSource:1,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            // 升级项等级
            var levels = [];
            for (let index = 0; index < 16; index++) {
                const item = resp[index];
                levels.push(parseInt(item));
            }
            Global.Model.Game.initLevels(levels);
            console.log("当前升级项等级" , levels.toString());
            // 金币
            Global.Model.Game.setCoins(parseInt(resp[16]));
            console.log("当前金币数量" , parseInt(resp[16]));
            // 复活次数
            Global.Model.Game.setRevive(parseInt(resp[17]));
            console.log("当前复活数量" , parseInt(resp[17]));
            // 最大里程
            Global.Model.Game.setHighestMileage(parseInt(resp[18]));
            console.log("当前最大里程" , parseInt(resp[18]));
            // 最大关卡
            Global.Model.Game.setMaxPass(parseInt(resp[19]));
            console.log("当前最大关卡" , parseInt(resp[19]));
            // 离线时间
            Global.Model.Game.setOfflineTime(parseInt(resp[20]));
            console.log("当前离线时间" , parseInt(resp[20]));
            // 引导信息
            Global.Model.Game.initGuide(parseInt(resp[21]));
            console.log("当前引导信息" , parseInt(resp[21]));
            
            this.init();
        }.bind(this));
    },

    init:function () {
        // 轮盘信息获取
        Global.Common.Http.req("lotteryRecored" , {
            uuid:Global.Model.Game.uuid,
            type:0,
            video:0,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            // 轮盘免费次数
            Global.Model.Game.setFreeLottery(parseInt(resp[0]));
            console.log("轮盘免费次数" , parseInt(resp[0]));
            // 奖励倍数
            Global.Model.Game.setLotteryNum(parseInt(resp[2]));
            console.log("奖励倍数" , parseInt(resp[2]));
            // 抽奖时间
            var lotteryTime = parseInt(resp[3]);
            console.log("奖励倍数" , lotteryTime);
            Global.Model.Game.setLotteryTime(lotteryTime);
            // 当前时间
            var time = Global.Common.Timer.correct(parseInt(resp[4]));
            if (time - lotteryTime >= Global.Common.Const.LOTTERY_TIME) {
                Global.Model.Game.setLotteryNum(0);
            }
            console.log("当前时间持续时间" , time - lotteryTime);
        }.bind(this));
    },

    wxLogin:function () {
        Global.Model.Game.uuid = "aaaaaaaaaaaaaaaaab";
        // 获取权限
        // if (有权限)
        // 直接获取用户信息
        // else
        // 显示全屏的透明授权按钮

        this.login();
    },
});
