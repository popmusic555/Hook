cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onMusicBtn:function () {
        
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
