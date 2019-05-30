

var WxAdapter = {};

WxAdapter.isWeChat = function () {
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME || cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
        return true;        
    }
    else
    {
        return false;
    }
}

/**
 * 微信登陆
 *
 * @param {*} timeout
 * @param {*} callback
 * @returns
 */
WxAdapter.login = function (timeout , callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }
    wx.login({
        timeout:timeout,
        success:function (res) {
            callback("success" , res.code);
        },
        fail:function () {
            callback("fail" , res.errMsg);
        },
        complete:function () {
            callback("complete");
        },
    });
}

WxAdapter.getUserInfo = function (callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    wx.getUserInfo({
        withCredentials:false,
        lang:"zh_CN",
        success:function (res) {
            // var userInfo = res.userInfo
            // var nickName = userInfo.nickName
            // var avatarUrl = userInfo.avatarUrl
            // var gender = userInfo.gender //性别 0：未知、1：男、2：女
            // var province = userInfo.province
            // var city = userInfo.city
            // var country = userInfo.country
            callback(res.userInfo);
        },
        fail:function () {
            callback("fail");
        },
        complete:function () {
            callback("complete");
        },
    });
}

/**
 * 获取自身数据
 *
 * @param {*} keylist
 * @param {*} callback
 * @returns
 */
WxAdapter.getUserData = function (keylist , callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }
    wx.getUserCloudStorage({
        keyList:keyList,
        success:function (userData) {
            callback("success" , userData);
        },
        fail:function () {
            callback("fail");
        },
        complete:function () {
            callback("complete");
        },
    });
}

/**
 * 获取好友数据
 *
 * @param {*} keyList 字段列表
 * @param {*} callback 回调
 * @returns
 */
WxAdapter.getFriendData = function (keyList , callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    wx.getFriendCloudStorage({
        keyList:keyList,
        success:function (userData) {
            callback("success" , userData);
        },
        fail:function () {
            callback("fail");
        },
        complete:function () {
            callback("complete");
        },
    });
}

/**
 * 获取群数据
 *
 * @param {*} shareTicket 群标示
 * @param {*} keyList 字段列表
 * @param {*} callback 回调
 * @returns
 */
WxAdapter.getGroupData = function (shareTicket , keyList , callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    wx.getFriendCloudStorage({
        keyList:["mileage" , "doubleHit"],
        success:function (userData) {
            callback("success" , userData);
        },
        fail:function () {
            callback("fail");
        },
        complete:function () {
            callback("complete");
        },
    });
}

/**
 * 托管游戏数据
 *
 * @param {*} datas [{key , value}]
 * @param {*} callback 回调
 * @returns
 */
WxAdapter.setUserData = function (datas , callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    wx.setUserCloudStorage({
        KVDataList:datas,
        success:function () {
            callback("success");
        },
        fail:function () {
            callback("fail");
        },
        complete:function () {
            callback("complete");
        },
    })
}

/**
 * 向开放数据域发送数据
 *
 * @param {*} data
 * @returns
 */
WxAdapter.postMsgToOpenData = function (data) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    var openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage(data);
}

/**
 * 开放数据域接收数据
 *
 * @param {*} callback
 * @returns
 */
WxAdapter.onOpenDataMsg = function (callback) {
    if (!WxAdapter.isWeChat()) {
        return;
    }

    wx.onMessage(function (data) {
        callback(data);
    });
}

module.exports = WxAdapter;