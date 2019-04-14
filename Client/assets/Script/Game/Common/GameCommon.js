var GameConst = require("GameConst");

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
GameCommon.IS_IN_WALL = function (x) {
    var bGenerator = GameCommon.GAME_VIEW.buildGenerator;

    if (bGenerator.wallCreatePosX <= 0) {
        return false;
    }

    var leftPosX = bGenerator.wallCreatePosX - 100;
    var rightPosX = bGenerator.wallCreatePosX + GameConst.WALL_WIDTH;

    if (x >= leftPosX && x <= rightPosX) {
        return true;        
    }

    return false;
},

// 获取随机数
GameCommon.GET_RANDOM = function (min , max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = GameCommon;