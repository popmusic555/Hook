
// 云背景

cc.Class({
    extends: cc.Component,

    properties: {
        // 关卡ID
        passID:0,
        tiled:[cc.Node],
        // 速度
        velocity:cc.Vec2.ZERO,
        // 地块下标
        index:0,
        // 地块大小
        tiledSize:cc.Size.ZERO,
        _TiledSize:cc.Size.ZERO,
    },

    // onLoad () {},

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    start () {
        this._TiledSize.width = this.tiledSize.width / (1-this.velocity.x);
    },

    /**
     * 设置地块下标
     * 
     * @param {any} index 
     */
    _SetIndex:function (index) {
        if (index > this.index) {
            this.next(index);
        }
    },

    /**
     * 获取地块下标
     * 
     * @returns 获取地块下标
     */
    _GetIndex:function () {
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
     * 随机获取一个地图资源
     * 
     */
    getMapRes4Random:function () {
        var index = Global.Common.Utils.random(0 , 2) + 3 * (this.passID % 3);
        return this.mapRes[index];
    },

    /**
     * 刷新
     * 
     * @param {any} xDistance 摄像机左边界与地图之间的距离
     * @param {any} yDistance 摄像机下边界与地图之间的距离
     */
    refresh:function (xDistance , yDistance) {
        var index = Math.floor(xDistance / this._TiledSize.width);
        this._SetIndex(index);
        // 重置地图的位置
        this.node.x = this._TiledSize.width * index + (xDistance - index * this._TiledSize.width) * this.velocity.x;
        this.node.y = yDistance * this.velocity.y;
    },

    /**
     * 根据关卡ID刷新
     * 
     * @param {any} passID 关卡ID
     */
    refreshByPassID:function (passID) {
        this.setPassID(passID);
        // 更新新的地图资源
        // 更新地块的贴图
        var num = passID % 3;
        if (num == 2) {
            this.velocity.x = 0.7;
            this._TiledSize.width = this.tiledSize.width / (1-this.velocity.x);
        }
        else
        {
            this.velocity.x = 0.6;
            this._TiledSize.width = this.tiledSize.width / (1-this.velocity.x);
        }

        var len = this.tiled.length;
        for (let index = 0; index < len; index++) {
            var tiled = this.tiled[index];
            tiled.active = false;
        }
        this.tiled[num].active = true;
    }
});
