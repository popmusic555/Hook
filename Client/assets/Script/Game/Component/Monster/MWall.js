
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

        // 当前已碰撞到的Player
        _CurEmitPlayer:null,

        // 当前是否可以穿墙
        _IsThrough:null,
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

    onBeginContact:function (contact, selfCollider, otherCollider) {
        var selfGameObject = selfCollider.getComponent(GameObject); 
        var otherGameObject = otherCollider.getComponent(GameObject);
        // new cc.PhysicsBoxCollider().tag;
        selfGameObject.onCollision(contact , selfGameObject , otherGameObject , selfCollider.tag , otherCollider.tag);
    },

    onCollision:function (contact , selfGameObj , otherGameObj , selfTag , otherTag) {
        // 碰撞不同类型的游戏物体触发不同的逻辑
        switch (otherGameObj.ObjectType) {
            case GameEnum.GAMEOBJ_TYPE.MONSTER:
                this.onMonster(contact , selfGameObj , otherGameObj , selfTag , otherTag);
                break;
            case GameEnum.GAMEOBJ_TYPE.PLAYER:
                this.onPlayer(contact , selfGameObj , otherGameObj , selfTag , otherTag);
                break;
        }
    },

    onMonster:function (contact , self , other , selfTag , otherTag) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Monster");
            return;
        }

        if (selfTag > 1) {
            this.handleMonster(self , other, selfTag , otherTag);
        }
    },

    handleMonster:function (self , other, selfTag , otherTag) {
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

    onPlayer:function (contact , self , other, selfTag , otherTag) {
        // 休眠后不处理任何逻辑
        if (self.isSleep || other.isSleep) {
            console.log("休眠后不处理任何逻辑Player");
            return;
        }
        this.handlePlayer(self , other, selfTag , otherTag);
    },

    handlePlayer:function (self , other, selfTag , otherTag) {
        console.log("Player 撞墙停止" , selfTag);
        var player = other;
        switch (selfTag) {
            case 1:
                // 判断是否需要停止       
                if (player.getLinearVelocity().x <= this.stopSpeed) {
                    this._IsThrough = false;
                    var cameraFollow = cc.Camera.main.getComponent("CameraFollow");
                    cameraFollow.stopFollowWithPosX(this.node.x - cc.view.getVisibleSize().width * 0.25);
                    console.log("需要停止");
                }
                else
                {
                    this._IsThrough = true;
                    console.log("需要穿墙");
                }
                break;
            case 2:
                // 判断是否停止
                if (!this._IsThrough) {
                    player.stop();
                    player.setGravityScale(GameConst.GRAVITY_SCALE);
                    player.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.DEAD1);
                    this.scheduleOnce(function () {
                        player.node.x = this.node.x + 30;
                    } , 0);    
                }
                else
                {
                    // 穿越墙壁
                    console.log("穿越墙壁");
                    this.through(player);
                }
                break;
            case 3:
                // 判断是否穿墙
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
                break;
        }

        // if (this.getReEmitSpeed()) {
        //     player.setLinearVelocity(this.getReEmitSpeed().x , this.getReEmitSpeed().y);
        //     player.setGravityScale(GameConst.GRAVITY_SCALE);

        //     var y = player.node.parent.convertToWorldSpaceAR(player.node.position).y;
        //     y = this.throughHole.parent.convertToNodeSpaceAR(cc.v2(0 , y)).y;
            
        //     this.throughHole.y = y;
        //     this.throughHole.active = true;

        //     player.showThroughHoleAni(player.node.position);
        //     // this.scheduleOnce(function () {
        //     //     player.node.x = this.node.x + 2000;
        //     // } , 0);  
        // }
        // else
        // {
        //     if (player.getLinearVelocity().x <= this.stopSpeed) {
        //         player.stop();
        //         player.setGravityScale(GameConst.GRAVITY_SCALE);
        //         player.getPlayerModel().transitionStateAndLock(GameEnum.PLAYER_STATE.DEAD1);
        //         this.scheduleOnce(function () {
        //             player.node.x = this.node.x + 30;
        //         } , 0);    
        //     }
        //     else
        //     {
        //         // 穿越墙壁
        //         console.log("穿越墙壁");
        //         this.through(player);
        //     }
        // }
    },

    through:function (player) {
        // player.visible(false);
        this.setReEmitSpeed(player.getLinearVelocity().x , player.getLinearVelocity().y);
        player.setLinearVelocity(5000 , 0);
        player.setGravityScale(0);
    },
});
