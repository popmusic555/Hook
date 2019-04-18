
var GameMap = require("GameMap");

cc.Class({
    extends: GameMap,

    properties: {
        // 可替换的背景
        bgSprite:[cc.SpriteFrame],

        // 地图背景1
        bg1:cc.Sprite,
        // 地图背景2
        bg2:cc.Sprite,
        // 地图背景3
        bg3:cc.Sprite,
    },

    // onLoad () {},

    start () {
        this._super();
    },

    // update (dt) {},

    // 生成新地图
    createNewMap:function (mapIndex) {
        // 地图背景1 替换成地图背景2
        // 地图背景2 随机生成新背景
        this.bg1.spriteFrame = this.bg2.spriteFrame;
        this.bg2.spriteFrame = this.bg3.spriteFrame;
        this.bg3.spriteFrame = this.bgSprite[this.getRandomNum(this.bgSprite.length)];
    },

    getRandomNum:function (num) {
        return Math.floor(Math.random() * num * 10) % num;
    },
});
