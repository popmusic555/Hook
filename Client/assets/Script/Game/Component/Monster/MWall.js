
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");

cc.Class({
    extends: GameObject,

    properties: {
        // 撞墙停止速度
        stopSpeed:0,

        _ReEmitSpeed:null,
        throughHole:cc.Node,
    },

    // onLoad () {},

    start () {
        this._super();
        // this._ReEmitSpeed = cc.v2(0,0);
    },

    lateUpdate (dt) {

    },

    setReEmitSpeed:function (x , y) {
        // this._ReEmitSpeed.x = x;
        // this._ReEmitSpeed.y = y;
        this._ReEmitSpeed = cc.v2(x , y);
    },

    getReEmitSpeed:function () {
        return this._ReEmitSpeed;  
    },

    onCollision:function (contact , selfGameObj , otherGameObj) {
        // 碰撞不同类型的游戏物体触发不同的逻辑
        switch (otherGameObj.ObjectType) {
            case GameEnum.GAMEOBJ_TYPE.MONSTER:
                this.onMonster(contact , selfGameObj , otherGameObj);
                break;
            case GameEnum.GAMEOBJ_TYPE.PLAYER:
                this.onPlayer(contact , selfGameObj , otherGameObj);
                break;
        }
    },

    onMonster:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Monster");
            return;
        }
        this.handleMonster(self , other);
    },

    handleMonster:function (self , other) {
        var monster = other;
        var player = monster.getController();
        if (player) {
            monster.turnOffControl();
            monster.beKill(this);
            // 重新唤醒player
            player.visible(true);
            player.wakeUp();
            this.handlePlayer(self , player);
        }
        else
        {
            monster.beKill(this);
            monster.stopAndSleep();
        }
    },

    onPlayer:function (contact , self , other) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Player");
            return;
        }
        this.handlePlayer(self , other);
    },

    handlePlayer:function (self , other) {
        console.log("Player 撞墙停止");
        var player = other;

        if (this.getReEmitSpeed()) {
            player.setLinearVelocity(this.getReEmitSpeed().x , this.getReEmitSpeed().y);
            player.setGravityScale(GameConst.GRAVITY_SCALE);

            var y = player.node.parent.convertToWorldSpaceAR(player.node.position).y;
            y = this.throughHole.parent.convertToNodeSpaceAR(cc.v2(0 , y)).y;
            
            this.throughHole.y = y;
            this.throughHole.active = true;

            player.showThroughHoleAni(player.node.position);
            // this.scheduleOnce(function () {
            //     player.node.x = this.node.x + 2000;
            // } , 0);  
        }
        else
        {
            if (player.getLinearVelocity().x <= this.stopSpeed) {
                player.stop();
                player.setGravityScale(GameConst.GRAVITY_SCALE);
                player.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.DEAD1);
                this.scheduleOnce(function () {
                    player.node.x = this.node.x + 157;
                } , 0);    
            }
            else
            {
                // 穿越墙壁
                console.log("穿越墙壁");
                this.through(player);
            }
        }
    },

    through:function (player) {
        // player.visible(false);
        this.setReEmitSpeed(player.getLinearVelocity().x , player.getLinearVelocity().y);
        player.setLinearVelocity(5000 , 0);
        player.setGravityScale(0);
    },
});
