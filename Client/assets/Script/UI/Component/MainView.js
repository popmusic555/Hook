
var MonsterConfig = require("MonsterConfig");
var PlayerConfig = require("PlayerConfig");
var PassConfig = require("PassConfig");
var LevelUpConfig = require("LevelUpConfig");
var DataManager = require("DataManager");
var Level = require("Level");
var ContentIcon = require("ContentIcon");

cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type:cc.AudioClip,
            default:null,
        },
        
        playerConfig:cc.JsonAsset,
        monsterConfig:[cc.JsonAsset],
        passConfig:cc.JsonAsset,
        levelUpConfig:cc.JsonAsset,

        // tab按钮
        tabBtn:[cc.Button],
        // tabPage
        tabPage:[cc.Node],
        // 选中效果
        selectedSprite:cc.Sprite,
        // 默认选项
        defaultSelect:cc.Button,

        _CurSelectedItem:null,

        _ContentPage:null,

        _CurLevelUpIndex:0,
    },

    // onLoad () {},

    start () {
        cc.audioEngine.playMusic(this.bgm, true);

        // 初始化配置表
        this.initPlayerConfig();
        this.initMonsterConfig();
        this.initPassConfig();
        this.initLevelUpConfig();
        // 初始化用户数据
        this.initUserData();

        // 切换到页签1
        this.switchTab({target:this.tabBtn[0].node} , 0);
        // 切换到选项1
        this.switchLevelUpItem({target:this.defaultSelect.node} , 0);
    },

    // update (dt) {},

    initMonsterConfig:function () {
        // console.log("length" , this.monsterConfig.length);
        for (let index = 0; index < this.monsterConfig.length; index++) {
            const cfg = this.monsterConfig[index];
            // console.log(cfg.name , cfg.json);
            MonsterConfig.init(cfg.name , cfg.json);
        }
    },

    initPlayerConfig:function (cfg) {
        PlayerConfig.init(this.playerConfig.json);
    },

    initPassConfig:function () {
        PassConfig.init(this.passConfig.json);
    },

    initLevelUpConfig:function () {
        LevelUpConfig.init(this.levelUpConfig.json);
    },

    initUserData:function () {
        DataManager.Userdata.init();
    },

    gameStart:function () {
        cc.director.loadScene("GameScene");
    },

    // 切换tab页
    switchTab:function (event , tabIndex) {
        var len = this.tabBtn.length;
        for (let index = 0; index < len; index++) {
            const btn = this.tabBtn[index];
            if (btn.node.name == event.target.name) {
                btn.interactable = false;
            }
            else
            {
                btn.interactable = true;
            }
        }

        len = this.tabPage.length;
        for (let index = 0; index < len; index++) {
            const page = this.tabPage[index];
            if (index == tabIndex) {
                page.active = true;
            }
            else
            {
                page.active = false;
            }
        }
    },

    // 切换选项
    switchLevelUpItem:function (event , index) {
        if (this._CurSelectedItem) {
            this._CurSelectedItem.interactable = true;
        }
        var curBtn = event.target.getComponent(cc.Button);
        this.selectedSprite.node.parent = curBtn.node;
        curBtn.interactable = false;
        this._CurSelectedItem = curBtn;
        this.switchContent(index);
    },

    // 切换内容
    switchContent:function (index) {
        if (!this._ContentPage) {
            this._ContentPage = this.node.getChildByName("Content");
        }
        console.log("当前选项 " , index);
        this._CurLevelUpIndex = index;
        var title = this._ContentPage.getChildByName("Title").getComponent(cc.Label);
        title.string = LevelUpConfig.getTitleByIndex(index);
        var desc = this._ContentPage.getChildByName("Desc").getComponentInChildren(cc.Label);
        desc.string = LevelUpConfig.getDescByIndex(index);
        var icon = this._ContentPage.getChildByName("Icon").getComponent(ContentIcon);
        icon.type = index;
        var level = this._ContentPage.getChildByName("Level").getComponent(Level);
        var maxLevelNum = LevelUpConfig.getMaxLevelByIndex(index);
        level.maxLevelNum = maxLevelNum;
        var curLevelNum = DataManager.Userdata.getLevelByIndex(index);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        var nextLevelNum = curLevelNum+1;
        if (nextLevelNum <= maxLevelNum) {
            coins.string = " x " + LevelUpConfig.getConsumeByLevel(index ,nextLevelNum);
        }
        else
        {
            coins.string = "已满级";
        }
    },

    // 升级按钮回调
    onLevelUpBtn:function (event) {
        // 当前升级按钮回调
        console.log("升级当前选项", this._CurLevelUpIndex);
        DataManager.Userdata.toNextLevelByIndex(this._CurLevelUpIndex);
        var curLevelNum = DataManager.Userdata.getLevelByIndex(this._CurLevelUpIndex);
        var nextLevelNum = curLevelNum+1;
        var maxLevelNum = LevelUpConfig.getMaxLevelByIndex(this._CurLevelUpIndex);
        console.log("curLevelNum" , curLevelNum , "nextLevelNum" , nextLevelNum);

        var level = this._ContentPage.getChildByName("Level").getComponent(Level);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        if (nextLevelNum <= maxLevelNum) {
            coins.string = " x " + LevelUpConfig.getConsumeByLevel(this._CurLevelUpIndex ,nextLevelNum);    
        }
        else
        {
            coins.string = "已满级";
        }
    },
});
