
var GameMap = require("GameMap");
var GameCommon = require("GameCommon");

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

        _MaxMapNum:0,
        _MaxMapBgNum:0,
        _CurIndex:0,
    },

    // onLoad () {},

    start () {
        this._super();
        this._MaxMapBgNum = 3;
        this._MaxMapNum = this.bgSprite.length / this._MaxMapBgNum;
        this._CurIndex = 0;
    },

    // update (dt) {},

    // 生成新地图
    createNewMap:function (mapIndex) {
        // 地图背景1 替换成地图背景2
        // 地图背景2 随机生成新背景
        this.bg1.spriteFrame = this.bg2.spriteFrame;
        this.bg2.spriteFrame = this.bg3.spriteFrame;
        this.bg3.spriteFrame = this.bgSprite[this.getRandomNum()];
    },

    getRandomNum:function () {
        // return Math.floor(Math.random() * num * 10) % num;
        return GameCommon.GET_RANDOM(this._CurIndex , this._CurIndex + this._MaxMapBgNum-1);
    },

    refreshMapByPassID:function (passId) {
        this._CurIndex = passId % this._MaxMapNum * this._MaxMapBgNum;

        this.bg1.spriteFrame = this.bgSprite[this.getRandomNum()];
        this.bg2.spriteFrame = this.bgSprite[this.getRandomNum()];
        this.bg3.spriteFrame = this.bgSprite[this.getRandomNum()];
    },
});
