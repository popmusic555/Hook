
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
        // 内容
        content:[cc.Node],

        _CurSelectedItem:null,

        _ContentPage:null,

        _CurLevelUpIndex:0,

    },

    // onLoad () {},

    start () {
        cc.audioEngine.playMusic(this.bgm, true);

        this._LevelUpDescObj = this.levelUpDesc.json;
        this._LevelUpConsumeObj = this.levelUpConsume.json;

        // 切换到页签1
        this.switchTab({target:this.tabBtn[0].node} , 0);

        this.refreshTopBar();
    },

    // update (dt) {},
    gameStart:function () {
        var transition = cc.find("Canvas").getComponentInChildren("VTransition");
        if (transition) {
            transition.transitionWithScene("NewGameScene");
        }
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
            var id = tabIndex * 8 + index;
            item.progress = Global.Model.Game.getLevelByItemID(id) / this._LevelUpDescObj[id].maxLevel;

            // 显示提示
            var hint = item.node.parent.getChildByName("Hint");
            var curLevelNum = Global.Model.Game.getLevelByItemID(id);
            var nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + id];
            if (Global.Model.Game.isEnoughCoins(nextLevelConsume)) {
                // 金币不足
                hint.active = true;
            }
            else
            {
                hint.active = false;
            }
        }        

        // 切换到选项1
        var btn = this.tabPage[tabIndex].getComponentInChildren(cc.Button);
        this.switchLevelUpItem({target:btn.node} , tabIndex * 8);

        this.content[0].active = true;
        this.content[1].active = false;
    },

    switchTabNoRefresh:function (event , tabIndex) {
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

        this.content[0].active = false;
        this.content[1].active = true;

        var activityView = this.getComponentInChildren("VActivity");
        activityView.show();
    },

    // 切换选项
    switchLevelUpItem:function (event , index) {
        if (this._CurSelectedItem) {
            this._CurSelectedItem.interactable = true;
        }
        var curBtn = event.target.getComponent(cc.Button);
        this.selectedSprite.node.parent = curBtn.node.getChildByName("Selected");
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
        var curLevelNum = Global.Model.Game.getLevelByItemID(index);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        var levelUpBtn = this._ContentPage.getChildByName("LevelUp").getComponent(cc.Button);
        if (curLevelNum < maxLevelNum) {
            var nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + index];
            coins.string = " x " + nextLevelConsume;
            if (!Global.Model.Game.isEnoughCoins(nextLevelConsume)) {
                // 金币不足
                levelUpBtn.interactable = false;
            }
            else
            {
                levelUpBtn.interactable = true;
            }
        }
        else
        {
            coins.string = "已满级";
            levelUpBtn.interactable = false;
        }

        
    },

    // 升级按钮回调
    onLevelUpBtn:function (event) {
        // 当前升级按钮回调
        var maxLevelNum = this._LevelUpDescObj[this._CurLevelUpIndex].maxLevel;
        var curLevelNum = Global.Model.Game.getLevelByItemID(this._CurLevelUpIndex);
        var nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + this._CurLevelUpIndex];

        // 减少金币
        Global.Model.Game.reduceCoins(nextLevelConsume);
        var curLevelNum = Global.Model.Game.levelUp(this._CurLevelUpIndex);
        var level = this._ContentPage.getChildByName("Level").getComponent(Level);
        level.level = curLevelNum;
        var coins = this._ContentPage.getChildByName("Coins").getComponentInChildren(cc.Label);
        var levelUpBtn = event.target.getComponent(cc.Button);
        if (curLevelNum < maxLevelNum) {
            nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + this._CurLevelUpIndex];
            coins.string = " x " + nextLevelConsume;
            
            if (!Global.Model.Game.isEnoughCoins(nextLevelConsume)) {
                levelUpBtn.interactable = false;
            }
            else
            {
                levelUpBtn.interactable = true;  
            }
        }
        else
        {
            coins.string = "已满级";
            levelUpBtn.interactable = false;
        }

        var progress = this._CurSelectedItem.getComponentInChildren(cc.ProgressBar);
        progress.progress = curLevelNum / maxLevelNum;

        this.refreshTopBar();
    },

    refreshTopBar:function () {
        var topbar = this.getComponentInChildren("TopBar");
        topbar.refresh();
    },

    onRankBtn:function () {
        // var offlineView = this.node.parent.getComponentInChildren("VOffline");
        // offlineView.show(9527);
    },

    onFriendBtn:function () {
        var friendView = this.node.parent.getComponentInChildren("VFriend");
        friendView.show(Global.Model.Game.getFriend());
    },

    onLotteryBtn:function () {
        var friendView = this.node.parent.getComponentInChildren("VLottery");
        friendView.show();
    },

    onSetBtn:function () {
        var setView = this.node.parent.getComponentInChildren("VSet");
        setView.show();
    },
});
