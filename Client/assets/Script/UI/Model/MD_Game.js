/**
 * 游戏模型
 */
var MGame = {};

var Enum = Global.Common.Enum;

/**
 * 游戏数据初始化
 */
MGame.init = function () {
    
    // 游戏UI
    this.uiView = null;
    // 游戏内UI
    this.gameView = null;

    // 金币数量
    this.coins = 99999999;
    // 复活次数
    this.revive = 3;
    // 最大里程
    this.mileage = 0;
    // 最大关卡数
    this.maxPass = 0;
    // 轮盘奖励倍数
    this.lottery = 4;

    // 所有升级选项等级
    this.levels = [];

    // 是否切换场景
    this.transition = false;
};

/**
 * 初始化所有升级选项等级
 * 
 * @param {any} levels 所有升级选项的等级
 */
MGame.initLevels = function (levels) {
    var len = levels.length;
    for (let index = 0; index < len; index++) {
        this.levels[index] = levels[index];
    }
};

/**
 * 根据选项ID获取等级
 *
 * @param {*} itemid 选项ID
 * @returns
 */
MGame.getLevelByItemID = function (itemid) {
    return this.levels[itemid];
};

/**
 * 升级
 *
 * @param {*} itemid 选项ID
 */
MGame.levelUp = function (itemid) {
    this.levels[itemid] += 1;
    return this.getLevelByItemID(itemid);
};

/**
 * 设置UI
 * 
 * @param {any} view uiView
 */
MGame.setUIView = function (view) {
    this.uiView = view;
}
/**
 * 设置游戏内界面
 * 
 * @param {any} view gameView
 */
MGame.setGameView = function (view) {
    this.gameView = view;
}

/**
 * 获取UI
 * 
 * @returns uiView
 */
MGame.getUIView = function () {
    return this.uiView;
}

/**
 * 获取游戏内界面
 * 
 * @returns gameView
 */
MGame.getGameView = function () {
    return this.gameView;
}

/**
 * 设置最大里程
 * 
 * @param {any} num 最大里程
 */
MGame.setHighestMileage = function (num) {
    this.mileage = num;
};
/**
 * 设置最大关卡数
 * 
 * @param {any} num 最大关卡数
 */
MGame.setMaxPass = function (num) {
    this.maxPass = num;
};

/**
 * 设置复活次数
 * 
 * @param {any} num 复活次数
 */
MGame.setRevive = function (num) {
    this.revive = num;
}
/**
 * 设置金币数量
 * 
 * @param {any} num 金币数量
 */
MGame.setCoins = function (num) {
    this.coins = num;
}
/**
 * 减少金币数量
 * 
 * @param {any} num 金币数量
 */
MGame.reduceCoins = function (num) {
    this.setCoins(this.coins - num);
}

/**
 * 设置轮盘奖励倍数
 * 
 * @param {any} num 奖励倍数
 */
MGame.setLotteryNum = function (num) {
    this.lottery = num;
};
/**
 * 金币是否足够 
 * 
 */
MGame.isEnoughCoins = function (num) {
    if (this.coins >= num) {
        return true;
    }
    return false;
};

/**
 * 显示设置界面
 * 
 */
MGame.showSetView = function () {
    this.uiView.showSetView();
}
/**
 * 显示结算界面
 * 
 */
MGame.showSettlementView = function () {
    this.uiView.showSettlementView();
}

module.exports = MGame;