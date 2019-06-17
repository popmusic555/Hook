
var GlobalEnum = require("GlobalEnum");

cc.Class({
    extends: cc.Component,

    properties: {
        type:{
            default:GlobalEnum.REDDOT_TYPE.FRIEND,
            type:GlobalEnum.REDDOT_TYPE,
        },
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    refresh:function (type) {
        var curType = type || this.type;
        if (curType != this.type) {
            return;
        }
        switch (curType) {
            case GlobalEnum.REDDOT_TYPE.FRIEND:
                Global.Common.Http.req("inviteAwardForInfo" , {
                    uuid:Global.Model.Game.uuid,
                } , function (resp , url) {
                    console.log("Response " , url , resp);
                    Global.Model.Game.initFriend(resp);
                    
                    var rewards = Global.Model.Game.getFriendReward();
                    if (rewards.length > 0) {
                        // 有未领取奖励
                        this.node.active = true;
                    }
                    else
                    {
                        // 无未领取奖励
                        this.node.active = false;
                    }
                }.bind(this));
                break;
            case GlobalEnum.REDDOT_TYPE.LOTTERY:
                Global.Common.Http.req("lotteryRecored" , {
                    uuid:Global.Model.Game.uuid,
                    type:0,
                    video:0,
                } , function (resp , url) {
                    console.log("Response " , url , resp);

                    // 轮盘免费次数
                    Global.Model.Game.setFreeLottery(parseInt(resp[0]));
                    if (Global.Model.Game.freeLottery > 0) {
                        // 有免费次数
                        this.node.active = true;
                    }
                    else
                    {
                        // 无免费次数
                        this.node.active = false;
                    }
                }.bind(this));
                break;
        }  
    },
});
