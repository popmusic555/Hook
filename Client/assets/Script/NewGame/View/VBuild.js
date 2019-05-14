
/**
 * 建筑
 * 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // 建筑资源
        buildRes:[cc.SpriteFrame],
        // 关卡ID
        passID:0,
        // 建筑资源ID列表
        _BulidResIDList:null,
        _GeneratedBuildID:0,
    },

    // onLoad () {},

    start () {
        this.passID = -1

        this._BulidResIDList = [];
        this._BulidResIDList[0] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,24,24,24,24];
        this._BulidResIDList[1] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,24,24,24,24];
        this._BulidResIDList[2] = [16,17,18,19,20,21,22,23,24,24];

        this._GeneratedBuildID = this.node.childrenCount - 1;
    },

    // update (dt) {},

    updateBuild:function (cameraX , cameraY) {
        // 更新关卡ID
        this._RefreshPassID();

        var distanceLeft = cameraX - cc.view.getVisibleSize().width * 0.5 - this.node.x;
        var distanceRight = cameraX + cc.view.getVisibleSize().width * 0.5 - this.node.x;

        // 回收建筑
        this.recoveryBuilding(distanceLeft);
        // 生成建筑
        this.generateBuilding(distanceRight);
    },

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    /**
     * 生成建筑
     *
     */
    generateBuilding:function (distance) {
        var lastBuilding = this.node.children[this.node.childrenCount-1];
        var lastBuildRightPos = lastBuilding.x + lastBuilding.width;
        if (distance < lastBuildRightPos) {
            return;
        }

        while (true) {
            var node = this.createBuilding();

            // 判断建筑是否生成在墙内
            if (Global.Model.MWall.isInside(lastBuildRightPos + node.width) || Global.Model.MWall.isInside(lastBuildRightPos)) {
                // 生成在墙体内 不显示贴图
                var sprite = node.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
            }

            this._GeneratedBuildID += 1;
            node.name = "Building" + this._GeneratedBuildID;
            node.x = lastBuildRightPos;
            node.y = 0;
            this.node.addChild(node);

            lastBuilding = node;
            lastBuildRightPos = lastBuilding.x + lastBuilding.width;
            if (lastBuildRightPos >= distance) {
                break;
            }
        }
    },

    createBuilding:function () {
        var node = new cc.Node();
        node.anchorX = 0;
        node.anchorY = 0;
        var sprite = node.addComponent(cc.Sprite);

        var buildResID = this._BulidResIDList[this.passID] || this._BulidResIDList[this._BulidResIDList.length-1];
        

        buildResID = buildResID[Global.Common.Utils.random(0 , buildResID.length-1)];

        var spriteFrame = this.buildRes[buildResID];
        sprite.spriteFrame = spriteFrame

        
        node.width = spriteFrame ? spriteFrame.getRect().width : 340;
        node.height = spriteFrame ? spriteFrame.getRect().height : 100;

        return node;
    },

    /**
     * 回收建筑
     *
     */
    recoveryBuilding:function (distance) {
        var count = this.node.childrenCount;
        for (let index = 0; index < count; index++) {
            var node = this.node.children[index];
            var nodeRight = node.x + node.width;
            if (nodeRight <= distance) {
                node.destroy();
            }
        }
    },


    _RefreshPassID:function () {
        var passID = Global.Model.MWall.getPassID();
        if (passID > this.passID) {
            this.refreshByPassID(passID);
        }
    },

    /**
     * 根据关卡ID刷新
     *
     * @param {*} passID 关卡ID
     */
    refreshByPassID:function (passID) {
        this.setPassID(passID);
        console.log("VBuild refreshByPassID");
    },
});
