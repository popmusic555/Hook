

var GlobalConst = {};

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

// 碎片任务概率
GlobalConst.FRAGMENT_RATE = [0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01];
// GlobalConst.FRAGMENT_RATE = [1,1,1,1,1,1,1,1,1,1,1,1];
// 发射力量
GlobalConst.LAUNCH_POWER = [0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2];
// 发射奖励倍率
GlobalConst.LAUNCH_RATE = [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0];



module.exports = GlobalConst;
