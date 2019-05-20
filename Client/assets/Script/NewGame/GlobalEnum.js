

var GlobalEnum = {};

// 怪物类型
GlobalEnum.TYPE = new cc.Enum({
    // 玩家
    PLAYER:0,
    // 地板
    FLOOR:1,
    // 墙
    WALL:2,
    // 普通
    NORMAL:3,
    // 飞行普通
    NORMAL_FLY:4,
    // 金币
    COINS:5,
    // 飞行金币
    COINS_FLY:6,
    // 炸弹
    BOOM:7,
    // 飞行炸弹
    BOOM_FLY:8,
    // 夹子
    CLIP:9,
    // 能量
    ENERGY:10,
    // 火箭
    ROCKET:11,
    // 弹跳机
    JUMP:12,
    // 弹跳机拳头
    JUMP_FIST:13,
    // 油桶
    OIL:14,
    // 飞机
    PLANE:15,
    // 汽车
    CAR:16,
});

GlobalEnum.P_ANI_STATE = new cc.Enum({
    // 空状态
    NULL:0,
    // 准备状态
    READY:1,
    // 发射状态
    LAUNCH:2,
    // 飞行状态
    FLY:3,
    // 下落状态
    DROP:4,
    // 受伤状态
    HURT:5,
    // 攻击状态
    ATTACK:6,
    // 技能状态
    SKILL:7,
    // 死亡1状态
    DEATH1:8,
    // 死亡2状态
    DEATH2:9,
    // 撞墙状态
    HITWALL:10,
    // 冲击状态
    IMPACT:11,
});

GlobalEnum.P_STATE = new cc.Enum({
    // 准备
    READY:0,
    // 正常
    NORMAL:1,
    // 变化
    TRANSFORM:2,
});

module.exports = GlobalEnum;
