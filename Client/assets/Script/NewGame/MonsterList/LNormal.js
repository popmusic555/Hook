
var LBase = require("LBase");

cc.Class({
    extends: LBase,

    properties: {
        // 普通怪物预制
        monsterPrefab:cc.Prefab,
        // 关卡ID
        passID:0,
        // 当前帧数
        _CurFrame:0,
        _GeneratedMonsterID:0,
    },

    // onLoad () {},

    start () {
        this._CurFrame = -1;
        this._GeneratedMonsterID = -1;
    },

    // update (dt) {},

    /**
     * 设置关卡ID
     *
     * @param {*} passid 关卡ID
     */
    setPassID:function (passid) {
        this.passID = passid;
    },

    updateMonster:function (cameraLeft , cameraRight) {
        this._UpdateFrame();

        this.recoveryMonster(cameraLeft);
        if (this._CurFrame == 0) {
            this.generateMonster(this.max , cameraRight , this.range);    
        }
    },

    generateMonster:function (maxNum , origin , range) {
        var count = this.node.childrenCount;
        if (count >= maxNum) {
            return;
        }

        for (let index = 0; index < maxNum; index++) {
            var posx = origin + Global.Common.Utils.random(this.startGenerate , this.startGenerate + range);
            // 判断建筑是否生成在墙内
            if (Global.Model.MWall.isInside(posx + 50) || Global.Model.MWall.isInside(posx - 50)) {

            }
            else
            {
                var monster = this.createMonster();
                monster.name = "MNomrla" + this._GeneratedMonsterID;
                monster.x = posx;
                this.node.addChild(monster);
            }
        }
    },

    createMonster:function () {
        var monster = cc.instantiate(this.monsterPrefab);  
        return monster;
    },

    recoveryMonster:function (distance) {
        var count = this.node.childrenCount;
        for (let index = 0; index < count; index++) {
            var node = this.node.children[index];
            if (node.x <= distance - 1000) {
                node.destroy();
            }
        }
    },

    refreshByPassID:function (passID) {
        this.setPassID(passID);
        console.log("LNormal refreshByPassID" , passID);
    },

    _UpdateFrame:function () {
        this._CurFrame++;
        if (this._CurFrame > this.interval) {
            this._CurFrame = 0;
        }
    },
});
