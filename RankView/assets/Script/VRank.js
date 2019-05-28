cc.Class({
    extends: cc.Component,

    properties: {
        rankItem:cc.Prefab,

        tabBtn:[cc.Button],
    },

    // onLoad () {},

    start () {
        this.switchTab(this.tabBtn[0].node , 0);
    },

    // update (dt) {},

    switchTab:function (tabBtn , tabIndex) {
        var len = this.tabBtn.length;
        for (let index = 0; index < len; index++) {
            const btn = this.tabBtn[index];
            if (btn.node.name == tabBtn.name) {
                btn.interactable = false;
            }
            else
            {
                btn.interactable = true;
            }
        }

        this.switchPage(tabIndex);
    },

    switchPage:function (index) {
        var rankItem = cc.instantiate(this.rankItem);

        
    },

    onTabBtn:function (event , tabIndex) {
        this.switchTab(event.target , tabIndex);
    },

    onCloseBtn:function () {
        this.node.active = false;  
    },
    
});
