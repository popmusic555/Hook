
cc.Class({
    extends: cc.Component,

    properties: {
        speedRatioX:0,
        speedRatioY:0,

        refreshDis:0,

        _ChangeNum:0,

        _MapIndex:-1,
    },

    // onLoad () {},

    start () {
        this._ChangeNum = this.refreshDis / (1-this.speedRatioX);
        // console.log("_ChangeNum" , this.node.name , this._ChangeNum);
    },

    // update (dt) {},

    updateMap:function (displacementX , displacementY) {
        // console.log("displacementX , displacementY" , displacementX , displacementY);
        var mapIndex = Math.floor(displacementX / this._ChangeNum);
        // console.log(this.node.name , displacementX / this._ChangeNum , displacementX , this._ChangeNum);
        this.node.x = mapIndex * this._ChangeNum + this.updateDisplacement(displacementX % this._ChangeNum , this.speedRatioX);  
        this.node.y = this.updateDisplacement(displacementY , this.speedRatioY);
        // console.log("this.node.x , this.node.y" , this.node.x , this.node.y , this.node.name);
        this.setMapIndex(mapIndex);
    },

    // 生成新地图
    createNewMap:function (mapIndex) {
        
    },

    // 设置地图下标
    setMapIndex:function (mapIndex) {
        if (mapIndex <= this._MapIndex) {
            return;
        }
        this._MapIndex = mapIndex;
        // 生成新地图
        this.createNewMap(this._MapIndex);
    },

    // 获取地图下标
    getMapIndex:function () {
        return this._MapIndex;
    },

    updateDisplacement:function (displacement , speedRatio) {
        return displacement * speedRatio;
    },
});
