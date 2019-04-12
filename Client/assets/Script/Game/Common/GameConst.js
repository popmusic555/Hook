
var GameEnum = require("GameEnum");

var GameConst = {};

// 重力系数
GameConst.GRAVITY_SCALE = 8;
// 每隔几次刷新点生成墙体
GameConst.CREATE_WALL = 10;
// 墙体宽度
GameConst.WALL_WIDTH = 2300;

GameConst.GAME_VIEW = null;

// 是否在墙体范围内
GameConst.IS_IN_WALL = function (x) {
    var bGenerator = GameConst.GAME_VIEW.buildGenerator;

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
GameConst.GET_RANDOM = function (min , max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = GameConst;