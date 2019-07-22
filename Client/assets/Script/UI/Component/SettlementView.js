
var WxAdapter = require("WxAdapter");

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
        Global.Model.Game.share(WxAdapter , 0);
        this.scheduleOnce(function () {
            this.double(this.coins);
        }.bind(this) , 0.5);
        
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

    double:function (coins) {
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
            passLv:Global.Model.Game.maxPass,
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
        // 增加金币
        Global.Model.Game.addCoins(coins);
        // 设置最大关卡数
        var curMaxPass = Global.Model.Game.maxPass;
        if (maxPass > curMaxPass) {
            Global.Model.Game.setMaxPass(maxPass);
        }
        // 设置总击杀数量
        Global.Model.Game.addKillNum(killNum);
        // 设置引导
        Global.Model.Game.setGuide(Global.Model.MPlayer.getGuideStep() , Global.Model.MPlayer.getMonsterGuide());

        var fullstate = 0;
        if (launchPower == Global.Common.Const.LAUNCH_RATE.length - 1) {
            fullstate = 1;
        }
        var video = 0;

        // 请求列表
        var reqList = [];
        reqList.push({
            action:"uploadWX",
            params:{
                name:"",
                useruin:Global.Model.Game.uuid,
                gold:coins,
                score:Global.Model.Game.mileage,
                fullstate:fullstate,
                monsternum:killNum,
                puzzle:Global.Model.Game.getFragmentForNum(),
                video:video,
                firstPlay:Global.Model.Game.getGuideForNum(),
                passLv:Global.Model.Game.maxPass,
            },
            callback:function (resp , url) {
                if (resp[0] != "OK") {
                    return false;
                }
                // 上传数据成功
                console.log("Response " , url , resp);
                console.log("上传数据成功");
                WxAdapter.postMsgToOpenData({
                    cmd:"updateUser",
                    mileage:Global.Model.Game.mileage,
                    combo:Global.Model.Game.getCombo(),
                });
            }.bind(this),
        });

        if (Global.Model.MPlayer.gamedata.isCross && Global.Model.Game.getLevelByItemID(7) < 0) {
            this.unLockItem(reqList , 7);
        }
        if (Global.Model.MPlayer.gamedata.isKillJump && Global.Model.Game.getLevelByItemID(9) < 0) {
            this.unLockItem(reqList , 9);
        }
        if (Global.Model.MPlayer.gamedata.isKillEnergy && Global.Model.Game.getLevelByItemID(10) < 0) {
            this.unLockItem(reqList , 10);
        }
        if (Global.Model.MPlayer.gamedata.isKillPlane && Global.Model.Game.getLevelByItemID(11) < 0) {
            this.unLockItem(reqList , 11);
        }

        Global.Common.Http.reqList(reqList);
        // console.log("当前局金币", coins);
        // console.log("当前局里程", Global.Model.Game.mileage);
        // console.log("当前局发射力", launchPower , Global.Common.Const.LAUNCH_RATE.length);
        // console.log("当前局击杀", killNum);
        // console.log("当前局碎片", Global.Model.Game.getTask().fragment);
        // console.log("当前局碎片", Global.Model.Game.getFragmentForNum());
        // console.log("当前局是否视频", video);
        // console.log("当前局引导", Global.Model.Game.guideStep , Global.Model.Game.monsterGuide);
        // console.log("当前局引导", Global.Model.Game.getGuideForNum());
        // console.log("当前局最大关卡", Global.Model.Game.maxPass);
    },

    setParam:function (mileage , coins) {
        this.mileageLabel.string = mileage;
        this.coinsLabel.string = coins;
    },

    unLockItem:function (reqList , index) {
        reqList.push({
            action:"updateProperty",
            params:{
                uuid:Global.Model.Game.uuid,
                propertyid:index,
                level:0,
                CurGold:Global.Model.Game.coins,
            },
            callback:function (resp , url) {
                var result = parseInt(resp[0]);
                if (result != 0) {
                    return;
                }
                Global.Model.Game.levelUp(index);
                console.log("解锁成功" , index);
            }.bind(this),
        });
    },
});
