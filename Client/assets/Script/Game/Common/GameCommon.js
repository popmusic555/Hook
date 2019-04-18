var GameConst = require("GameConst");
var DataManager = require("DataManager");

var GameCommon = {};

GameCommon.GAME_VIEW = null;
GameCommon.UI_VIEW = null;

GameCommon.SetUIView = function (uiview) {
    GameCommon.UI_VIEW = uiview;
}

GameCommon.GetUIView = function () {
    return GameCommon.UI_VIEW; //cc.find("Canvas/Main Camera/UI").getComponent(UIView);
};

// 是否在墙体范围内
GameCommon.isInWall = function (x) {
    return DataManager.Userdata.isInWall(x);
},

// 获取随机数
GameCommon.GET_RANDOM = function (min , max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = GameCommon;