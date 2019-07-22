var RemoteSprite = require("RemoteSprite");
var WxAdapter = require("WxAdapter");

var DOMAIN = [
    [-1 , 5],
    [5 , 15],
    [15 , 30],
    [30 , 50],
    [50 , 99999],
];

var REWARD = [1,2,3,4,5];

cc.Class({
    extends: cc.Component,

    properties: {
        indexLabel:cc.Label,
        headIcon:RemoteSprite,
        rewardLabel:cc.Label,
        stateBtn:[cc.Node],
        tips:cc.RichText,

        // 头像Url
        headIconUrl:"",
        index:0,
        // 奖励数量
        rewardNum:0,
        // 状态
        state:0,

        isRewarding:false,
    },

    // onLoad () {},

    start () {

    },

    setState:function (state) {
        this.stateBtn[this.state].active = false;
        this.state = state;
        this.stateBtn[this.state].active = true;
    },

    setHeadIcon:function (url) {
        this.headIconUrl = url;
        if (this.headIconUrl) {
            this.headIcon.setUrl(this.headIconUrl , cc.size(96,96));    
        }
        else
        {
            this.headIcon.setDefault();
        }
    },

    setIndex:function (index) {
        this.index = index;
        this.indexLabel.string = index;
    },

    setRewardNum:function (num) {
        this.rewardNum = num;
        this.rewardLabel.string = num;
    },
    /**
     * 领取奖励回调
     * 
     */
    onReceiveReward:function () {
        Global.Common.Audio.playEffect("btn2Click" , false);

        if (this.isRewarding) {
            return;
        }

        this.isRewarding = true;

        // 好友奖励领取
        Global.Common.Http.req("inviteAwardForAward" , {
            uuid:Global.Model.Game.uuid,
            id:Global.Model.Game.getFriend().id,
        } , function (resp , url) {
            console.log("Response " , url , resp);

            this.receiveReward(Global.Model.Game.getFriend().rewardNum);

            this.isRewarding = false;
            Global.Model.Game.initFriend(resp);

            var datas = Global.Model.Game.getFriend();
            this.refreshItem(datas);
        }.bind(this));
    },

    receiveReward:function (num) {
        Global.Model.Game.addRevive(num);
        var vMain = cc.Camera.main.node.parent.getComponentInChildren("VMain");
        vMain.refreshTopBar();
    },
    /**
     * 邀请好友回调
     * 
     */
    onInvitation:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        // 分享
        Global.Model.Game.share(WxAdapter , 1);
    },

    refreshItem:function (data) {
        var inviteAwardNum = 0;
        if (data.id != 0) {
            // 当前可领取
            this.setState(1);
            this.setHeadIcon(data.headicon);
            inviteAwardNum = data.rewardedCount+1;
        }
        else
        {
            // 不可领取
            this.setState(2);
            this.setHeadIcon(null);
            inviteAwardNum = data.rewardedCount;
        }
        this.setIndex(data.rewardedCount+1);
        this.setRewardNum(data.rewardNum);

        var domainIndex = this.getDomain(inviteAwardNum);
        var domainNextIndex = domainIndex + 1;
        if (domainNextIndex < DOMAIN.length) {
            var num = DOMAIN[domainNextIndex][0]+1 - inviteAwardNum;
            var rewardNum = REWARD[domainNextIndex];
            this.tips.string = "再邀请" + num + "名好友，每次邀 请成功的奖励会提高到<color=#FF3740> " + rewardNum + " </c>个复活药水";
        }
        else
        {
            this.tips.string = "每次邀请成功都会得到个" + REWARD[REWARD.length-1] + "复活药水";
        }
    },

    getDomain:function (inviteAwardNum) {
        var len = DOMAIN.length;
        for (let index = 0; index < len; index++) {
            const domain = DOMAIN[index];
            if (inviteAwardNum > domain[0] && inviteAwardNum <= domain[1]) {
                return index;
            }
        }
        return -1;
    },
    // update (dt) {},
});
