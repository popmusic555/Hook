
var GameConst = require("GameConst");

// 建筑生成器
cc.Class({
    extends: cc.Component,

    properties: {
        camera:cc.Node,

        _Index:-1,

        bulidingRes:[cc.SpriteFrame],

        tmpBuilding:cc.Node,
        // 墙体预制
        wallPrefabs:cc.Prefab,
        // 前景墙体
        wallForegroundPrefabs:cc.Prefab,

        // 起始生成点
        startPosx:{
            default:0,
            visible:false,
        },
        // 生成范围
        generateRange:{
            default:0,
            visible:false,
        },
        // 最小生成数量
        generateMinNum:0,
        // 最大生成数量
        generateMaxNum:0,

        // 墙体生成的位置
        wallCreatePosX:-1,
    },

    // onLoad () {},

    start () {
        // this.camera = cc.find("Canvas/MainCamera");
        this.startPosx = 0 - cc.view.getVisibleSize().width * 0.5;
        this.generateRange = 2500;
        this._Index = -1;

        this.generateBuilding();
    },

    update (dt) {
        // var posx = this.camera.x - cc.view.getVisibleSize().width * 0.5;
        // // 距离其实点的距离
        // var distance = posx - this.startPosx;

        // if (distance < 0) {
        //     return;
        // }

        // var index = Math.floor(distance / this.generateRange);
        // this.generate(index);
        this.removeBuilding();
        this.generateBuilding();
    },

    generateBuilding:function () {
        var posx = this.camera.x - cc.view.getVisibleSize().width * 0.5;
        // 距离起始点的距离
        var distance = posx - this.startPosx;

        var index = Math.floor(distance / this.generateRange);
        this.generate(index);
    },

    generate:function (index) {
        if (index <= this._Index) {
            return;
        }
        this._Index = index;
        if ((this._Index + 1) % GameConst.CREATE_WALL == 0) {
            this.createWall();
        }
        else
        {
            this.createBuilding();
        }
    },

    createBuilding:function () {
        // 预生成建筑物
        var index = this._Index + 1;
        var curPosx = index * this.generateRange;
        var num = GameConst.GET_RANDOM(this.generateMinNum , this.generateMaxNum);
        var range = this.generateRange / num;
        var posx = 0;
        var building = null;

        for (let index = 0; index < num; index++) {
            posx = curPosx + GameConst.GET_RANDOM(0 , range) + index * range;
            building = this.createSingleBuilding("building" , posx);
            this.node.insertChild(building , 0);
        }
    },

    createSingleBuilding:function (buildingName , posx) {
        var node = new cc.Node(buildingName);
        node.x = posx;
        node.y = 0;
        node.anchorX = 0;
        node.anchorY = 0;
        var sprite = node.addComponent(cc.Sprite);

        var index = GameConst.GET_RANDOM(0 , 3);
        sprite.spriteFrame = this.bulidingRes[index];

        return node;
    },

    createWall:function () {
        var wall = cc.instantiate(this.wallPrefabs);

        var index = this._Index + 1;
        var curPosx = index * this.generateRange;

        wall.x = curPosx;
        wall.y = 0;

        this.wallCreatePosX = curPosx;
        console.log("aaaaaaaaaaaaaaaaaaaaa" , this.wallCreatePosX);

        this.node.addChild(wall);

        this.createForegroundWall();
    },

    createForegroundWall:function () {
        var wallForeground = cc.instantiate(this.wallForegroundPrefabs);

        var index = this._Index + 1;
        var curPosx = index * this.generateRange;

        wallForeground.x = curPosx
        wallForeground.y = 0;

        this.tmpBuilding.addChild(wallForeground);
    },

    // 删除建筑
    removeBuilding:function () {
        var len = this.node.childrenCount;
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));

            var pos = cc.Camera.main.getWorldToCameraPoint(worldPos);

            if (pos.x <= -this.generateRange) {
                childNode.destroy();
            }
        }

        var len = this.tmpBuilding.childrenCount;
        for (let index = 0; index < len; index++) {
            var childNode = this.tmpBuilding.children[index];
            var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));

            var pos = cc.Camera.main.getWorldToCameraPoint(worldPos);

            if (pos.x <= -this.generateRange) {
                childNode.destroy();
            }
        }
    },
});
