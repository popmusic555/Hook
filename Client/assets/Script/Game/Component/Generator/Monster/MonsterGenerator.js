
var GameConst = require("GameConst");

// 怪物生成器
cc.Class({
    extends: cc.Component,
    
    properties: {
        // 怪物预制
        monsterPrefabs:cc.Prefab,
        // player
        player:cc.RigidBody,

        // 最大数量
        maxNum:0,
        // 每次生成最小数量
        minGeneratorNum:0,
        // 每次生成最大数量
        maxGeneratorNum:0,

        // 最小高度值
        minHeight:0,
        // 最大高度值
        maxHeight:0,

        // 相对速度值
        relativeSpeed:0,

        // 可超出最大范围
        maxRange:{
            default:0,
            visible:false,
        },

        // 刷新间隔
        refreshInterval:0,

        // 怪物名称
        monsterName:"",

        // 怪物总数量
        _TotalMonsterNum:0,

        _CurRefFrame:0,

        // 怪物数量
        monsterNum:0,
        monsterNumVar:0,
    },

    // onLoad () {},

    start () {
        this.maxRange = 1000;
    },

    update (dt) {
        this.RemoveMonster();
        this.GenerateMonster();   
    },

    GenerateMonster:function () {
        this._CurRefFrame++;
        if (this._CurRefFrame >= this.refreshInterval) {
            this._CurRefFrame = 0;
            this.createMonster(this.minGeneratorNum , this.maxGeneratorNum);
        }
    },

    createMonster:function (min , max) {
        var monsterNum = GameConst.GET_RANDOM(min , max);
        // new cc.Node().childrenCount
        var canCreateNum = this.maxNum - this.node.childrenCount;

        if (canCreateNum <= 0) {
            return;
        }
        canCreateNum = Math.min(monsterNum , canCreateNum);

        var cameraX = cc.Camera.main.node.x;
        var posx = cameraX + 1400;

        if (GameConst.IS_IN_WALL(posx)) {
            return;
        }

        for (let index = 0; index < canCreateNum; index++) {

            var relativeSpeed = (Math.random() * 0.5 + 0.1);
            if (this.relativeSpeed != 0) {
                relativeSpeed = this.relativeSpeed;
            }
            var speed = relativeSpeed * this.player.linearVelocity.x;

            var monster = this.createSingleMonster(this.getMonsterName() , posx , speed);            

            this.node.addChild(monster);
        }
    },

    createSingleMonster:function (name , x , speed) {
        var monsterNode = cc.instantiate(this.monsterPrefabs);
        monsterNode.name = name;
        monsterNode.x = x;
        monsterNode.y = monsterNode.y + GameConst.GET_RANDOM(this.minHeight , this.maxHeight);
        var rigid = monsterNode.getComponent(cc.RigidBody);
        rigid.linearVelocity = cc.v2(speed , 0);

        this._TotalMonsterNum++;
        return monsterNode;
    },

    // 删除怪物
    RemoveMonster:function () {
        var len = this.node.childrenCount;
        // console.log("当前" , this.node.name , "列表" , "怪物数量" , len);
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            // var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));
            var posx = cc.Camera.main.node.x;
            if (posx - childNode.x > this.maxRange) {
                childNode.destroy();
            }
        }
    },

    getMonsterName:function () {
        return this.monsterName + this._TotalMonsterNum;
    },
});
