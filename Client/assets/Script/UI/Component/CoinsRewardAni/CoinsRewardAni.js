
// 金币收取动画

cc.Class({
    extends: cc.Component,

    properties: {
        // 金币图标
        coinsIcon:[cc.SpriteFrame],
    },

    // onLoad () {},

    start () {
        // this.show(5);
    },

    show:function (num , coinsRes) {
        // 金币收取动画显示
        var len = num;
        for (let index = 0; index < len; index++) {
            var node = new cc.Node();            
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = coinsRes;
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            node.width = 20;
            node.height = 20;
            this.node.addChild(node);

            var angle = Global.Common.Utils.random(0 , 360);
            var length = Global.Common.Utils.random(100 , 200);
            var v2 = cc.Vec2.RIGHT.normalize().rotate(angle * Math.PI / 180).mul(length);

            var action1 = cc.moveBy(0.2 , v2).easing(cc.easeCubicActionOut());
            var action2 = cc.moveBy(0.3 , v2.neg()).easing(cc.easeCubicActionIn());
            node.runAction(cc.sequence(action1 , action2 , cc.removeSelf(true)));
        }
    },

    onBtn:function () {
        this.showWithCoinsNum(260);
    },

    showWithCoinsNum:function (num) {
        // 金币数量
        var coins1 = Math.floor(num / 125);
        this.show(coins1 , this.coinsIcon[0]);
        // 银币数量
        var coins2 = Math.floor(num % 125 / 25);
        this.show(coins2 , this.coinsIcon[1]);
        // 铜币数量
        var coins3 = Math.floor(num % 25 / 5);
        this.show(coins3 , this.coinsIcon[2]);
    },

    // update (dt) {},
});
