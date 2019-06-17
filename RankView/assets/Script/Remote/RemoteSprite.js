
cc.Class({
    extends: cc.Sprite,

    properties: {
        url:{
            get () {
                return this._Url || "";
            },
            set (value) {
                this.setUrl(value);
            }
        },

        defaultFrame:cc.SpriteFrame,
    },

    // onLoad () {},

    start () {
    },

    setUrl:function (remoteUrl , size) {
        if (this._Url == remoteUrl) {
            return;
        }
        this._Url = remoteUrl;
        // 远程 url 不带图片后缀名，此时必须指定远程图片文件的类型
        cc.loader.load({url: remoteUrl, type: 'png'}, function (err, texture) {
            if (texture) {
                var spf = new cc.SpriteFrame(texture);
                this.spriteFrame = spf;
                if (size) {
                    this.node.width = size.width;
                    this.node.height = size.height;    
                }    
            }
            else
            {
                this.setDefault();
            }
        }.bind(this));
    },

    setDefault:function () {
        this.spriteFrame = this.defaultFrame;
    },

    // update (dt) {},

});
