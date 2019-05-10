
cc.Class({
    extends: cc.Component,

    properties: {
        levelContentIcon:[cc.SpriteFrame],
        iconSprite:cc.Sprite,
        _Type:0,
        type:{
            get(){
                return this._Type || 0;
            },

            set(value){
                this._Type = value;
                this.resetLevelContentIcon(this._Type);
            }
        },
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    resetLevelContentIcon:function (type) {
        this.iconSprite.spriteFrame = this.levelContentIcon[type];
    },
});
