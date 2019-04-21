
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");
var GameCommon = require("GameCommon");

cc.Class({
    extends: GameObject,

    properties: {
        // 怪物优先级
        priority:0,

        // Player跟随
        _FollowPlayer:null,
        // 碰撞到Floor时运算的数据
        _FloorData:null,
        // 碰撞到Player时运算的数据
        _PlayerData:null,
        // 第一次同步跟随
        _FirstSyncFollow:false,
        // 最后一次同步
        _LastSyncFollwo:false,
        // 控制人 此属性只有在载具类怪物中使用
        _Controller:null,
    },

    onLoad () {
        this._super();
    },

    start () {
        this._super();
        this._FloorData = this.getComponent("FloorData");
        this._PlayerData = this.getComponent("PlayerData");
    },

    lateUpdate (dt) {
        this._super(dt);
        // 更新跟随
        if (this.isFristSyncFollow()) {
            this.fristUpdateFollow();
        }
        if (this.isLastSyncFollow()) {
            this.lastUpdateFollow();
        }
        this.updateFollow();
    },

    getPriority:function () {
        return this.priority;  
    },

    // 设置跟随的Player
    setFollowPlayer:function (player) {
        this._FollowPlayer = player;
        this._FirstSyncFollow = true;
    },

    // 获取跟随的Player
    getFollowPlayer:function () {
        return this._FollowPlayer;
    },

    // 取消跟随的Player
    unSetFollowPlayer:function () {
        this._FollowPlayer = null;
        this._LastSyncFollwo = true;
    },

    // 是否有跟随的Player
    isHavePlayer:function () {
        if (this.getFollowPlayer()) {
            return true;
        }
        return false;
    },

    // 是否第一次跟随
    isFristSyncFollow:function () {
        return this._FirstSyncFollow;
    },

    isLastSyncFollow:function () {
        return this._LastSyncFollwo;
    },

    // 地板数据
    getFloorData:function () {
        return this._FloorData;
    },

    // 怪物数据
    getPlayerData:function () {
        return this._PlayerData;
    },

    fristUpdateFollow:function () {
        this._FirstSyncFollow = false;
        if (!this.isHavePlayer()) {
            return;
        }
        var player = this.getFollowPlayer();
        this.SyncPosition(player);
    },

    lastUpdateFollow:function () {
        this._LastSyncFollwo = false;  
        this.setAngularVelocity(0);
        this.node.rotation = 0;
    },

    updateFollow:function () {
        if (!this.isHavePlayer()) {
            return;
        }
        var player = this.getFollowPlayer();
        player.SyncPosition(this);
        player.SyncLinearVelocity(this);
    },

    // 开启控制
    turnOnControl:function (player) {
        this._Controller = player;
        var uiview = GameCommon.GetUIView();
        uiview.setTouchListener(this);
        this.setFollowPlayer(player);
        this.SyncLinearVelocity(player);
    },

    // 取消控制
    turnOffControl:function () {
        var uiview = GameCommon.GetUIView();
        if (this._Controller) {
            uiview.setTouchListener(this._Controller);
            this._Controller = null;
            this.unSetFollowPlayer();
        }
    },

    // 获取控制者
    getController:function () {
        return this._Controller;
    },

    onCollision:function (contact , selfGameObj , otherGameObj) {
        // 碰撞不同类型的游戏物体触发不同的逻辑
        switch (otherGameObj.ObjectType) {
            // 当前碰撞到Floor
            case GameEnum.GAMEOBJ_TYPE.FLOOR:
                if (selfGameObj.canFloor) {
                    console.log(selfGameObj.node.name , "碰撞Floor" , otherGameObj.node.name);
                    this.onFloor(contact , selfGameObj , otherGameObj);
                }
                break;
            // 当前碰撞到Monster
            case GameEnum.GAMEOBJ_TYPE.MONSTER:
                contact.disabled = true;
                if (selfGameObj.canMonster) {
                    console.log(selfGameObj.node.name , "碰撞Monster" , otherGameObj.node.name);
                    this.onMonster(contact , selfGameObj , otherGameObj);
                }
                break;
            // 当前碰撞到Player
            case GameEnum.GAMEOBJ_TYPE.PLAYER:
                contact.disabled = true;
                if (selfGameObj.canPlayer) {
                    console.log(selfGameObj.node.name , "碰撞Player" , otherGameObj.node.name);
                    this.onPlayer(contact , selfGameObj , otherGameObj);
                }
                break;
        }
    },

    onFloor:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            contact.disabled = true;
            console.log("休眠后不处理任何逻辑");
            return;
        }
        // 向上运动时屏蔽碰撞逻辑
        if (other.riseIgnore && self.getLinearVelocity().y > 0) {
            contact.disabled = true;
            console.log("向上运动时屏蔽碰撞逻辑");
            return;
        }
        this.handleFloor(self , other);
    },

    handleFloor:function (self , other) {

    },

    onMonster:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Monster");
            return;
        }
        // 向上运动时屏蔽碰撞逻辑
        if (other.riseIgnore && self.getLinearVelocity().y > 0) {
            console.log("向上运动时屏蔽碰撞逻辑Monster");
            return;
        }
        this.handleMonster(self , other);
    },

    handleMonster:function (self , other) {

    },

    onPlayer:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Player");
            return;
        }
        // 向上运动时屏蔽碰撞逻辑
        if (self.riseIgnore && other.getLinearVelocity().y > 0) {
            console.log("向上运动时屏蔽碰撞逻辑Player");
            return;
        }
        // 人物死亡时不处理任何逻辑
        if (other.isDeath()) {
            return;
        }

        this.handlePlayer(self , other);
    },

    handlePlayer:function (self , other) {

    },

    beKill:function (gameObject , dontAni) {

    },
    
    // 切换控制失败
    onControlFail:function (monster) {
        this.beKill(monster);
    },

    onTouched:function () {

    },
});
