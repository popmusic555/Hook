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
    this.coins = 0;
    // 复活次数
    this.revive = 0;
    // 最大里程
    this.mileage = 0;
    // 最大关卡数
    this.maxPass = 0;
    // 轮盘奖励倍数
    this.lottery = 4;
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
 * 设置轮盘奖励倍数
 * 
 * @param {any} num 奖励倍数
 */
MGame.setLotteryNum = function (num) {
    this.lottery = num;
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