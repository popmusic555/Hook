
var GameCommon = require("GameCommon");
var EnergyPower = require("EnergyPower");
var SpeedPower = require("SpeedPower");
var CoinsValue = require("CoinsValue");
var MileageValue = require("MileageValue");

cc.Class({
    extends: cc.Component,

    properties: {
        settlementView:cc.Node,
        setView:cc.Node,
        energyPower:EnergyPower,
        speedPower:SpeedPower,
        coinsValue:CoinsValue,
        mileageValue:MileageValue,

        _TouchListener:null,
    },

    onLoad () {
        GameCommon.SetUIView(this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
    },

    start () {
    },

    // update (dt) {},

    onTouched:function () {
        if (this._TouchListener) {
            this._TouchListener.onTouched();
        }
    },
    
    setTouchListener:function (gameObject) {
        this._TouchListener = gameObject;
    },

    showSettlement:function (mileage , coins) {
        this.settlementView.active = true;
        this.settlementView.getComponent("SettlementView").setParam(mileage , coins);
    },

    showSetView:function () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = false;

        var components = GameCommon.GAME_VIEW.node.getComponentsInChildren(sp.Skeleton);
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.timeScale = 0;
        }

        components = GameCommon.GAME_VIEW.node.getComponentsInChildren("MPlayer");
        var len = components.length;
        for (let index = 0; index < len; index++) {
            var item = components[index];
            item.pause();
        }

        this.setView.active = true;
    },

    getEnergyPower:function () {
        return this.energyPower;
    },

    getSpeedPower:function () {
        return this.speedPower;  
    },

    getCoinsValue:function () {
        return this.coinsValue;   
    },

    getMileageValue:function () {
        return this.mileageValue;
    },

    onSetBtn:function () {
        this.showSetView();  
    },  
});
