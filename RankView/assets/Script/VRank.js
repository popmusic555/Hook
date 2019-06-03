

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
            this.sortByMileage(this._Datas);
            console.log("sortByMileage" , this._Datas);
        }
        else if (tabIndex == 1) {
            this.sortByCombo(this._Datas);
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

        this.refreshContent(index , content , this._Datas);
    },

    refreshContent:function (index , content , datas) {
        console.log("refreshContent " , this.getDatasSize(index , datas));
        var len = Math.max(content.childrenCount , this.getDatasSize(index , datas));

        for (let i = 0; i < len; i++) {
            var rankItemNode = content.children[i];
            if (!rankItemNode) {
                rankItemNode = cc.instantiate(this.rankItem);
                content.addChild(rankItemNode);
            }
            var data = datas[i];
            if (index == 0) {
                if (data && (data.mileage > 0 || data.isMe)) {
                    var rankItem = rankItemNode.getComponent("RankItem");
                    data.rankNum = i;
                    rankItem.refreshByData(data , data.mileage);    
                }
                else
                {
                    rankItemNode.destroy();
                }
            }
            else if (index == 1) {
                if (data && (data.combo > 0 || data.isMe)) {
                    var rankItem = rankItemNode.getComponent("RankItem");
                    data.rankNum = i;
                    rankItem.refreshByData(data , data.combo);
                }
                else
                {
                    rankItemNode.destroy();
                }
            }
        }
    },

    getDatasSize:function (index , datas) {
        var size = 0;
        if (index == 0) 
        {
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].mileage > 0 || datas[i].isMe) 
                {
                    size += 1;
                }
            }
        }
        else if (index == 1) 
        {
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].combo > 0 || datas[i].isMe) 
                {
                    size += 1;
                }
            }
        }
        return size;
    },

    onTabBtn:function (event , tabIndex) {
        this.switchTab(event.target , tabIndex);
    },

    refresh:function (datas) {
        this._Datas = datas;
        // 排序数据
        this.switchTab(this.tabBtn[0].node , 0);
    },

    sortByMileage:function (datas) {
        // 根据mileage排序
        this._Datas = this.sortByField(datas , "mileage");
    },

    sortByCombo:function (datas) {
        // 根据combo排序
        this._Datas = this.sortByField(datas , "combo");
    },

    sortByField:function (datas , field) {
        datas.sort(function (a , b) {
            var aValue = a[field];
            var bValue = b[field];
            if (aValue > bValue) {
                return -1;
            }
            else if (aValue == bValue) {
                var aTimeValue = a[field + "Times"];
                var bTimeValue = b[field + "Times"];
                if (aValue > bValue) {
                    return 1;
                }
                else if (aValue == bValue) {
                    return 0;
                }
                else if (aValue < bValue) {
                    return -1;
                }
            }
            else if (aValue < bValue) {
                return 1;
            }
        });
        return datas;
    },
});
