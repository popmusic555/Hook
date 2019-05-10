var GameConst = require("GameConst");
var DataManager = require("DataManager");

var GameCommon = {};

GameCommon.GAME_VIEW = null;
GameCommon.UI_VIEW = null;
GameCommon.MAP_MANAGER = null;
GameCommon.CLIP_GENERATOR = null;

GameCommon.SetUIView = function (uiview) {
    GameCommon.UI_VIEW = uiview;
}

GameCommon.GetUIView = function () {
    return GameCommon.UI_VIEW; //cc.find("Canvas/Main Camera/UI").getComponent(UIView);
};

GameCommon.GetMapManager = function () {
    // if (!GameCommon.MAP_MANAGER) {
        GameCommon.MAP_MANAGER = cc.find("Canvas/GameView/MapManager").getComponent("MapManager");
    // }
    return GameCommon.MAP_MANAGER;
};

GameCommon.GetClipGenerator = function () {
    // if (!GameCommon.CLIP_GENERATOR) {
        GameCommon.CLIP_GENERATOR = cc.find("Canvas/GameView/Monsters/MClipList").getComponent("MonsterGenerator");
    // }
    return GameCommon.CLIP_GENERATOR;
};

// 是否在墙体范围内
GameCommon.isInWall = function (x) {
    return DataManager.Userdata.isInWall(x);
},
// 是否在墙体左侧范围内
GameCommon.isLeftWall = function (x) {
    return DataManager.Userdata.isLeftWall(x);
},
// 是否在墙体右侧范围内
GameCommon.isRightWall = function (x) {
    return DataManager.Userdata.isRightWall(x);
},

// 获取随机数
GameCommon.GET_RANDOM = function (min , max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = GameCommon;