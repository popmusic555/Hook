
cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        content:cc.Label,
    },

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    refresh:function () {
        this.title.string = "[游戏版本 " + Global.Common.Version.VERSION + "]";
        // this.contentName.string = name;
        // this.content.string = content;
    },

    show:function () {
        this.node.active = true;
        this.refresh();
    },

    hide:function () {
        this.node.active = false;  
    },

    onClose:function () {
        this.hide();  
    },
});
