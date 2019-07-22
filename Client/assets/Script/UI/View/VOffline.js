var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
        // 玩家数据表
        levelupPlayer:cc.JsonAsset,

        reward:0,
        // 奖励值
        rewardNumLabel:cc.Label,
    },

    // onLoad () {},

    start () {

    },

    show:function () {
        // 当前离线奖励值
        this.reward = Math.floor(Global.Model.Game.getOfflineTime() / 60);
        if (this.reward < 1) {
            return;
        }

        this.node.active = true;
        if (this.reward > Global.Common.Const.MAX_OFFLINE) {
            this.reward = Global.Common.Const.MAX_OFFLINE;
        }
        
        var level = Global.Model.Game.getLevelByItemID(3);
        var cfg = Global.Model.Game.getConfigByLevel(this.levelupPlayer.json , level);

        this.reward = this.reward * cfg.offlineRewards;
        this.rewardNumLabel.string = this.reward;
    },

    hide:function () {
        this.node.active = false;  
        Global.Model.Game.setOfflineTime(0);
    },

    onCollectBtn:function () {
        Global.Common.Audio.playEffect("btn2Click" , false);
        console.log("收取离线奖励");
        Global.Common.Http.req("offlineGold" , {
            uuid:Global.Model.Game.uuid,
            offlinegold:this.reward,
            video:0,
        } , function (resp , url) {
            var result = parseInt(resp[0]);
            if (result != 0) {
                return;
            }
            this.collectReward(false);
            var vMain = this.node.parent.getComponentInChildren("VMain");
            vMain.refreshTopBar();
            vMain.refresh();
            this.hide();
        }.bind(this));
    },

    onDoubleBtn:function () {
        Global.Common.Audio.playEffect("btn2Click" , false);
        console.log("翻倍收取离线奖励");

        Global.Model.Game.share(WxAdapter , 0);
        this.scheduleOnce(function () {
            
            Global.Common.Http.req("offlineGold" , {
                uuid:Global.Model.Game.uuid,
                offlinegold:this.reward * 2,
                video:1,
            } , function (resp , url) {
                var result = parseInt(resp[0]);
                if (result != 0) {
                    return;
                }
                this.collectReward(true);
                var vMain = this.node.parent.getComponentInChildren("VMain");
                vMain.refreshTopBar();
                vMain.refresh();
                this.hide();
            }.bind(this));

        }.bind(this) , 0.5);
    },

    onClose:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();  
    },

    collectReward:function (isDouble) {
        if (isDouble) {
            Global.Model.Game.addCoins(this.reward * 2);
        }
        else
        {
            Global.Model.Game.addCoins(this.reward);
        }
    },

    // update (dt) {},
});
