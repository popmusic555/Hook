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
        this._Datas = [
            {rankNum:0 , name:"大哥你好0" , content:"1008600"},
            {rankNum:1 , name:"大哥你好1" , content:"1008601"},
            {rankNum:2 , name:"大哥你好2" , content:"1008602"},
            {rankNum:3 , name:"大哥你好3" , content:"1008603"},
            {rankNum:4 , name:"大哥你好4" , content:"1008604"},
            {rankNum:5 , name:"大哥你好5" , content:"1008605"},
            {rankNum:6 , name:"大哥你好6" , content:"1008606"},
        ];

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
    /**
     * 显示里程排行榜
     * 
     */
    showMileageRank:function () {
        this.show();
    },
    /**
     * 显示连击排行榜
     * 
     */
    showHitRank:function () {
        this.show();
    },
    /**
     * 请求好友数据
     * 
     */
    requestFriendData:function () {

    },
});
