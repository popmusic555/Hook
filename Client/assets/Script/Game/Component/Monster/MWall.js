
var GameObject = require("GameObject");
var GameEnum = require("GameEnum");
var GameConst = require("GameConst");
var DataManager = require("DataManager");
var PlayerConfig = require("PlayerConfig");
var PassConfig = require("PassConfig");
var GameCommon = require("GameCommon");

cc.Class({
    extends: GameObject,

    properties: {
        // 撞墙停止速度
        stopSpeed:0,
        // 撞墙减速
        speedAddValue:0,
        // 撞墙奖励
        reward:0,
        throughHole:cc.Node,
        // 当前地板
        floor:cc.Sprite,
        // 当前地板资源
        floorRes:[cc.SpriteFrame],


        cost:{
            default:0,
            visible:false,
        },

        _ReEmitSpeed:null,
        // 当前是否可以穿墙
        _IsThrough:null,
        _CurPlayer:null,
    },

    // onLoad () {},

    start () {
        this._super();
        // this._ReEmitSpeed = cc.v2(0,0);
        var passId = DataManager.Userdata.getPassID() % 3;
        this.floor.spriteFrame = this.floorRes[passId];
        // 初始化数据
        var cfg = PlayerConfig.getDataByLevel(DataManager.Userdata.getLevelByIndex(7));
        this.speedAddValue = cfg.wallAddValue;
        this.cost = PassConfig.getDataByPassID(passId);
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
        this.handleMonster(self , other, selfTag , otherTag);
    },

    handleMonster:function (self , other, selfTag , otherTag) {
        var monster = other;
        var player = monster.getController();

        switch (selfTag) {
            case 1:
                // 判断是否需要停止
                if (player) {
                    player.hitWall(); 
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
                }
                break;
            case 2:
                if (player) {
                    monster.turnOffControl();
                    monster.beKill(this);
                    // 重新唤醒player
                    player.visible(true);
                    player.wakeUp();
                    player.SyncParam(monster.getPlayerData());
                    player.ApplyAllParam(player);
                    this.handlePlayer(self , player , selfTag , otherTag);
                }
                else
                {
                    monster.beKill(this);
                    monster.stopAndSleep();
                }
                break;
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
                player.hitWall(); 
                console.log("判断是否需要停止" , player.getLinearVelocity().x , this.stopSpeed);
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
                    this.speedAddValue += PassConfig.getDataByPassID(DataManager.Userdata.getPassID()).wallAddValue;
                    if (this.speedAddValue > -20) {
                        this.speedAddValue = -20;
                    }
                }
                break;
            case 2:
                // 判断是否停止
                if (!this._CurPlayer) {
                    if (!this._IsThrough) {
                        player.stop();
                        player.setGravityScale(GameConst.GRAVITY_SCALE);
                        player.deadForWall();
                        this.scheduleOnce(function () {
                            // player.node.x = this.node.x + 30;
                        } , 0);
                        GameCommon.GAME_VIEW.playSound(8);
                    }
                    else
                    {
                        // 穿越墙壁
                        console.log("穿越墙壁");
                        this.through(player);
                        GameCommon.GAME_VIEW.playSound(10);
                    }    
                }
                this._CurPlayer = player;
                break;
            case 3:
                // 判断是否穿墙
                player.unHitWall();
                if (this.getReEmitSpeed()) {
                    player.setLinearVelocity(this.getReEmitSpeed().x + this.speedAddValue , this.getReEmitSpeed().y);
                    player.setGravityScale(GameConst.GRAVITY_SCALE);
        
                    var y = player.node.parent.convertToWorldSpaceAR(player.node.position).y;
                    y = this.throughHole.parent.convertToNodeSpaceAR(cc.v2(0 , y)).y;
                    
                    this.throughHole.y = y;
                    this.throughHole.active = true;
        
                    player.showThroughHoleAni(player.node.position);
                    // this.scheduleOnce(function () {
                    //     player.node.x = this.node.x + 2000;
                    // } , 0);  
                    GameCommon.GetUIView().getEnergyPower().addEnergyForTen();
                    GameCommon.GAME_VIEW.playSound(7);
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
