

var WxAdapter = require("WxAdapter");
var RankView = require("VRank");
var GameInsideView = require("VGameInside");

cc.Class({
    extends: cc.Component,

    properties: {
        rankView:RankView,
        gameInsideView:GameInsideView,

        _KeyList:[],
		
		_NickName:null,
		_AvatarUrl:null,
        _OpenID:null,
		
        _Datas:null,
    },

    // onLoad () {},

    start () {
        WxAdapter.onOpenDataMsg(this.onMsg.bind(this));
        this._KeyList = ["mileage" , "combo" , "mileageTimes" , "comboTimes"];
    },

    // update (dt) {},

    onMsg:function (msg) {
        this.rankView.node.active = false;
        this.gameInsideView.node.active = false;

        var cmd = msg.cmd;
		if (cmd == "setUserInfo") {
			this._NickName = msg.nickName;
			this._AvatarUrl = msg.avatarUrl;
            this._OpenID = msg.openid;
            this.requestFriendData(function (datas) {
                this._Datas = datas;
                console.log("requestFriendData" , this._Datas);
            }.bind(this));
        }
        else if (cmd == "updateUser") 
        {
            this.updateUser(msg.mileage , msg.combo);
        }
        else
        {
            if (this._Datas) {
				this.showView(msg , this._Datas);
			}
			else
			{
				this.showViewAndRequestData(msg);
			}
        }
    },

    /**
     * 请求好友数据
     * 
     */
    requestFriendData:function (callback) {
        var datas = [];
        // callback(datas);
        // 创建
        var nickName = this._NickName;
        var avatarUrl = this._AvatarUrl;
        // 获取自身数据
        WxAdapter.getUserData(this._KeyList , function (userDataState , userData) {
            if (userDataState != "success") {
                return;
            }
            var newData = {};
            newData.nickname = nickName;                
            newData.avatarUrl = avatarUrl;
            for (var i = 0; i < this._KeyList.length; i++) {
                newData[this._KeyList[i]] = 0;
            }
            var len = userData.length;
            console.log("getUserData" , userData);
            for (let index = 0; index < len; index++) {
                var data = userData[index];
                newData[data.key] = parseInt(data.value);
            }
            newData.isMe = true;
            datas.push(newData);

            // 获取好友数据
            WxAdapter.getFriendData(this._KeyList , function (friendDataState , friendDatas) {
                if (friendDataState != "success") {
                    return;
                }
                console.log("getFriendData" , friendDatas);
                var friendDatasLen = friendDatas.length;
                for (let index = 0; index < friendDatasLen; index++) {
                    var friendData = friendDatas[index];
                    if (this._OpenID != friendData.openid) {
                        var newData = {};
                        newData.nickname = friendData.nickname;                
                        newData.avatarUrl = friendData.avatarUrl;
                        for (var i = 0; i < this._KeyList.length; i++) {
                            newData[this._KeyList[i]] = 0;
                        }
                        var len = friendData.KVDataList.length;
                        for (let i = 0; i < len; i++) {
                            var data = friendData.KVDataList[i];
                            newData[data.key] = parseInt(data.value);
                        }
                        newData.isMe = false;
                        datas.push(newData);
                    }
                }

                callback(datas);
            }.bind(this));
        }.bind(this));

    },

    showViewAndRequestData:function (msg) {
        this.requestFriendData(function (datas) {
            this._Datas = datas;
            this.showView(msg , this._Datas);
        }.bind(this));
    },

    showView:function (msg , datas) {
        if (msg.cmd == "rank") {
            this.rankView.node.active = true;
            this.showRank(datas);
        }
        else if (msg.cmd == "gameinside") {
            this.gameInsideView.node.active = true;
            this.showGameInside(datas , msg.mileage , msg.recvive);
        }
    },

    showRank:function (datas) {
        this.rankView.node.active = true;
        this.rankView.refresh(datas);
    },

    showGameInside:function (datas , mileage , recvive) {
        this.gameInsideView.node.active = true;
        this.gameInsideView.refresh(datas , mileage , recvive);
    },

    updateUser:function (mileage , combo) {
        if (this._Datas) 
        {
            var len = this._Datas.length;
            for (var i = 0; i < len; i++) {
                var data = this._Datas[i];
                if (data.isMe) 
                {
                    // 上传最大里程数据
                    if (mileage > data.mileage) 
                    {
                        WxAdapter.setUserData([
                            {key:"mileage" , value:mileage + ""},
                            {key:"mileageTimes" , value:new Date().getTime() + ""},
                        ] , function (state) {
                            if (state == "success") {
                                console.log("上传最大里程数据成功");
                                data.mileage = mileage;
                            }
                        }.bind(this));
                    }
                    // 上传最大连击数
                    if (combo > data.combo) 
                    {
                        WxAdapter.setUserData([
                            {key:"combo" , value:combo + ""},
                            {key:"comboTimes" , value:new Date().getTime() + ""},
                        ] , function (state) {
                            if (state == "success") {
                                console.log("上传最大连击数据成功");
                                data.combo = combo;
                            }
                        }.bind(this));
                        
                    }
                }
            }
        }
    },
});
