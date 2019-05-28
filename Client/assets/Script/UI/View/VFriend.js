cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab,
        content:cc.Node,

        _Datas:null,

        // 奖励数据
        _RewardData:null,
    },

    onLoad () {
        this._RewardData = [1,1,1,1,3,2,2,2,2,2,2,2,2,2,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8];
    },

    start () {
        var len = this._RewardData.length;
        for (let index = 0; index < len; index++) {
            var item = cc.instantiate(this.itemPrefab);
            this.content.addChild(item);
            this.refreshItem(item , this._Datas , index);
        }
    },

    // update (dt) {},

    onCloseBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.hide();
    },

    hide:function () {
        this.node.active = false;  
    },

    show:function (datas) {
        this.node.active = true;
        this._Datas = datas;
        
        var len = this.content.childrenCount;
        for (let index = 0; index < len; index++) {
            var item = this.content.children[index];
            this.refreshItem(item , this._Datas , index);
        }
    },

    refreshItem:function (item , datas , index) {
        var friendItem = item.getComponent("FriendItem");
        if (index < datas.length) {
            var data = datas[index];
            if (data.isReward) {
                // 已领取状态
                friendItem.setState(0);
                friendItem.setHeadIcon("");
            }
            else
            {
                // 领取状态
                friendItem.setState(1);
                friendItem.setHeadIcon("");
            }
        }
        else if (index == datas.length)
        {
            // 去邀请状态
            friendItem.setState(2);
        }
        else
        {
            // 未邀请状态
            friendItem.setState(3);
        }
        friendItem.setIndex(index + 1);
        friendItem.setRewardNum(this._RewardData[index]);
    },
});
