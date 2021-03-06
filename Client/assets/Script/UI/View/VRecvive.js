
var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
        recviveTimesLabel:cc.Label,
        recviveNumLabel:cc.Label,
        recvive:cc.Node,

        _Times:0,

        _TimeCallback:null,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    show:function () {
        this.node.active = true;

        var times = Global.Common.Const.RECVIVE_TIMES;

        // 设置复活次数
        var recviveNum = Global.Model.Game.revive;
        this.recviveNumLabel.string = recviveNum;
        var isRecvive = false;
        if (recviveNum <= 0 || !Global.Model.MPlayer.getRecviveVelocity()) {
            this.recvive.active = false;
            isRecvive = false;
            times = 1;
        }
        else
        {
            this.recvive.active = true;
            isRecvive = true;
        }

        WxAdapter.postMsgToOpenData({
            cmd:"gameinside",
            mileage:Global.Model.MPlayer.getMileage(),
            recvive:isRecvive,
        });

        this.unschedule(this._TimeCallback);
        this._TimeCallback = this.onTimes.bind(this);
        this._Times = times;
        this.showTimes(this._Times);
        this.schedule(this._TimeCallback, 1 , times-1);

        this.scheduleOnce(function () {
            this.hide();
            Global.Model.Game.showSettlementView();
        }.bind(this) , times);
    },

    hide:function () {
        this.node.active = false;
    },

    onRecvive:function () {
        this.hide();
        // 复活
        console.log("复活");

        Global.Common.Http.req("setRestartNum" ,{
            uuid:Global.Model.Game.uuid,
        } , function (resp , url) {
            var result = parseInt(resp[0]);
            if (result != 0) {
                return;
            }
            Global.Model.Game.setRevive(parseInt(resp[1]));
            var velocity = Global.Model.MPlayer.getRecviveVelocity();
            if (!velocity) {
                return;
            }
            Global.Model.MPlayer.setRecviveVelocity(null);
            var player = Global.Model.MPlayer.getPlayerObj();
            player.recvive(velocity);
        }.bind(this));
    },

    showTimes:function (times) {
        console.log("Times" , times);
        this.recviveTimesLabel.string = "使用 " + times + " 秒";
    },

    onTimes:function () {
        this._Times--;
        this.showTimes(this._Times);
    },
});
