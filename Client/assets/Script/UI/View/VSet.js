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
        }
        else
        {
            console.log("关闭音乐");
        }
    },

    onNoticeBtn:function () {
        // 显示公告
        var noticeView = this.node.parent.getComponentInChildren("VNotice");
        noticeView.show();
    },

    onCloseBtn:function () {
        this.hide();
    },

    hide:function () {
        this.node.active = false;  
    },

    show:function () {
        this.node.active = true;
    }
});
