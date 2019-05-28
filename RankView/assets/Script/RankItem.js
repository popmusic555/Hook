cc.Class({
    extends: cc.Component,

    properties: {
        rankIconRes:[cc.SpriteFrame],

        rankIcon:cc.Sprite,
        headIcon:cc.Sprite,
        nameLabel:cc.Label,
        contentLabel:cc.Label,

        _Data:null,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    refresh:function () {
        console.log("RankItem Refresh");
        var rankNum = this._Data.rankNum;
        var rankIconRes = null;
        if (rankNum < this.rankIconRes.length) {
            rankIconRes = this.rankIconRes[rankNum];
        }
        this.rankIcon.spriteFrame = rankIconRes;
        this.nameLabel.string = this._Data.name;
        this.contentLabel.string = this._Data.content;
    },

    refreshByData:function (data) {
        this._Data = data;
        this.refresh();
    },
});
