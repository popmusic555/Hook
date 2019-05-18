
cc.Class({
    extends: cc.Component,

    properties: {
        // 最大数量
        max:0,
        // 范围
        range:0,
        // 间隔
        interval:0,
        // 开始生成
        startGenerate:0,
        // 生成概率
        generateRate:0,

        // 当前帧数
        _CurFrame:0,
    },

    // onLoad () {},

    start () {
        this._CurFrame = -1;
    },

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    refreshByPassID:function (passID) {
        this.setPassID(passID);
        console.log(this.node.name , " refreshByPassID" , passID);
    },

    // update (dt) {},

    updateMonster:function (cameraLeft , cameraRight) {
        this._UpdateFrame();

        this.recoveryMonster(cameraLeft);
        if (this._CurFrame == 0) {
            var num = Global.Common.Utils.random(1 , 100);
            if (num <= this.generateRate) {
                this.generateMonster(this.node , this.max , cameraRight , this.range);        
            }
        }
    },

    _UpdateFrame:function () {
        this._CurFrame++;
        if (this._CurFrame > this.interval) {
            this._CurFrame = 0;
        }
    },

    recoveryMonster:function (distance) {
        
    },

    generateMonster:function (parent , maxNum , origin , range) {
        
    },
});
