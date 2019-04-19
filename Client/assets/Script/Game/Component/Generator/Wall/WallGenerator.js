var DataManager = require("DataManager");
var GameCommon = require("GameCommon");

cc.Class({
    extends: cc.Component,

    properties: {
        // 背景墙体预制
        backgroundWall:cc.Prefab,
        backgroundWallList:cc.Node,

        foregroundWall:cc.Prefab,
        foregroundWallList:cc.Node,

        // 关卡序号
        passId:-1,
    },

    // onLoad () {},

    start () {
        this.setPassID(0);
    },

    update (dt) {
        this.RemoveWall();
        // 更新关卡序号
        this.updatePassID();
    },

    /**
     * 设置关卡序号
     * 
     * @param {any} passId 
     */
    setPassID:function (passId) {
        if (this.passId == passId) {
            return;
        }
        this.passId = passId;
        DataManager.Userdata.setPassID(this.passId);
        this.GeneratorWallByPassID(this.passId);
    },
    /**
     * 开启下一关
     * 
     */
    nextPass:function () {
        this.setPassID(this.passId+1);
        GameCommon.GetMapManager().refreshMapByPassID(this.passId);
    },
    /**
     * 根据PassID生成墙体
     * 
     * @param {any} passId 
     */
    GeneratorWallByPassID:function (passId) {
        var pos = DataManager.Userdata.getWallPosByPassID(passId);
        var wall = cc.instantiate(this.backgroundWall);
        wall.x = pos;
        this.backgroundWallList.addChild(wall);

        var wallForeground = cc.instantiate(this.foregroundWall);
        wallForeground.x = pos;
        this.foregroundWallList.addChild(wallForeground);
    }, 

    updatePassID:function () {
        var passId = DataManager.Userdata.getPassID();
        var wallPosx = DataManager.Userdata.getWallPosByPassID(passId);

        var curCameraPosx = cc.Camera.main.node.x;
        var leftCameraPosx = curCameraPosx - cc.view.getVisibleSize().width * 0.5;
        if (leftCameraPosx >= wallPosx + 100) {
            this.nextPass();
        }  
    },

    RemoveWall:function () {
        var curCameraPosx = cc.Camera.main.node.x;
        var len = this.backgroundWallList.childrenCount;
        for (let index = 0; index < len; index++) {
            var itemNode = this.backgroundWallList.children[index];
            if (curCameraPosx - itemNode.x > 3000) {
                itemNode.destroy();
            }
        }

        var len = this.foregroundWallList.childrenCount;
        for (let index = 0; index < len; index++) {
            var itemNode = this.foregroundWallList.children[index];
            if (curCameraPosx - itemNode.x > 3000) {
                itemNode.destroy();
            }
        }
    },

    // update (dt) {},
});
