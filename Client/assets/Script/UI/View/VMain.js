
var Level = require("Level");
var ContentIcon = require("ContentIcon");
var RedDot = require("RedDot");

cc.Class({
    extends: cc.Component,

    properties: {
        musicRes: {
            type:cc.AudioClip,
            default:[],
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

        isLeveling:false,
    },

    onLoad () {

        Global.Common.Audio.setAudioClip("mainBgm" , this.musicRes[0]);
        Global.Common.Audio.setAudioClip("gameBgm" , this.musicRes[1]);
        Global.Common.Audio.setAudioClip("btn1Click" , this.musicRes[2]);
        Global.Common.Audio.setAudioClip("btn2Click" , this.musicRes[3]);
        Global.Common.Audio.setAudioClip("btnStart" , this.musicRes[4]);
        Global.Common.Audio.setAudioClip("launch" , this.musicRes[5]);
        Global.Common.Audio.setAudioClip("fly" , this.musicRes[6]);
        Global.Common.Audio.setAudioClip("mNormal" , this.musicRes[7]);
        Global.Common.Audio.setAudioClip("hurt" , this.musicRes[8]);
        Global.Common.Audio.setAudioClip("boom" , this.musicRes[9]);
        Global.Common.Audio.setAudioClip("mClip" , this.musicRes[10]);
        Global.Common.Audio.setAudioClip("skill" , this.musicRes[11]);
        Global.Common.Audio.setAudioClip("skillFloor" , this.musicRes[12]);
        Global.Common.Audio.setAudioClip("mCoins" , this.musicRes[13]);
        Global.Common.Audio.setAudioClip("mCar" , this.musicRes[14]);
        Global.Common.Audio.setAudioClip("mCar2" , this.musicRes[15]);
        Global.Common.Audio.setAudioClip("mPlane" , this.musicRes[16]);
        Global.Common.Audio.setAudioClip("mJump" , this.musicRes[17]);
        Global.Common.Audio.setAudioClip("mEnergy" , this.musicRes[18]);
        Global.Common.Audio.setAudioClip("crossOutWall" , this.musicRes[19]);
        Global.Common.Audio.setAudioClip("crossFail" , this.musicRes[20]);
        Global.Common.Audio.setAudioClip("settlement" , this.musicRes[21]);
        Global.Common.Audio.setAudioClip("crossInWall" , this.musicRes[22]);

    },

    start () {
        Global.Common.Audio.playMusic("mainBgm" , true);

        this._LevelUpDescObj = this.levelUpDesc.json;
        this._LevelUpConsumeObj = this.levelUpConsume.json;

        // 切换到页签1
        this.switchTab({target:this.tabBtn[0].node} , 0 , 0);

        this.refreshTopBar();

        // 弹出离线奖励界面
        this.onOfflineBtn();

        // 红点提示
        this.showRedDot();
    },

    showRedDot:function () {
        var reddot = this.node.getComponentsInChildren(RedDot);
        for (let i = 0; i < reddot.length; i++) {
            const item = reddot[i];
            item.refresh();
        }
    },

    // update (dt) {},
    gameStart:function (event) {
        Global.Common.Audio.playEffect("btnStart" , false);
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        var ani = event.target.getComponentInChildren(sp.Skeleton);
        ani.animation = "start";
        ani.node.active = true;
        ani.setCompleteListener(function () {
            var transition = cc.find("Canvas").getComponentInChildren("VTransition");
            if (transition) {
                transition.transitionWithScene("NewGameScene");
            }
        }.bind(this));
    },

    onSwitchTab:function (event , tabIndex) {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.switchTab(event , tabIndex , 0);
    },

    // 切换tab页
    switchTab:function (event , tabIndex , itemIndex) {
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
                this.playPageAnimation(page);
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
            hint.stopActionByTag(10);
            var action = cc.repeat(cc.sequence(cc.rotateBy(0.05 , 10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , -10) , cc.rotateBy(0.05 , 10)) , 2);
            var action2 = cc.repeatForever(cc.sequence(cc.delayTime(0.0) , action));
            action2.setTag(10);
            hint.runAction(action2);
            hint = hint.getChildByName("Hint");

            var lock = item.node.parent.getChildByName("Lock");
            var curLevelNum = Global.Model.Game.getLevelByItemID(id);
            if (curLevelNum < 0) {
                // 未开放
                hint.active = false;
                lock.active = true;
                item.node.parent.getComponent(cc.Button).interactable = false;
            }
            else
            {
                lock.active = false;  
                item.node.parent.getComponent(cc.Button).interactable = true;

                var maxLevelNum = this._LevelUpDescObj[id].maxLevel;
                if (curLevelNum < maxLevelNum) {
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
                else
                {
                    hint.active = false;
                }
            }
        }        

        // 切换到选项1
        var btn = this.tabPage[tabIndex].getComponentInChildren(cc.Button);
        this.switchLevelUpItem({target:btn.node} , tabIndex * 8 + itemIndex);

        this.content[0].active = true;
        this.content[1].active = false;
    },

    onSwitchTabNoRefresh:function (event , tabIndex) {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.switchTabNoRefresh(event , tabIndex);
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

        this.content[0].active = true;
        this.content[1].active = true;

        var activityView = this.getComponentInChildren("VActivity");
        activityView.show();
    },

    // 播放选项动画
    playPageAnimation:function (page) {
        console.log("page" , page.childrenCount);
        for (let index = 0; index < page.childrenCount; index++) {
            var btn = page.children[index];
            var ani = btn.getComponent(cc.Animation);
            if (ani) {
                ani.play();
            }
        }
    },

    onSwitchLevelUpItem:function (event , index) {
        Global.Common.Audio.playEffect("btn1Click" , false);
        this.switchLevelUpItem(event , index);
    },

    // 切换选项
    switchLevelUpItem:function (event , index) {
        if (this._CurSelectedItem) {
            this._CurSelectedItem.interactable = true;
        }
        var curBtn = event.target.getComponent(cc.Button);
        this.selectedSprite.node.parent = curBtn.node.getChildByName("Selected");
        // curBtn.interactable = false;
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
        Global.Common.Audio.playEffect("btn2Click" , false);

        if (this.isLeveling) {
            return;
        }
        this.isLeveling = true;

        // 当前升级按钮回调
        var maxLevelNum = this._LevelUpDescObj[this._CurLevelUpIndex].maxLevel;
        var curLevelNum = Global.Model.Game.getLevelByItemID(this._CurLevelUpIndex);
        var nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + this._CurLevelUpIndex];

        Global.Common.Http.req("updateProperty" , {
            uuid:Global.Model.Game.uuid,
            propertyid:this._CurLevelUpIndex,
            level:curLevelNum+1,
            CurGold:Global.Model.Game.coins - nextLevelConsume,
        } , function (resp , url) {
            this.isLeveling = false;
            var result = parseInt(resp[0]);
            if (result != 0) {
                return;
            }

            // 减少金币
            Global.Model.Game.reduceCoins(nextLevelConsume);
            var curLevelNum = Global.Model.Game.levelUp(this._CurLevelUpIndex);
            var progress = this._CurSelectedItem.getComponentInChildren(cc.ProgressBar);
            progress.progress = curLevelNum / maxLevelNum;
            this.refreshTopBar();
            this.refresh();
        }.bind(this));
    },

    refresh:function () {
        var pageIndex = Math.floor(this._CurLevelUpIndex / 8);

        var page = this.tabPage[pageIndex];
        for (let index = 0; index < 8; index++) {
            var item = page.children[index];
            var id = pageIndex * 8 + index;
            // 显示提示
            var hint = item.getChildByName("Hint");
            hint = hint.getChildByName("Hint");
            var curLevelNum = Global.Model.Game.getLevelByItemID(id);
            if (curLevelNum < 0) {
                // 未开放
                hint.active = false;
            }
            else
            {
                var maxLevelNum = this._LevelUpDescObj[id].maxLevel;
                if (curLevelNum < maxLevelNum) {
                    var nextLevelConsume = this._LevelUpConsumeObj[curLevelNum]["levelupItem" + id];
                    if (Global.Model.Game.isEnoughCoins(nextLevelConsume)) {
                        hint.active = true;
                    }
                    else
                    {
                        hint.active = false;
                    }
                }
                else
                {
                    hint.active = false;
                }
            }
        }   
        this.switchContent(this._CurLevelUpIndex);
    },  

    refreshTopBar:function () {
        var topbar = this.getComponentInChildren("TopBar");
        topbar.refresh();
    },

    onRankBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var rankView = this.node.parent.getComponentInChildren("VRank");
        rankView.show();
    },

    onFriendBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var friendView = this.node.parent.getComponentInChildren("VFriend");
        friendView.show();
    },

    onLotteryBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        // var friendView = this.node.parent.getComponentInChildren("VLottery");
        // friendView.show();
    },

    onSetBtn:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        var setView = this.node.parent.getComponentInChildren("VSet");
        setView.show();
    },

    onOfflineBtn:function () {
        var offlineView = this.node.parent.getComponentInChildren("VOffline");
        offlineView.show();  
    },
});
