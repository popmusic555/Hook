var RemoteSprite = require("RemoteSprite");
var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
        indexLabel:cc.Label,
        headIcon:RemoteSprite,
        rewardLabel:cc.Label,
        stateBtn:[cc.Node],

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
        this.indexLabel.string = index + 1;
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
            id:Global.Model.Game.getFriend()[this.index].id,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            this.isRewarding = false;
            this.setState(0);
            Global.Model.Game.getFriend()[this.index].isReward = true;
            this.receiveReward(parseInt(resp[0]));
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
        Global.Model.Game.share(WxAdapter);
    },

    // update (dt) {},
});
