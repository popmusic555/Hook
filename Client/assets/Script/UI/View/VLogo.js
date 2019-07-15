
var WxAdapter = require("WxAdapter");

var END_WITH = [
    ".",
    "..",
    "...",
    "....",
    ".....",
    "......",
];

cc.Class({
    extends: cc.Component,

    properties: {

        updateTips:cc.Node,
        

        _IsUpdate:false,
        _Num:0,
    },

    // onLoad () {},

    start () {
        this.node.opacity = 0;

        this.updateTips.active = false;
        this.updateTipsLabel = this.updateTips.getComponentInChildren(cc.Label);

        WxAdapter.checkVersion(function (isUpdate) {
            if (isUpdate) {
                // 当前需要更新    
                this.onUpdate();
            }
            else
            {
                // 当前不需要更新
                this.enterGame();
            }
        }.bind(this));

    },

    onUpdate:function () {
        WxAdapter.onUpdateSuccess(this.onUpdateSuccess.bind(this));
        WxAdapter.onUpdateFailed(this.onUpdateFailed.bind(this));

        var action = cc.sequence(cc.fadeIn(1.5) , cc.callFunc(function () {
            this._IsUpdate = true;
            this.updateTips.active = this._IsUpdate;

            var delayStringAction = cc.sequence(cc.delayTime(0.3) , cc.callFunc(function () {
                this._Num++;
                this.updateTipsLabel.string = "发现新版本，请稍后" + END_WITH[this._Num % 6];
            } , this));
            this.node.runAction(cc.repeatForever(delayStringAction));

        } , this));
        this.node.runAction(action);  
    },

    onUpdateSuccess:function () {
        WxAdapter.applyUpdate();
    },

    onUpdateFailed:function () {
        WxAdapter.showDialog("意外事件" , "当前信号不好，与异星失联，请退出重试！" , function (res) {
            WxAdapter.exitProgram({
                success:function () {
                },
                fail:function () {
                },
                complete:function () {
                },
            });
        }.bind(this) , false);
    },

    enterGame:function () {
        cc.director.preloadScene("LoadingScene");

        var action = cc.sequence(cc.fadeIn(1.5) , cc.callFunc(function () {
            cc.loader.loadRes("Font/MFLiHei" , cc.Font , function (err, font) {
                console.log("" , err , font);
                this.node.runAction(cc.sequence(cc.delayTime(1.0) , cc.fadeOut(1.5) ,cc.callFunc(function () {
                    console.log("Run Next Scene");
                    cc.director.loadScene("LoadingScene");
                })));
            }.bind(this));
        } , this));

        this.node.runAction(action);
    },

    // update (dt) {},
});
