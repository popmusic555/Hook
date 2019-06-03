

var GlobalConst = {};

// 服务器地址
GlobalConst.URL = "http://123.59.20.141:8081/hulk/test";

// 重力系数
GlobalConst.GRAVITY_SCALE = 8;
// 里程数比率
GlobalConst.MILEAGE_RATIO = 30;
// 能量比率
GlobalConst.ENERGY_RATIO = 10;
// 速度比率
GlobalConst.VELOCITY_RATIO = 30;


// 游戏结束速度
GlobalConst.GAMEOVER_SPEED = 150;
// 冲击速度
GlobalConst.IMPACT_SPEED = 6000;
// 墙体内速度
GlobalConst.INWALL_SPEED = 3000;
// 墙体宽度
GlobalConst.WALL_WIDTH = 1810;

// 超速
GlobalConst.SUPER_SPEED = 5000;

// 复活时间
GlobalConst.RECVIVE_TIMES = 3;

// 碎片任务概率
// GlobalConst.FRAGMENT_RATE = [0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01];
// GlobalConst.FRAGMENT_RATE = [1,1,1,1,1,1,1,1,1,1,1,1];
GlobalConst.FRAGMENT_RATE = [0.01,0.01,0.01,0.001,0.001,0.001,0.0001,0.0001,0.00005,0.00005,0.00001,0];
// 发射力量
GlobalConst.LAUNCH_POWER = [0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2];
// 发射奖励倍率
// GlobalConst.LAUNCH_RATE = [0,0,0,0,0,0,0,0,0,0,0];
GlobalConst.LAUNCH_RATE = [0,0,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0];

// 轮盘奖励持续时间(秒)
GlobalConst.LOTTERY_TIME = 1200;
// 最大离线时间(分钟)
GlobalConst.MAX_OFFLINE = 60;


module.exports = GlobalConst;
