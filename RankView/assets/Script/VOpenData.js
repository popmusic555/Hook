
var RankView = require("VRank");
var GameInsideView = require("VGameInside");

cc.Class({
    extends: cc.Component,

    properties: {
        rankView:RankView,
        gameInsideView:GameInsideView,
    },

    // onLoad () {},

    start () {
        WxAdapter.onOpenDataMsg(this.onMsg.bind(this));
    },

    // update (dt) {},

    onMsg:function (msg) {
        this.rankView.node.active = false;
        this.gameInsideView.node.active = false;
        
        this.requestFriendData(function (datas) {
            var cmd = msg.cmd;
            if (cmd == "rank") {
                this.showRank(datas);
            }
            else if (cmd == "gameinside") {
                this.showGameInside(datas);
            }
        }.bind(this));
    },

    /**
     * 请求好友数据
     * 
     */
    requestFriendData:function (callback) {
        var datas = null;
        callback(datas);
    },

    showRank:function (datas) {
        this.rankView.node.active = true;
        this.rankView.refresh(datas);
    },

    showGameInside:function (datas) {
        this.gameInsideView.node.active = true;
        this.gameInsideView.refresh(datas);
    },

    /**
     * 获取数据
     *
     * @param {*} callback
     * @param {*} flag
     */
    getData:function (callback) {
        // var datas = [
        //     {rankNum:0 , name:"大哥你好0" + flag , content:"1008600"},
        //     {rankNum:1 , name:"大哥你好1" , content:"1008601"},
        //     {rankNum:2 , name:"大哥你好2" , content:"1008602"},
        //     {rankNum:3 , name:"大哥你好3" , content:"1008603"},
        //     {rankNum:4 , name:"大哥你好4" , content:"1008604"},
        //     {rankNum:5 , name:"大哥你好5" , content:"1008605"},
        //     {rankNum:6 , name:"大哥你好6" , content:"1008606"},
        // ];
        callback(datas);
    },
});
