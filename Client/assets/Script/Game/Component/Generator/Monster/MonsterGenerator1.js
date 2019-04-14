
var GameCommon = require("GameCommon");
var DataManager = require("DataManager");
var MPlayer = require("MPlayer");

// 怪物生成器
cc.Class({
    extends: cc.Component,

    properties: {
        // 怪物预制
        monsterPrefabs:cc.Prefab,
        monsterPrefabs1:cc.Node,
        // player
        player:MPlayer,

        // 怪物名称
        monsterName:"",

        // 最大数量
        maxNum:0,

        // 刷新间隔
        refreshInterval:0,

        // 刷新数量
        refreshNum:cc.Vec2,

        // X轴偏移值
        xOffset:cc.Vec2,
        // Y轴偏移值     
        yOffset:cc.Vec2,   
        // 速度偏移值
        speedOffset:cc.Vec2,

        // 出生点偏移值位置
        _BrithPosOffset:0,

        // 可超出最大范围
        maxRange:{
            default:0,
            visible:false,
        },

        // 怪物总数量
        _TotalMonsterNum:0,
        // 当前刷新帧
        _CurRefFrame:0,

        // 初始发射速度
        _LaunchingSpeed:0,
    },

    // onLoad () {},

    start () {
        this.maxRange = 1000;
        this._BrithPosOffset = 850;
        this._LaunchingSpeed = DataManager.Userdata.launchingSpeed;
        // this.createMonster();
    },

    update (dt) {
        if (!this.player.isLaunching) {
            return;
        }
        this.RemoveMonster();
        if (this._LaunchingSpeed != 0) {
            this.GenerateMonster(this._LaunchingSpeed);
            this._LaunchingSpeed = 0;
        }
        else
        {
            this.GenerateMonster(this.player.getLinearVelocity().x);  
        }
    },

    GenerateMonster:function (playerSpeed) {
        this._CurRefFrame++;
        if (this._CurRefFrame >= this.refreshInterval) {
            this._CurRefFrame = 0;
            this.createMonster(playerSpeed);
        }
    },

    createMonster:function (playerSpeed) {
        // new cc.Node().childrenCount
        var canCreateNum = this.maxNum - this.node.childrenCount;
        if (canCreateNum <= 0) {
            return;
        }

        var refreshNum = GameCommon.GET_RANDOM(this.refreshNum.x , this.refreshNum.y)
        canCreateNum = Math.min(canCreateNum , refreshNum);

        var cameraX = cc.Camera.main.node.x;
        var brithPosX = cameraX + this._BrithPosOffset;  //+ GameCommon.GET_RANDOM(xOffset.x , xOffset.y);
        var num = 20;
        for (let index = 0; index < canCreateNum; index++) {
            var posX = brithPosX + GameCommon.GET_RANDOM(this.xOffset.x , this.xOffset.y);
            if (GameCommon.IS_IN_WALL(posX)) {
                return;
            }

            var speedOffset = (this.speedOffset.y - this.speedOffset.x) / num * GameCommon.GET_RANDOM(0 , num) + this.speedOffset.x;
            var speed = playerSpeed - speedOffset;
            // var speed = playerSpeed * Math.random() * 0.5 + 0.2;

            var monster = this.createSingleMonster(this.getMonsterName() , posX , speed);            
            this.node.addChild(monster);
        }
    },

    createSingleMonster:function (name , posX , speed) {
        var monsterNode = cc.instantiate(this.monsterPrefabs);
        monsterNode.name = name;
        monsterNode.x = posX;
        monsterNode.y = monsterNode.y + GameCommon.GET_RANDOM(this.yOffset.x , this.yOffset.y);
        var rigid = monsterNode.getComponent(cc.RigidBody);
        rigid.linearVelocity = cc.v2(speed , 0);

        this._TotalMonsterNum++;
        return monsterNode;
    },

    // 删除怪物
    RemoveMonster:function () {
        var len = this.node.childrenCount;
        // console.log("当前" , this.node.name , "列表" , "怪物数量" , len);
        var posx = cc.Camera.main.node.x;
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            // var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));
            
            if (posx - childNode.x > this.maxRange) {
                childNode.destroy();
            }
            
            if (childNode.x - posx >= this._BrithPosOffset + this.xOffset.y) {
                childNode.destroy();
            }
        }
    },

    getMonsterName:function () {
        return this.monsterName + this._TotalMonsterNum;
    },

});
