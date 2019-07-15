
var Global = {};
window.Global = Global;

// 数据模型
Global.Model = {};
// 公用
Global.Common = {};
// 游戏对象
Global.GameObj = {};

// 版本文件
Global.Common.Version = require("Version");
// 全局常量
Global.Common.Const = require("GlobalConst");
// 全局枚举
Global.Common.Enum = require("GlobalEnum");
// 工具类
Global.Common.Utils = require("Utils");
// 时间
Global.Common.Timer = require("Timer");
Global.Common.Timer.init();
// 音频
Global.Common.Audio = require("AudioPlayer");
Global.Common.Audio.init();
Global.Common.Http = require("HttpClient");

// 游戏数据模型
Global.Model.Game = require("MD_Game");
// 用户数据模型
Global.Model.MPlayer = require("MD_Player");
// 地板数据模型
Global.Model.MFloor = require("MD_Floor");
// 墙体数据模型
Global.Model.MWall = require("MD_Wall");
// 普通怪物数据模型
Global.Model.MNormal = require("MD_Normal");
Global.Model.MClip = require("MD_Clip");
Global.Model.MFly = require("MD_Fly");
Global.Model.MCoins = require("MD_Coins");
Global.Model.MFlyCoins = require("MD_FlyCoins");
Global.Model.MBoom = require("MD_Boom");
Global.Model.MFlyBoom = require("MD_FlyBoom");
Global.Model.MEnergy = require("MD_Energy");
Global.Model.MRocket = require("MD_Rocket");
Global.Model.MJump = require("MD_Jump");
Global.Model.MPlane = require("MD_Plane");
Global.Model.MCar = require("MD_Car");



// 基类对象
Global.GameObj.GBase = require("GO_Base");
Global.GameObj.GPlayer = require("GO_Player");

Global.Model.Game.init();
Global.Model.MPlayer.init();
Global.Model.MFloor.init();
Global.Model.MWall.init();
Global.Model.MNormal.init();
Global.Model.MClip.init();
Global.Model.MFly.init();
Global.Model.MCoins.init();
Global.Model.MFlyCoins.init();
Global.Model.MBoom.init();
Global.Model.MFlyBoom.init();
Global.Model.MEnergy.init();
Global.Model.MRocket.init();
Global.Model.MJump.init();
Global.Model.MPlane.init();
Global.Model.MCar.init();

console.log("Global is Loaded");

module.exports = Global;

