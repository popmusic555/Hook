
cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type:cc.AudioClip,
            default:null,
        },
        _ProgressNum1:0,
        _ProgressNum2:0,
        progressLabel:cc.Label,
    },

    // onLoad () {},

    start () {
        cc.audioEngine.playMusic(this.bgm, true);

        cc.director.preloadScene("MainScene" , function (completedCount , totalCount , item) {
            var progress = completedCount / totalCount;
            this._ProgressNum1 = Math.max(progress , this._ProgressNum1) * 0.5;
        }.bind(this) , function () {
            this._ProgressNum1 = 0.5;
        }.bind(this))

        cc.director.preloadScene("GameScene" , function (completedCount , totalCount , item) {
            var progress = completedCount / totalCount;
            this._ProgressNum2 = Math.max(progress , this._ProgressNum2) * 0.5;
        }.bind(this) , function () {
            this._ProgressNum2 = 0.5;
        }.bind(this))

        Global.Model.Game.initLevels([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    },

    update (dt) {
        var progress = (this._ProgressNum1+this._ProgressNum2);
        if (progress == 1) {
            cc.director.loadScene("MainScene");
            this._ProgressNum1 = 1;
            this._ProgressNum2 = 1;
        }
        this.progressLabel.string = "- " + Math.floor(Math.min(progress , 1) * 100) + "% -";
    },
});
