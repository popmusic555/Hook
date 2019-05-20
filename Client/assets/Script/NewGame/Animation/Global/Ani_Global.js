
cc.Class({
    extends: cc.Component,

    properties: {
        // 大爆炸
        bigBoom:cc.Prefab,
    },

    // onLoad () {},

    start () {
        Global.Model.MPlayer.setGlobalAni(this);
    },

    // update (dt) {},

    lateUpdate (dt) {
        var len = this.node.childrenCount;
        for (let index = 0; index < len; index++) {
            var ani = this.node.children[index];
            ani.x = Global.Model.MPlayer.getPlayerObj().node.x;
        }
    },

    showBigBoom:function (player) {
        var bigBoom = cc.instantiate(this.bigBoom);
        bigBoom.x = player.node.x;
        bigBoom.y = player.node.y;
        this.node.addChild(bigBoom);
        
        var spAni = bigBoom.getComponentInChildren(sp.Skeleton);
        spAni.setCompleteListener(function () {
            bigBoom.destroy();
        }.bind(this)); 
    },
    
});
