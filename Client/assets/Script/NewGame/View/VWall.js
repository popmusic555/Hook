
var GWall = require("GO_Wall");

/**
 * 墙体
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        // 墙体预制
        wallPrefab:cc.Prefab,
        // 前景墙预制
        fgWallPrefab:cc.Prefab,
        // 前景墙节点
        fgWallNode:cc.Node,
        // 关卡ID
        passID:0,

        _GeneratedPassID:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.passID = -1;
        this._GeneratedPassID = -1;
    },

    // update (dt) {},
    updateWall:function (cameraX , cameraY) {
        // 更新关卡ID
        this._RefreshPassID();
        var distanceLeft = cameraX - cc.view.getVisibleSize().width * 0.5 - this.node.x;
        var distanceRight = cameraX + cc.view.getVisibleSize().width * 0.5 - this.node.x;

        // 回收建筑
        this.recoveryWall(distanceLeft);
        // 生成建筑
        this.generateWall(distanceRight);
    },

    /**
     * 生成墙体
     *
     */
    generateWall:function (distance) {
        var wallPosx = Global.Model.MWall.getPosXByPassID(this.passID);
        // if (wallPosx > distance) {
        //     return;
        // }

        if (this._GeneratedPassID >= this.passID) {
            return;
        }

        var wallNode = this.createWall();
        this._GeneratedPassID = this.passID;
        wallNode.name = "Wall" + this._GeneratedPassID;
        wallNode.x = wallPosx;
        wallNode.y = 0;
        this.node.addChild(wallNode);

        var gWall = wallNode.getComponent(GWall);
        gWall.setPassID(Global.Model.MWall.getPassID());

        var fgWallNode = this.createFgWall();
        fgWallNode.name = "FgWall" + this._GeneratedPassID;
        fgWallNode.x = wallPosx;
        fgWallNode.y = 0;
        this.fgWallNode.addChild(fgWallNode);

    },

    createWall:function () {
        var wall = cc.instantiate(this.wallPrefab);
        return wall;
    },

    createFgWall:function () {
        var wall = cc.instantiate(this.fgWallPrefab);
        return wall;
    },

    /**
     * 回收墙体
     *
     */
    recoveryWall:function (distance) {
        var count = this.node.childrenCount;
        for (let index = 0; index < count; index++) {
            var node = this.node.children[index];
            var nodeRight = node.x + Global.Model.MWall.attr.width;
            if (nodeRight <= distance) {
                node.destroy();
            }
        }
    },

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
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
    },
});
