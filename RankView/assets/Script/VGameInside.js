
cc.Class({
    extends: cc.Component,

    properties: {
        leftView:cc.Node,
        rightView:cc.Node,
        // 即将超越图标
        transcendIcon:cc.Sprite,
        // 霸榜图标
        fristIcon:cc.Sprite,
        _Datas:null,
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    /**
     * 刷新
     *
     */
    refresh:function (datas , mileage , recvive) {
        this._Datas = datas;
        this.sortByMileage(this._Datas);
        var transcend = this.getTranscend(datas , mileage);
        if (transcend) 
        {
            // 获取到即将超越的用户
            this.transcendIcon.node.active = true;
            this.fristIcon.node.active = false;
        }
        else
        {  
            // 未获取到即将超越的用户 当前用户第一
            this.transcendIcon.node.active = false;
            this.fristIcon.node.active = true;
        }

        if (recvive) 
        {
            this.leftView.x = -130;
            this.rightView.active = true;
        }
        else
        {
            this.leftView.x = 0;
            this.rightView.active = false;
        }

    },

    getTranscend:function (datas , mileage) {
        var len = datas.length;
        for (var i = 0; i < len; i++) {
            var data = datas[i];
            if (!data.isMe && data.mileage > mileage) 
            {
                return data;
            }
        }
        return null;
    },

    sortByMileage:function (datas) {
        // 根据mileage排序
        this._Datas = this.sortByField(datas , "mileage");
    },

    sortByField:function (datas , field) {
        datas.sort(function (a , b) {
            var aValue = a[field];
            var bValue = b[field];
            if (aValue > bValue) {
                return 1;
            }
            else if (aValue == bValue) {
                return 0;
            }
            else if (aValue < bValue) {
                return -1;
            }
        });
        return datas;
    },
});
