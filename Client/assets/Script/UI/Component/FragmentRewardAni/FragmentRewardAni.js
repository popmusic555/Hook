
cc.Class({
    extends: cc.Component,

    properties: {
        // 碎片图标
        fragmentIcon:[cc.SpriteFrame],
    },

    // onLoad () {},

    start () {

    },

    onBtn:function () {
        this.show();
    },

    show:function (index) {
        // 金币收取动画显示
        var node = new cc.Node();            
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.fragmentIcon[index];
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        node.width = sprite.spriteFrame.getRect().width;
        node.height = sprite.spriteFrame.getRect().height;
        node.scale = 0.65;

        var player = Global.Model.MPlayer.getPlayerObj();
        var pos = player.node.convertToWorldSpaceAR(cc.v2(0,0));
        pos = this.node.convertToNodeSpaceAR(pos);

        node.position = pos;

        this.node.addChild(node);

        var action1 = cc.moveTo(0.6 , cc.v2(0,0)).easing(cc.easeCubicActionOut());
        var action2 = cc.repeat(cc.sequence(cc.rotateBy(0.05 , 10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , 10)) , 2);
        var action3 = cc.fadeOut(0.2);
        var action4 = cc.removeSelf(true);
        node.runAction(cc.sequence(action1 , action2 , action3 , action4));
    },

    // update (dt) {},
});
