
var GameCommon = require("GameCommon");
var GameConst = require("GameConst");
var DataManager = require("DataManager");

// 建筑生成器
cc.Class({
    extends: cc.Component,

    properties: {
        camera:cc.Node,
        bulidingRes0:[cc.SpriteFrame],
        bulidingRes1:[cc.SpriteFrame],
        bulidingRes2:[cc.SpriteFrame],
        // 前景墙体
        wallForeground:cc.Prefab,
        // 背景墙体
        wallBackground:cc.Prefab,

        // 生成范围
        generateRange:0,

        // 当前地图索引
        _CurIndex:-1,
        // 偏移量
        _StartOffset:0,
        // 建筑总数量
        _TotalBuildingNum:0,
    },

    // onLoad () {},

    start () {
        var cameraPosX = cc.Camera.main.node.x;
        var index = this.updateIndex(cameraPosX , this.generateRange);
        this.GenerateBuilding(index , this.generateRange);
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

        var cameraPosX = cc.Camera.main.node.x;
        var index = this.updateIndex(cameraPosX , this.generateRange);

        this.RemoveBuilding();
        this.GenerateBuilding(index , this.generateRange);
        
    },
    /**
     * 更新索引
     * 
     */
    updateIndex:function (cameraPosX , generateRange) {
        var index = Math.floor(cameraPosX / generateRange);
        if (index > this._CurIndex) {
            this._CurIndex = index;
            return this._CurIndex;
        }
        else
        {
            return null;
        }
    },
    /**
     * 生成建筑
     * 
     */
    GenerateBuilding:function (index , generateRange) {
        if (index == null) {
            return;
        }
        // 生成下一地图建筑
        index = index + 1;
        // console.log("createMap for index " , index , this._StartOffset);
        var startPosX = index * generateRange - cc.view.getVisibleSize().width * 0.5;
        this.Generate(startPosX , this._StartOffset , generateRange);
    },
    /**
     * 生成函数
     * 
     * @param {any} startPosX 起始位置
     * @param {any} startOffset 起始位置偏移
     * @param {any} generateRange 生成范围
     */
    Generate:function (startPosX , startOffset , generateRange) {
        this.createBuilding(startPosX , startOffset , generateRange);
    },
    /**
     * 创建建筑
     * 
     * @param {any} startPosX 生成的起始点
     * @param {any} startOffset 起始点的偏移
     * @param {any} generateRange 生成范围
     */
    createBuilding:function (startPosX , startOffset , generateRange) {
        var posX = startPosX + startOffset;

        var flag = true;
        while (flag) {
            if (posX >= startPosX + generateRange) {
                flag = false;
                this._StartOffset = posX - (startPosX + generateRange);
            }
            else
            {
                var width = this.createSingleBuilding("building" + this._TotalBuildingNum , posX);
                posX = posX + width;
            }
        }
    },
    /**
     * 创建单个建筑
     * 
     * @param {any} buildingName 名称
     * @param {any} posx X轴坐标
     * @returns 
     */
    createSingleBuilding:function (buildingName , posx) {
        var passId = DataManager.Userdata.getPassID();
        if (GameCommon.isRightWall(posx)) {
            // 在墙右侧
            passId = passId + 1;
        }

        var buildingRes = this["bulidingRes" + (passId % 3)];

        var index = GameCommon.GET_RANDOM(0, buildingRes.length - 1);
        var spf = buildingRes[index];
        var width = 300;
        var height = 0; 
        if (spf) {
            width = spf.getRect().width;
            height = spf.getRect().height;
        }
        else
        {
            return width;
        }

        if (!GameCommon.isInWall(posx) && !GameCommon.isInWall(posx + width)) {
            var node = new cc.Node(buildingName);
            node.x = posx;
            node.y = 0;
            node.anchorX = 0;
            node.anchorY = 0;
            node.width = width;
            node.height = height;
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spf
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.node.addChild(node);          
            this._TotalBuildingNum++;
        }
   
        return width;
    },

    // 删除建筑
    RemoveBuilding:function () {
        var len = this.node.childrenCount;
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            var worldPos = childNode.convertToWorldSpaceAR(cc.v2(0,0));
            var pos = cc.Camera.main.getWorldToCameraPoint(worldPos);
            if (pos.x <= -600) {
                childNode.destroy();
            }
        }
    },
});
