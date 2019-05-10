
// 天空盒子

cc.Class({
    extends: cc.Component,

    properties: {
        // 地图资源
        mapRes:[cc.SpriteFrame],
        // 关卡ID
        passID:0,
        // 速度
        velocity:cc.Vec2.ZERO,
        // 地块下标
        index:0,
        // 地块大小
        tiledSize:cc.Size.ZERO,
    },

    // onLoad () {},

    start () {
        this.tiledSize.width = this.tiledSize.width / (1-this.velocity.x);
    },

    /**
     * 设置地块下标
     * 
     * @param {any} index 
     */
    setIndex:function (index) {
        if (index > this.index) {
            this.next(index);
        }
    },

    /**
     * 获取地块下标
     * 
     * @returns 获取地块下标
     */
    getIndex:function () {
        return this.index;
    },

    /**
     * 下一块地图
     * 
     */
    next:function (index) {
        this.index = index;
    },

    /**
     * 刷新
     * 
     * @param {any} xDistance 摄像机左边界与地图之间的距离
     * @param {any} yDistance 摄像机下边界与地图之间的距离
     */
    refresh:function (xDistance , yDistance) {
        var index = Math.floor(xDistance / this.tiledSize.width);
        this.setIndex(index);
        // 重置地图的位置
        this.node.x = this.tiledSize.width * index + (xDistance - index * this.tiledSize.width) * this.velocity.x;
        this.node.y = yDistance * this.velocity.y;
    },

    /**
     * 根据关卡ID刷新
     * 
     * @param {any} passID 关卡ID
     */
    refreshByPassID:function (passID) {
        this.passID = passID;
        if (this.passID > 2) {
            this.passID = 2;
        }
        // 更新新的地图资源
        // 更新地块的贴图
    }
});
