
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab,
        content:cc.Node,

        _Datas:null,
    },

    onLoad () {
    },

    start () {
    },

    // update (dt) {},

    onCloseBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();
        var vMain = this.node.parent.getComponentInChildren("VMain");
        vMain.showRedDot();
    },

    hide:function () {
        this.node.active = false;  
    },

    show:function () {
        // 邀请好友信息
        Global.Common.Http.req("inviteAwardForInfo" , {
            uuid:Global.Model.Game.uuid,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            Global.Model.Game.initFriend(resp);

            this.node.active = true;
            this._Datas = Global.Model.Game.getFriend();
            
            this.refreshItem(this.content , this._Datas);
        }.bind(this));
    },

    refreshItem:function (item , datas) {
        var friendItem = item.getComponent("FriendItem");
        friendItem.refreshItem(datas);
    },
});
