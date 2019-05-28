cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

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
            Global.Common.Audio.enabled(false);
        }
    },

    onNoticeBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        // 显示公告
        var noticeView = this.node.parent.getComponentInChildren("VNotice");
        noticeView.show();
    },

    onCloseBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();
    },

    hide:function () {
        this.node.active = false;  
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
    }
});
