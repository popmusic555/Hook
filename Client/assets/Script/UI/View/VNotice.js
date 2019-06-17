
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
        // this.title.string = title;
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
