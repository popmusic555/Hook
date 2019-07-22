
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
                    if (rewards) {
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

                    // 付费轮盘次数
                    var num = parseInt(resp[5]) ? 0 : 1;
                    Global.Model.Game.setPayLottery(num);
                    // 轮盘免费次数
                    num = parseInt(resp[6]) ? 0 : 1;
                    Global.Model.Game.setFreeLottery(num);
                    
                    if (Global.Model.Game.freeLottery > 0 || Global.Model.Game.payLottery > 0) {
                        // 有次数
                        this.node.active = true;
                        // this.node.active = false;
                    }
                    else
                    {
                        // 无次数
                        this.node.active = false;
                    }
                }.bind(this));
                break;
        }  
    },
});
