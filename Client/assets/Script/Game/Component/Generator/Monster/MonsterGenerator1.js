
var GameConst = require("GameConst");

// 怪物生成器
cc.Class({
    extends: cc.Component,

    properties: {
        camera:cc.Node,

        _Index:-1,

        // 起始位置
        startPosx:{
            default:0,
            visible:false,
        },

        player:cc.Node,

        // 怪物预制
        monsterPrefabs:cc.Prefab,

        // 生成概率
        probability:0,

        // 生成范围
        generateRange:{
            default:0,
            visible:false,
        },

        // 最小生成数量
        generateMinNum:0,
        // 最大生成数量
        generateMaxNum:0,

        // 怪物总数量
        _TotalMonsterNum:0,
        // 怪物名称
        monsterName:"",
    },

    // onLoad () {},

    start () {
        // this.camera = cc.find("Canvas/MainCamera");
        this.startPosx = 0 - cc.view.getVisibleSize().width * 0.5;
        this.generateRange = 2500;

        this.generateMonster();
    },

    update (dt) {
        // 初始生成怪物
        this.generateMonster();
        this.removeMonster();
    },

    generateMonster:function () {
        var posx = this.camera.x - cc.view.getVisibleSize().width * 0.5;
        // 距离其实点的距离
        var distance = posx - this.startPosx;

        var index = Math.floor(distance / this.generateRange);
        this.generate(index);
    },

    generate:function (index) {
        if (this._Index >= index) {
            return
        }
        this._Index = index;

        if ((this._Index + 1) % GameConst.CREATE_WALL == 0) {
        }
        else
        {
            console.newlog("当前" , this.node.name , "列表" , "怪物数量" , this.node.childrenCount);
            this.createMonster();
        }
    },

    createMonster:function () {
        // 预生成怪物
        var num = GameConst.GET_RANDOM(1 , 100)
        
        if (num > this.probability) {
            return;
        }

        var index = this._Index + 1;
        var curPosx = index * this.generateRange;
        var num = GameConst.GET_RANDOM(this.generateMinNum , this.generateMaxNum);
        console.log("生成怪物数量" , num);


        for (let index = 0; index < num; index++) {
            var posx = curPosx + GameConst.GET_RANDOM(0 , this.generateRange);
            var monster = this.createSingleMonster(this.monsterName , posx);
            this.node.addChild(monster);
        }
    },

    createSingleMonster:function (monsterName , posx) {
        this._TotalMonsterNum++;
        var node = cc.instantiate(this.monsterPrefabs);
        node.name = monsterName + this._TotalMonsterNum;
        node.x = posx;

        var rigid = node.getComponent(cc.RigidBody);
        var rigidPlayer = this.player.getComponent(cc.RigidBody);

        rigid.linearVelocity = cc.v2(rigidPlayer.linearVelocity.x * GameConst.GET_RANDOM(2 , 10) / 10 , 0);

        return node;
    },

    // 删除怪物
    removeMonster:function () {
        var len = this.node.childrenCount;
        // console.log("当前" , this.node.name , "列表" , "怪物数量" , len);
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            // var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));
            var posx = cc.Camera.main.node.x;
            if (posx - childNode.x > 1000) {
                childNode.destroy();
            }
        }
    },
});
