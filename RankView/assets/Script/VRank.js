cc.Class({
    extends: cc.Component,

    properties: {
        rankItem:cc.Prefab,
        content:cc.Node,

        tabBtn:[cc.Button],
    },

    // onLoad () {},

    start () {
        this.show();
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
        // 获取数据

        for (let index = 0; index < 5; index++) {
            var rankItemNode = cc.instantiate(this.rankItem);
            var rankItem = rankItemNode.getComponent("RankItem");
            rankItem.refreshByData({rankNum:index , name:"大哥你好" , content:"1008600"});
            this.content.addChild(rankItemNode);    
        }
    },

    onTabBtn:function (event , tabIndex) {
        this.switchTab(event.target , tabIndex);
    },

    onCloseBtn:function () {
        this.hide();  
    },

    show:function () {
        this.node.active = true;  

        this.switchTab(this.tabBtn[0].node , 0);
    },

    hide:function () {
        this.node.active = false;
    },
    
});
