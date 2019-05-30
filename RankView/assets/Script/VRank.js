
var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
        rankItem:cc.Prefab,

        tabBtn:[cc.Button],
        pageGroup:[cc.Node],

        _Datas:null,
    },

    // onLoad () {},

    start () {
        
    },

    show:function () {
        
    },

    // update (dt) {},
    switchTab:function (tabBtn , tabIndex) {
        if (tabIndex == 0) {
            this.sortByMileage();
        }
        else if (tabIndex == 1) {
            this.sortByLaunchPower();
        }

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
        var len = this.pageGroup.length;
        for (let pageIndex = 0; pageIndex < len; pageIndex++) {
            const page = this.pageGroup[pageIndex];
            if (index == pageIndex) {
                page.active = true;
            }
            else
            {
                page.active = false;
            }
        }

        var page =  this.pageGroup[index];
        var content = page.getComponentInChildren(cc.Layout).node;

        var len = Math.max(content.childrenCount , this._Datas.length);
        for (let index = 0; index < len; index++) {
            var rankItemNode = content.children[index];
            if (!rankItemNode) {
                rankItemNode = cc.instantiate(this.rankItem);
                content.addChild(rankItemNode);
            }
            var data = this._Datas[index];
            if (data) {
                var rankItem = rankItemNode.getComponent("RankItem");
                rankItem.refreshByData(data);    
            }
            else
            {
                rankItemNode.destroy();
            }
        }
    },

    onTabBtn:function (event , tabIndex) {
        this.switchTab(event.target , tabIndex);
    },

    refresh:function (datas) {
        this._Datas = datas;
        this.switchTab(this.tabBtn[0].node , 0);
    },

    sortByMileage:function () {
        
    },

    sortByLaunchPower:function () {

    },
});
