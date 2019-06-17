
cc.Class({
    extends: cc.Component,

    properties: {
        leftTop:sp.Skeleton,
        RightTop:sp.Skeleton,
        leftBottom:sp.Skeleton,
        rightBottom:sp.Skeleton,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    show:function (times) {
        this.leftTop.node.active = true;
        this.RightTop.node.active = true;
        this.leftBottom.node.active = true;
        this.rightBottom.node.active = true;
        this.leftTop.animation = "red";
        this.RightTop.animation = "red";
        this.leftBottom.animation = "red";
        this.rightBottom.animation = "red";
        // this.leftTop.setCompleteListener(function () {
        //     this.leftTop.animation = "red";
        //     this.leftTop.setCompleteListener(null);
        //     this.RightTop.animation = "red";
        //     this.leftBottom.animation = "red";
        //     this.rightBottom.animation = "red";
        // }.bind(this));
    },  
});
