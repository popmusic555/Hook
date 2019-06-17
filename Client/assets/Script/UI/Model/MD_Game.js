/**
 * 游戏模型
 */
var MGame = {};

var Enum = Global.Common.Enum;

/**
 * 游戏数据初始化
 */
MGame.init = function () {

    this._ResumeNode = null;

    if (cc.sys.localStorage.getItem("musicOff") == "true") {
        this.musicOff = true;    
    }
    else
    {
        this.musicOff = false;    
    }
    Global.Common.Audio.enabled(!this.musicOff);

    // 游戏UI
    this.uiView = null;
    // 游戏内UI
    this.gameView = null;

    // uuid
    this.uuid = "";
    // 昵称
    this.nickname = "";
    // 头像
    this.headicon = "";

    // 新手引导步骤
    this.guideStep = 0,
    // 怪物引导
    this.monsterGuide = [0,0,0];

    // 金币数量
    this.coins = 99999999;
    // 复活次数
    this.revive = 0;
    // 最大里程
    this.mileage = 0;
    // 最大关卡数
    this.maxPass = 0;
    // 连击数量
    this.combo = 0;
    // 离线时间
    this.offlineTime = 0;
    // 轮盘奖励倍数
    this.lottery = 0;
    // 轮盘免费次数
    this.freeLottery = 0;
    // 抽奖时间
    this.lotteryTime = 0;

    // 所有升级选项等级
    this.levels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    this.task = [];
    // 任务上限
    this.task.limit = 3;
    // 当前任务ID
    this.task.id = 0;
    // 当前任务奖励ID
    this.task.rewardId = 0;
    // 当前碎片
    this.task.fragment = [0,0,0,0,0,0,0,0,0,0,0,0];
    // 当前任务状态
    this.task.state = 0;
    // 当前任务剩余时间
    this.task.times = 0;
    // 当前击杀怪物数量
    this.task.killNum = 101;

    // 好友邀请
    this.friend = [];
    // this.friend[0] = {isReward:false};
    // this.friend[1] = {isReward:false};
    // this.friend[2] = {isReward:false};

    // 所有升级选项数据表
    this.levelsItemConfig = {};
    this.levelsItemConfig.player = null;
    this.levelsItemConfig.coins = null;
    this.levelsItemConfig.flycoins = null;
    this.levelsItemConfig.boom = null;
    this.levelsItemConfig.flyboom = null;
    this.levelsItemConfig.clip = null;
    this.levelsItemConfig.energy = null;
    this.levelsItemConfig.rocket = null;
    this.levelsItemConfig.jump = null;
    this.levelsItemConfig.plane = null;
    this.levelsItemConfig.car = null;

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

MGame.initPlayerLevelConfig = function (config) {
    this.levelsItemConfig.player = config;
};

MGame.initCoinsLevelConfig = function (config) {
    this.levelsItemConfig.coins = config;
};

MGame.initFlyCoinsLevelConfig = function (config) {
    this.levelsItemConfig.flycoins = config;
};

MGame.initBoomLevelConfig = function (config) {
    this.levelsItemConfig.boom = config;
};

MGame.initFlyBoomLevelConfig = function (config) {
    this.levelsItemConfig.flyboom = config;
};

MGame.initEnergyLevelConfig = function (config) {
    this.levelsItemConfig.energy = config;
};

MGame.initClipLevelConfig = function (config) {
    this.levelsItemConfig.clip = config;
};

MGame.initRocketLevelConfig = function (config) {
    this.levelsItemConfig.rocket = config;
};

MGame.initJumpLevelConfig = function (config) {
    this.levelsItemConfig.jump = config;
};

MGame.initPlaneLevelConfig = function (config) {
    this.levelsItemConfig.plane = config;
};

MGame.initCarLevelConfig = function (config) {
    this.levelsItemConfig.car = config;
};

MGame.getConfigByLevel = function (config , level) {
    level = level + 1;
    return config[level];
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

MGame.getTask = function () {
    return this.task;  
}

MGame.nextTask = function () {
    if (this.task.id < this.task.limit-1) {
        this.task.id += 1; 
    }
}

/**
 * 初始化邀请好友信息
 * 
 * @param {any} list 
 */
MGame.initFriend = function (list) {
    this.friend = [];

    var len = list.length / 4;
    for (let index = 0; index < len; index++) {
        var friend = {};
        friend.id = list[index * 4 + 0];
        friend.nickname = list[index * 4 + 1];
        friend.headicon = list[index * 4 + 2];
        friend.isReward = false;
        var state = list[index * 4 + 3];
        if (state == 1) {
            friend.isReward = true;
        }

        if (friend.id != 0) {
            this.friend[index] = friend;    
        }
    }
}

/**
 * 获取已邀请好友数据
 * 
 * @returns 
 */
MGame.getFriend = function () {
    return this.friend;
}

/**
 * 获取已邀请好友奖励数据
 * 
 * @returns 
 */
MGame.getFriendReward = function () {
    var result = [];
    for (let i = 0; i < this.friend.length; i++) {
        const item = this.friend[i];
        if (!item.isReward) {
            result.push(item);
        }
    }
    return result;
}

/**
 * 设置离线时间
 * 
 * @param {any} time 
 */
MGame.setOfflineTime = function (time) {
    this.offlineTime = time;
}
/**
 * 获取离线时间
 * 
 * @returns 
 */
MGame.getOfflineTime = function () {
    return this.offlineTime;
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
 * 增加复活次数
 *
 * @param {*} num 次数
 */
MGame.addRevive = function (num) {
    this.setRevive(this.revive + num);
}

MGame.reduceRecvive = function (num) {
    this.setRevive(this.revive - num);
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

MGame.addCoins = function (num) {
    this.setCoins(this.coins + num);
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
 * 设置免费轮盘次数
 * 
 * @param {any} num 
 */
MGame.setFreeLottery = function (num) {
    this.freeLottery = num;
}
/**
 * 设置轮盘抽奖时间
 * 
 * @param {any} num 
 */
MGame.setLotteryTime = function (num) {
    this.lotteryTime = num;
}

/**
 * 获取怪物击杀数量
 *
 * @returns 数量
 */
MGame.getKillNum = function () {
    return this.task.killNum;
}

/**
 * 设置怪物击杀数量
 *
 * @param {*} num 数量
 */
MGame.setKillNum = function (num) {
    this.task.killNum = num;  
};

/**
 * 增加击杀数量
 *
 * @param {*} num
 */
MGame.addKillNum = function (num) {
    this.setKillNum(num + this.getKillNum());
}
/**
 * 初始化引导数据
 * 
 * @param {any} num 
 */
MGame.initGuide = function (num) {
    var guideStep = num & 1;
    if (guideStep > 0) {
        this.guideStep = 10;
    }
    num >>= 1;
    for (let index = 0; index < this.monsterGuide.length; index++) {
        this.monsterGuide[index] = num & 1;
        num >>= 1;
    }
}

MGame.getGuideForNum = function () {
    var guideStep = 0;
    for (let index = this.monsterGuide.length-1; index >= 0; index--) {
        guideStep <<= 1;
        guideStep = guideStep + this.monsterGuide[index];
    }

    guideStep <<= 1;
    if (this.guideStep > 0) {
        guideStep = guideStep + 1;
    }
    else
    {
        guideStep = guideStep + 0;   
    }
    return guideStep;
}

MGame.setGuide = function (step , monsterGuide) {
    this.guideStep = step;
    var len = monsterGuide.length;
    for (let index = 0; index < len; index++) {
        this.monsterGuide[index] = monsterGuide[index];
    }
}

MGame.getCombo = function () {
    return this.combo;
};

MGame.addCombo = function () {
    this.combo += 1;  
};

MGame.clearCombo = function () {
    this.combo = 0;  
};

/**
 * 根据值初始化碎片
 * 
 * @param {any} num 
 */
MGame.initFragment = function (num) {
    for (let index = 0; index < 12; index++) {
        this.task.fragment[index] = num & 1;
        num >>= 1;
    }
}

MGame.getFragmentForNum = function () {
    var fragment = 0;
    var len = this.task.fragment.length;
    for (let index = len-1; index >= 0; index--) {
        fragment <<= 1;
        fragment = fragment + this.task.fragment[index];
    }
    return fragment;
}

/**
 * 添加碎片
 *
 * @param {*} fragmentList 碎片列表
 */
MGame.addFragment = function (fragmentList) {
    var len = this.task.fragment.length;
    for (let index = 0; index < len; index++) {
        this.task.fragment[index] += fragmentList[index];
    }
}

MGame.fullFragment = function () {
    var len = this.task.fragment.length;
    for (let index = 0; index < len; index++) {
        var num = this.task.fragment[index];
        if (num <= 0) {
            return false;
        }
    }
    return true;
}

MGame.getFragmentNum = function () {
    var num = 0;
    var len = this.task.fragment.length;
    for (let index = 0; index < len; index++) {
        if (this.task.fragment[index] > 0) {
            num++;
        }
    }
    return num;
}

/**
 * 设置邀请数量
 *
 * @param {*} num 数量
 */
MGame.setInvitation = function (num) {
    this.invitation = num;
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

MGame.showRecvive = function () {
    this.uiView.showRecvive();
}

/**
 * 暂停游戏
 *
 */
MGame.pauseGame = function () {
    // 暂停
    // 停止物理系统
    var manager = cc.director.getPhysicsManager();
    manager.enabled = false;

    // 停止SP动画
    var components = Global.Model.Game.getGameView().getComponentsInChildren(sp.Skeleton);
    var len = components.length;
    for (let index = 0; index < len; index++) {
        var item = components[index];
        item.timeScale = 0;
    }

    // 停止节点动画
    var resumeNodes = cc.director.getActionManager().pauseAllRunningActions();
    this.setResumeNode(resumeNodes);
}

/**
 * 恢复游戏
 *
 */
MGame.resumeGame = function () {
    var manager = cc.director.getPhysicsManager();
    manager.enabled = true;  

    var components = Global.Model.Game.getGameView().getComponentsInChildren(sp.Skeleton);
    var len = components.length;
    for (let index = 0; index < len; index++) {
        var item = components[index];
        item.timeScale = 1;
    }

    cc.director.getActionManager().resumeTargets(this._ResumeNode);
    this._ResumeNode = null;
}

MGame.setResumeNode = function (nodes) {
    this._ResumeNode = nodes;
}

MGame.share = function (WxAdapter) {
    var num = Global.Common.Utils.random(0 , 2);
    
    var title = Global.Common.Const.SHARE_TITLE[num];
    var img = Global.Common.Const.SHARE_IMG[num];
    var query = "uuid=" + this.uuid;

    WxAdapter.openShare(title , img , query);
}

module.exports = MGame;