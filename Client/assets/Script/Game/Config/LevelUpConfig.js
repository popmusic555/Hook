/**
 * 人物配置文件
 * 
 */

var LevelUpConfig = {};

var TYPE = [
    "emitSpeedCost",
    "bouncHeightCost",
    "energyLimitCost",
    "offLineRewardCost",
    "mNormalCost",
    "floorAddValueCost",
    "coinsCost",
    "wallAddValueCost",
    "mJumpCost",
    "mEnergyCost",
    "mPlaneCost",
    "mCarCost",
    "mCoinsCost",
    "mBombCost",
    "mRocketCost",
    "mClipCost",
];

LevelUpConfig._Datas = {};

/**
 * 初始化
 * 
 * @param {any} config 配置数据
 */
LevelUpConfig.init = function (config) {
    this._Datas.title = [
        "弹射起步",
        "弹跳力",
        "火箭冲刺",
        "离线奖励",
        "碾碎他们",
        "湿滑乳液",
        "妙手",
        "大门摧毁者",
        "速度",
        "速度",
        "速度",
        "速度",
        "速度",
        "速度",
        "速度",
        "速度",
    ];
    this._Datas.desc = [
        "初始以更高的速度从炮筒发射",
        "碰到东西后弹跳得更高",
        "提高火箭冲刺的储存上限",
        "增加离线奖励",
        "落在史莱姆上时能保持较高速度",
        "减少落在地上时损失的速度",
        "从史莱姆中获得更多的金钱",
        "减少冲破大门时损失的速度",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
        "将你的速度提升至下一等级",
    ];
    this._Datas.level = [
    ];
    for (let lv = 0; lv < config.length; lv++) {
        const lvCfg = config[lv];
        for (let index = 0; index < TYPE.length; index++) {
            var field = TYPE[index];
            var value = lvCfg[field];
            if (!this._Datas.level[index]) {
                this._Datas.level[index] = [];
            }
            if (value != "" && value != 0) {
                this._Datas.level[index][lvCfg.level] = value;    
            }
        }
    }

    console.log(this._Datas);
};

// 字段名称转索引
LevelUpConfig.IndexToField = function (index) {
    return TYPE[index];
};

/**
 * 根据索引获取标题
 * 
 * @param {any} index 索引
 */
LevelUpConfig.getTitleByIndex = function (index) {
    return this._Datas.title[index];
};
/**
 * 根据索引获取描述
 * 
 * @param {any} index 索引
 */
LevelUpConfig.getDescByIndex = function (index) {
    return this._Datas.desc[index];   
};
/**
 * 根据等级获取升级消耗
 * 
 * @param {any} index 索引
 * @param {any} level 等级
 * @returns 
 */
LevelUpConfig.getConsumeByLevel = function (index , level) {
    return this._Datas.level[index][level];
};
/**
 * 根据索引回去最大等级
 * 
 * @param {any} index 
 * @returns 
 */
LevelUpConfig.getMaxLevelByIndex = function (index) {
    return this._Datas.level[index].length-1;
};

module.exports = LevelUpConfig;



