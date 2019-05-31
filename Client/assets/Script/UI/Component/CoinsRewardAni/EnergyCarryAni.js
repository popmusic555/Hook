
cc.Class({
    extends: cc.Component,

    properties: {
        // 钱袋图标
        coinsIcon:cc.SpriteFrame,
        // 消失点
        endNode:cc.Node,
    },

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    onBtn:function () {
        this.show();
    },

    show:function (callback) {
        // 金币收取动画显示
        var node = new cc.Node();            
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.coinsIcon;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        node.width = sprite.spriteFrame.getRect().width;
        node.height = sprite.spriteFrame.getRect().height;
        node.scale = 1.5;
        

        var player = Global.Model.MPlayer.getPlayerObj();
        var pos = player.node.convertToWorldSpaceAR(cc.v2(0,0));
        pos = this.node.convertToNodeSpaceAR(pos);

        node.position = pos;

        this.node.addChild(node);

        var angle = Global.Common.Utils.random(0 , 360);
        var length = Global.Common.Utils.random(100 , 200);
        var v2 = cc.Vec2.RIGHT.normalize().rotate(angle * Math.PI / 180).mul(length);


        var endPos = this.endNode.convertToWorldSpaceAR(cc.v2(0,0));
        endPos = this.node.convertToNodeSpaceAR(endPos);

        var action1 = cc.moveTo(0.8 , cc.v2(0,0)).easing(cc.easeCubicActionOut());
        var action2 = cc.moveTo(0.3 , endPos).easing(cc.easeCubicActionIn());
        var rotateAction = cc.rotateBy(0.8 , 360);
        node.runAction(cc.sequence(cc.spawn(action1 , rotateAction) , cc.delayTime(0.5) , action2 , cc.callFunc(function () {
            if (callback) {
                callback();    
            }
        }) , cc.removeSelf(true)));
    },
});
