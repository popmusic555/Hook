cc.Class({
    extends: cc.Component,

    properties: {
        cardRes:[cc.SpriteFrame],
        instructionsRes:[cc.SpriteFrame],
        card:cc.Sprite,
        instructions:cc.Sprite,
        instructionsTitle:cc.Label,

        _Step:0,
        _Node:null,
        _NodePos:null,
        _Parent:null,

        _IsMonsterGuide:false,
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
    },

    showMonsterGuide:function (index) {
        this.show();
        this._IsMonsterGuide = true;
        Global.Model.Game.monsterGuide[index] = 1;
        switch (index) {
            case 0:
                // 弹跳机怪物引导
                var monsterGuide = this.node.getChildByName("Monster");
                monsterGuide.active = true;
                this.card.spriteFrame = this.cardRes[0];
                this.instructions.spriteFrame = this.instructionsRes[0];
                this.instructionsTitle.string = "重击摧毁";
                Global.Model.Game.pauseGame();
                break;
            case 1:
                // 飞机怪物引导
                var monsterGuide = this.node.getChildByName("Monster");
                monsterGuide.active = true;
                this.card.spriteFrame = this.cardRes[1];
                this.instructions.spriteFrame = this.instructionsRes[1];
                this.instructionsTitle.string = "找电池";
                Global.Model.Game.pauseGame();
                break;
            case 2:
                // 汽车怪物引导
                var monsterGuide = this.node.getChildByName("Monster");
                monsterGuide.active = true;
                this.card.spriteFrame = this.cardRes[2];
                this.instructions.spriteFrame = this.instructionsRes[2];
                this.instructionsTitle.string = "疯狂点击";
                Global.Model.Game.pauseGame();
                break;
        }
    },

    hide:function () {
        this.node.active = false;  
    },

    setGuide:function (node , nodePos , parent) {
        this.show();
        this._Node = node;
        this._NodePos = nodePos;
        this._Parent = parent;
        this._IsMonsterGuide = false;
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

    onTouched:function () {
        this.hide();
        if (this._IsMonsterGuide) {
            this._IsMonsterGuide = false;
            var monsterGuide = this.node.getChildByName("Monster");
            monsterGuide.active = false;
            Global.Model.Game.resumeGame();
        }
        else
        {
            switch (Global.Model.Game.guideStep) {
                case 0:
                    // 发射引导
                    this._Node.parent = this._Parent;
                    this._Node.position = this._NodePos;
                    var step0 = this.node.getChildByName("Step0");
                    step0.active = false;
                    Global.Model.Game.guideStep++;
                    break;
                case 1:
                    // 技能引导
                    this._Node.parent = this._Parent;
                    this._Node.position = this._NodePos;
                    var step1 = this.node.getChildByName("Step1");
                    step1.active = false;
                    Global.Model.Game.guideStep++;
                    Global.Model.Game.resumeGame();
                    break;
            }
        }
    },

});
