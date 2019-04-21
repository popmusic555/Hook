var GameEnum = {};

// GameEnum.GAME_STATE = {
//     STOP:0,
//     JUMP:1,
//     EMIT:2,
//     FLY:3,
//     END:4,
// };

GameEnum.PLAYER_STATE = {    
    NULL:0,// 空
    STATIC:1,// 静止
    EMIT:2,// 发射
    FLY:3,// 飞行
    DROP:4,// 下落
    HIT:5,// 受伤
    ATK:6,// 攻击
    SUPER_ATK:7,// 超级攻击
    IMPACT:8,// 冲击
    DEAD1:9,// 死亡
    DEAD2:10,// 死亡
    HITWALL:11,
}

// 主角运动状态
GameEnum.PLAYER_RUNSTATE = new cc.Enum({
    NORMAL:1,
    SUPER_ATK:2,
    IMPACT:3,
    DEATH:4
});

GameEnum.GAME_STATE = {    
    READY:0,// 准备
    GAMING:1,// 游戏中
    GAMOVER:2,// 游戏结束
}

GameEnum.GAMEOBJ_TYPE = new cc.Enum({
    FLOOR:0,
    MONSTER:1,
    PLAYER:2,
    WALL:3,
});

GameEnum.MONSTER_TYPE = new cc.Enum({
    MONSTER:1,
    PLAYER:2,
});

GameEnum.MONSTER_STATE = new cc.Enum({
    RUN:0,
    SIT:1
});


module.exports = GameEnum;