var DataManager = require("DataManager");

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
        // 更新关卡序号
        var passId = DataManager.Userdata.getPassID();
        var wallPosx = DataManager.Userdata.getWallPosByPassID(passId);

        var curCameraPosx = cc.Camera.main.node.x;
        var leftCameraPosx = curCameraPosx - cc.view.getVisibleSize().width * 0.5;
        if (leftCameraPosx >= wallPosx + 100) {
            this.nextPass();
        }
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

    // update (dt) {},
});
