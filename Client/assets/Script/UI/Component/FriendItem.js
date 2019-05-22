
cc.Class({
    extends: cc.Component,

    properties: {
        indexLabel:cc.Label,
        headIcon:cc.Sprite,
        rewardLabel:cc.Label,
        stateBtn:[cc.Node],

        // 头像Url
        headIconUrl:"",
        index:0,
        // 奖励数量
        rewardNum:0,
        // 状态
        state:0,
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
        this.setState(0);
    },
    /**
     * 邀请好友回调
     * 
     */
    onInvitation:function () {
        
    },

    // update (dt) {},
});
