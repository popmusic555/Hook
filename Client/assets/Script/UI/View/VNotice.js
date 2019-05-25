
cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        contentName:cc.Label,
        content:cc.Label,
    },

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    refresh:function (title , name , content) {
        // this.title.string = title;
        // this.contentName.string = name;
        // this.content.string = content;
    },

    show:function (title , name , content) {
        this.node.active = true;
        this.refresh(title , name , content);
    },

    hide:function () {
        this.node.active = false;  
    },

    onClose:function () {
        this.hide();  
    },
});
