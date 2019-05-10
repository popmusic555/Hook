
cc.Class({
    extends: cc.Component,

    properties: {
        levelIcon:cc.Prefab,

        maxLevelNum:{
            get (){
                return this._maxLevelNum || 0;
            },

            set(value){
                this._maxLevelNum = value;
                this.resetLevelIcon(this._maxLevelNum);
            },
        },

        level:{
            get (){
                return this._Level;
            },

            set (value){
                this._Level = value;  
                this.resetLevel(this._Level);
            }
        }
    },

    // onLoad () {},

    start () {

    },

    resetLevelIcon:function (levelNum) {
        this.node.removeAllChildren();
        for (let index = 0; index < levelNum; index++) {
            var node = cc.instantiate(this.levelIcon);
            node.name = "Lv" + index;

            var label = node.getComponentInChildren(cc.Label);
            label.string = index+1;

            this.node.addChild(node);
        }
    },

    resetLevel:function (level) {
        var len = this.node.childrenCount;
        for (let index = 0; index < len; index++) {
            const item = this.node.children[index];
            var toggle = item.getComponent(cc.Toggle);
            toggle.isChecked = false;    
            if (level >= index+1) {
                toggle.isChecked = true;    
            }
        }
    },

    // update (dt) {},
});
