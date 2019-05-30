
cc.Class({
    extends: cc.Component,

    properties: {
        // 里程数
        mileageLabel:cc.Label,
        // 金币数
        coinsLabel:cc.Label,

        mileage:0,
        maxPass:0,
        coins:0,
        killNum:0,
        fragmentList:null,
        launchPower:0,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onBackBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    onVideoBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.double(this.coins);
    },

    onContinueBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("NewGameScene");
        }
    },

    show:function (mileage , maxPass , coins , killNum , fragmentList , launchPower) {
        Global.Common.Audio.playMusic("settlement" , false);
        this.node.active = true;
        this.mileage = mileage;
        this.maxPass = maxPass;
        this.coins = coins;
        this.killNum = killNum;
        this.fragmentList = fragmentList;
        this.launchPower = launchPower;
        this.setParam(mileage , coins);
        this.settlement(mileage , maxPass , coins , killNum , fragmentList , launchPower);
    },

    hide:function (coins) {
        this.node.active = false;  
    },

    double:function () {
        var video = 1;

        Global.Common.Http.req("uploadWX" , {
            name:"",
            useruin:Global.Model.Game.uuid,
            gold:coins,
            score:Global.Model.Game.mileage,
            fullstate:0,
            monsternum:0,
            puzzle:Global.Model.Game.getFragmentForNum(),
            video:video,
            firstPlay:Global.Model.Game.getGuideForNum(),
            passLv:maxPass,
        } , function (resp , url) {
            // 增加金币
            Global.Model.Game.addCoins(coins);
        }.bind(this));
    },

    settlement:function (mileage , maxPass , coins , killNum , fragmentList , launchPower) {
        // 设置任务碎片
        Global.Model.Game.addFragment(fragmentList);
        // 设置最大历程
        var highestMileage = Global.Model.Game.mileage;
        if (mileage > highestMileage) {
            Global.Model.Game.setHighestMileage(mileage);
        }

        var fullstate = 0;
        if (launchPower == Global.Common.Const.LAUNCH_RATE.length) {
            fullstate = 1;
        }
        var video = 0;

        Global.Common.Http.req("uploadWX" , {
            name:"",
            useruin:Global.Model.Game.uuid,
            gold:coins,
            score:Global.Model.Game.mileage,
            fullstate:fullstate,
            monsternum:killNum,
            puzzle:Global.Model.Game.getFragmentForNum(),
            video:video,
            firstPlay:Global.Model.Game.getGuideForNum(),
            passLv:maxPass,
        } , function (resp , url) {
            // 增加金币
            Global.Model.Game.addCoins(coins);
            // 设置最大关卡数
            var curMaxPass = Global.Model.Game.maxPass;
            if (maxPass > curMaxPass) {
                Global.Model.Game.setMaxPass(maxPass);
            }
            
            // 设置总击杀数量
            Global.Model.Game.addKillNum(killNum);
        }.bind(this));
    },

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },
});
