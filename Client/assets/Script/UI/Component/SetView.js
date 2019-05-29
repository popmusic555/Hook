
cc.Class({
    extends: cc.Component,

    properties: {
        _ResumeNode:null,
    },

    // onLoad () {},

    start () {
    },

    setResumeNode:function (nodes) {
        this._ResumeNode = nodes;
    },

    // update (dt) {},

    onCloseBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();
    },

    onBackBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("MainScene");
        }
    },

    onMusicBtn:function (target) {
        if (target.isChecked) {
            console.log("打开音乐");
            Global.Model.Game.musicOff = false;
            cc.sys.localStorage.setItem("musicOff" , Global.Model.Game.musicOff);
            Global.Common.Audio.enabled(!Global.Model.Game.musicOff);
            Global.Common.Audio.playEffect("btn1Click" , false);
        }
        else
        {
            console.log("关闭音乐");
            Global.Model.Game.musicOff = true;
            cc.sys.localStorage.setItem("musicOff" , Global.Model.Game.musicOff);
            Global.Common.Audio.enabled(!Global.Model.Game.musicOff);
        }
    },

    show:function () {
        this.node.active = true;
        var toggle = this.getComponentInChildren(cc.Toggle);
        if (Global.Model.Game.musicOff) {    
            toggle.isChecked = false;
        }
        else
        {
            toggle.isChecked = true;
        }
        Global.Model.Game.pauseGame();
    },

    hide:function () {
        this.node.active = false;
        Global.Model.Game.resumeGame();
    },
});
