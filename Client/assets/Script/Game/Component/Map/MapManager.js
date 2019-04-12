
var GameMap = require("GameMap");

cc.Class({
    extends: cc.Component,

    properties: {
        maps:[GameMap],
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    updateMap:function (displacementX , displacementY) {
        var len = this.maps.length
        for (let index = 0; index < len; index++) {
            const map = this.maps[index];
            this._UpdateMap(map , displacementX , displacementY);    
        }
    },

    _UpdateMap:function (map , displacementX , displacementY) {
        map.updateMap(displacementX , displacementY);
    },

});
