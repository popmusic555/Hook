
var LBase = require("LBase");

cc.Class({
    extends: LBase,

    properties: {
        // 普通怪物预制
        monsterPrefab:cc.Prefab,
        // 关卡ID
        passID:0,
        
        _GeneratedMonsterID:0,
    },

    // onLoad () {},

    start () {
        this._super();
        this._GeneratedMonsterID = -1;

        this.max = Global.Model.MCar.getAttr().maxNum;
        this.interval = Global.Model.MCar.getAttr().interval;
        this.generateRate = Global.Model.MCar.getAttr().rate;
    },

    // update (dt) {},

    generateMonster:function (parent , maxNum , origin , range) {
        var count = this.node.childrenCount;
        if (count >= maxNum) {
            return;
        }

        var len = maxNum - count;
        for (let index = 0; index < len; index++) {
            var posx = origin + Global.Common.Utils.random(this.startGenerate , this.startGenerate + range);
            // 判断怪物是否生成在墙内
            if (Global.Model.MWall.isInside(posx + 50) || Global.Model.MWall.isInside(posx - 50)) {

            }
            else
            {
                var monster = this.createMonster();
                monster.name = "MNormal" + this._GeneratedMonsterID;
                monster.x = posx;
                parent.addChild(monster);
                this._GeneratedMonsterID++;
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
            if (node.x <= distance - 500) {
                node.destroy();
            }
        }
    },
});
