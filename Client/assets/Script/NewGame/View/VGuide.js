cc.Class({
    extends: cc.Component,

    properties: {
        _Step:0,
        _Node:null,
        _NodePos:null,
        _Parent:null,
    },

    // onLoad () {},

    start () {
        
    },

    onEnable () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    onDisable () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    // update (dt) {},

    show:function () {
        this.node.active = true;
        switch (Global.Model.Game.guideStep) {
            case 0:
                // 发射引导
                var step0 = this.node.getChildByName("Step0");
                step0.active = true;
                break;
            case 1:
                // 技能引导
                var step1 = this.node.getChildByName("Step1");
                step1.active = true;
                step1.x = this._NodePos.x;
                break;
        }
    },

    hide:function () {
        this.node.active = false;  
    },

    setGuide:function (node , nodePos , parent) {
        this._Node = node;
        this._NodePos = nodePos;
        this._Parent = parent;
        this.show();
    },

    onTouched:function () {
        this.hide();
        this._Node.parent = this._Parent;
        this._Node.position = this._NodePos;

        switch (Global.Model.Game.guideStep) {
            case 0:
                // 发射引导
                var step0 = this.node.getChildByName("Step0");
                step0.active = false;
                Global.Model.Game.guideStep++;
                break;
            case 1:
                // 技能引导
                var step1 = this.node.getChildByName("Step1");
                step1.active = false;
                Global.Model.Game.resumeGame();
                Global.Model.Game.guideStep++;
                break;
        }
    },

});
