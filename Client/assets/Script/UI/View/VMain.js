
var Level = require("Level");
var ContentIcon = require("ContentIcon");

cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type:cc.AudioClip,
            default:null,
        },

        // 升级项描述表
        levelUpDesc:cc.JsonAsset,
        _LevelUpDescObj:null,
        // 升级项消耗表
        levelUpConsume:cc.JsonAsset,
        _LevelUpConsumeObj:null,

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

        this._LevelUpDescObj = this.levelUpDesc.json;
        this._LevelUpConsumeObj = this.levelUpConsume.json;
        Global.Model.MPlayer.initLevels([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

        // 切换到页签1
        this.switchTab({target:this.tabBtn[0].node} , 0);
    },

    // update (dt) {},
    gameStart:function () {
        cc.director.loadScene("NewGameScene");
    },

    init:function (tabId) {
        
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

        var progress = this.tabPage[tabIndex].getComponentsInChildren(cc.ProgressBar);
        var len = progress.length;
        for (let index = 0; index < len; index++) {
            var item = progress[index];
            item.progress = Global.Model.MPlayer.getLevelByItemID(tabIndex * 8 + index) / this._LevelUpDescObj[index].maxLevel;
        }

        // 切换到选项1
        var btn = this.tabPage[tabIndex].getComponentInChildren(cc.Button);
        this.switchLevelUpItem({target:btn.node} , tabIndex * 8);
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
        title.string = this._LevelUpDescObj[index].name;
        var desc = this._ContentPage.getChildByName("Desc").getComponentInChildren(cc.Label);
        desc.string = this._LevelUpDescObj[index].desc;
        var icon = this._ContentPage.getChildByName("Icon").getComponent(ContentIcon);
        icon.type = index;
        var level = this._ContentPage.getChildByName("Level").getComponent(Level);
        var maxLevelNum = this._LevelUpDescObj[index].maxLevel;
        level.maxLevelNum = maxLevelNum;
        var curLevelNum = Global.Model.MPlayer.getLevelByItemID(index);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        if (curLevelNum < maxLevelNum) {
            coins.string = " x " + this._LevelUpConsumeObj[curLevelNum]["levelupItem" + index];
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
        var curLevelNum = Global.Model.MPlayer.levelUp(this._CurLevelUpIndex);
        var maxLevelNum = this._LevelUpDescObj[this._CurLevelUpIndex].maxLevel;

        var level = this._ContentPage.getChildByName("Level").getComponent(Level);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        if (curLevelNum < maxLevelNum) {
            coins.string = " x " + this._LevelUpConsumeObj[curLevelNum]["levelupItem" + this._CurLevelUpIndex];  
        }
        else
        {
            coins.string = "已满级";
        }

        var progress = this._CurSelectedItem.getComponentInChildren(cc.ProgressBar);
        progress.progress = curLevelNum / maxLevelNum;
    },
});
