
cc.Class({
    extends: cc.Component,

    properties: {
        // 钱袋图标
        purseIcon:cc.SpriteFrame,
        // 钱币图标
        iconRes:[cc.SpriteFrame],
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

    show:function () {
        // 金币收取动画显示
        var node = new cc.Node();            
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.purseIcon;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        node.width = sprite.spriteFrame.getRect().width;
        node.height = sprite.spriteFrame.getRect().height;
        node.scale = 0.75;

        var player = Global.Model.MPlayer.getPlayerObj();
        var pos = player.node.convertToWorldSpaceAR(cc.v2(0,0));
        pos = this.node.convertToNodeSpaceAR(pos);

        node.position = pos;

        this.node.addChild(node);

        var action1 = cc.moveTo(0.6 , cc.v2(0,0)).easing(cc.easeCubicActionOut());
        var action2 = cc.repeat(cc.sequence(cc.rotateBy(0.05 , 10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , 10)) , 2);
        var action3 = cc.removeSelf(true);
        node.runAction(cc.sequence(action1 , action2 , cc.delayTime(0.2) , cc.callFunc(function () {
            Global.Common.Audio.playEffect("mCoins" , false);
            var len = 15;
            for (let index = 0; index < len; index++) {
                var iconNode = new cc.Node();            
                var sprite = iconNode.addComponent(cc.Sprite);
                sprite.spriteFrame = this.iconRes[Global.Common.Utils.random(0 , 2)];
                sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                iconNode.width = 20;
                iconNode.height = 20;
                iconNode.x = node.x;
                iconNode.y = node.y;
                this.node.addChild(iconNode);

                var angle = Global.Common.Utils.random(0 , 360);
                var length = Global.Common.Utils.random(50 , 100);
                var v2 = cc.Vec2.RIGHT.normalize().rotate(angle * Math.PI / 180).mul(length);

                var action1 = cc.moveBy(0.2 , v2).easing(cc.easeCubicActionOut());
                iconNode.runAction(cc.sequence(action1 , cc.callFunc(function () {
                    var playerNode = Global.Model.MPlayer.getPlayerObj().node;
                    var pos = this.convertToWorldSpaceAR(cc.v2(0,0));
                    pos = playerNode.convertToNodeSpaceAR(pos);
                    this.parent = playerNode;
                    this.position = pos;
                    this.runAction(cc.sequence(cc.moveTo(0.3 , cc.v2(0,0)).easing(cc.easeCubicActionIn()) , cc.removeSelf(true)));
                } , iconNode)));
            }
        } , this) , action3));
    },
});
