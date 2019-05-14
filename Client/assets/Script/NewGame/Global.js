
var Global = {};
window.Global = Global;

// 数据模型
Global.Model = {};
// 公用
Global.Common = {};
// 游戏对象
Global.GameObj = {};

// 全局常量
Global.Common.Const = require("GlobalConst");
// 全局枚举
Global.Common.Enum = require("GlobalEnum");
// 工具类
Global.Common.Utils = require("Utils");

// 用户数据模型
Global.Model.MPlayer = require("MD_Player");
// 地板数据模型
Global.Model.MFloor = require("MD_Floor");
// 墙体数据模型
Global.Model.MWall = require("MD_Wall");
// 普通怪物数据模型
Global.Model.MNormal = require("MD_Normal");

// 基类对象
Global.GameObj.GBase = require("GO_Base");
Global.GameObj.GPlayer = require("GO_Player");


Global.Model.MPlayer.init();
Global.Model.MFloor.init();
Global.Model.MWall.init();
Global.Model.MNormal.init();

console.log("Global is Loaded");

module.exports = Global;

