
var RemoteSprite = require("RemoteSprite");

cc.Class({
    extends: cc.Component,

    properties: {
        rankIconRes:[cc.SpriteFrame],

        rankIcon:cc.Sprite,
        headIcon:RemoteSprite,
        nameLabel:cc.Label,
        contentLabel:cc.Label,
        

        _Data:null,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    refresh:function (content) {
        var rankNum = this._Data.rankNum;
        var rankIconRes = null;
        if (rankNum < this.rankIconRes.length) {
            rankIconRes = this.rankIconRes[rankNum];
        }
        this.rankIcon.spriteFrame = rankIconRes;
        this.nameLabel.string = this._Data.nickname;
        this.headIcon.setUrl(this._Data.avatarUrl , cc.size(96,96));
        if (content || content == 0) {
            this.contentLabel.string = content;    
        }
    },

    refreshByData:function (data , content) {
        this._Data = data;
        this.refresh(content);
    },
});
