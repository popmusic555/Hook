var GameEnum = require("GameEnum");
var GameConst = require("GameConst");
var DataCalculator = require("DataCalculator");

var GameObject = cc.Class({
    extends: cc.Component,

    properties: {
        _Processor:null,

        // 游戏物体类型
        ObjectType:{
            default: GameEnum.GAMEOBJ_TYPE.FLOOR,
            type: GameEnum.GAMEOBJ_TYPE,
        },

        // 休眠 休眠后可以碰撞 但不触发逻辑
        isSleep:false,

        // 是否可以碰撞PLAYER类型
        canPlayer:false,
        // 是否可以碰撞MONSTER类型
        canMonster:false,
        // 是否可以碰撞FLOOR类型
        canFloor:false,

        // 上升时忽略碰撞
        riseIgnore:false,

        // 最小速度
        minSpeed:0,

        // 弹性系数
        elasticity:{
            default:0,
            visible:false,
        },
        // 高度增加值
        heightAddedValue:{
            default:0,
            visible:false,
        },
        // 最小高度
        minHeight:{
            default:0,
            visible:false,
        },
        // 速度增加值
        speedAddedValue:{
            default:0,
            visible:false,
        },
        // 最大速度
        maxSpeed:{
            default:0,
            visible:false,
        },
        
        // 主体 碰撞框碰撞后 只有主体可以触发逻辑
        _Subject:null,
        _AsyncPos:null,


        _RigidBody:null,
    },

    onLoad () {
    },

    start () {
        
    },

    lateUpdate (dt) {
        if (this._AsyncPos) {
            this._AsyncPosition(this._AsyncPos);
            this._AsyncPos = null;
        }
    },

    // 注入弹性处理器
    injection:function (processor) {
        this._Processor = processor;
    },

    // 设置主体
    setSubject:function (gameObject) {
        this._Subject = gameObject;
    },

    // 获取主体
    getSubject:function (gameObject) {
        return this._Subject;
    },

    // 获取RigidBody
    getRigidBody:function () {
        if (!this._RigidBody) {
            this._RigidBody = this.getComponent(cc.RigidBody);
        }
        return this._RigidBody;
    },

    // 设置linearVelocity
    setLinearVelocityX:function (x) {
        if (x < this.minSpeed) {
            x = this.minSpeed;
        }
        this.getRigidBody().linearVelocity = new cc.Vec2(x , this.getRigidBody().linearVelocity.y);
    },

    setLinearVelocityY:function (y) {
        this.getRigidBody().linearVelocity = new cc.Vec2(this.getRigidBody().linearVelocity.x , y);
    },

    setLinearVelocity:function (x , y) {
        if (x < this.minSpeed) {
            x = this.minSpeed;
        }
        this.getRigidBody().linearVelocity = new cc.Vec2(x , y);
    },

    getLinearVelocity:function () {
        return this.getRigidBody().linearVelocity;
    },

    setAngularVelocity:function (num) {
        this.getRigidBody().angularVelocity = num;
    },

    getAngularVelocity:function () {
        return this.getRigidBody().angularVelocity;  
    },

    setGravityScale:function (scale) {
        this.getRigidBody().gravityScale = scale;
    },

    getGravityScale:function () {
        return this.getRigidBody().gravityScale;
    },

    stop:function () {
        this.setLinearVelocity(0,0);
        this.setGravityScale(0);
    },

    startUp:function (linearVelocityX , linearVelocityY) {
        this.setLinearVelocity(linearVelocityX,linearVelocityY);
        this.setGravityScale(GameConst.GRAVITY_SCALE);
    },

    // 休眠
    sleep:function () {
        this.isSleep = true;
    },

    // 唤醒
    wakeUp:function () {
        this.isSleep = false;  
    },

    // 停止并休眠
    stopAndSleep:function () {
        this.sleep();
        this.stop();
    },

    // 同步坐标
    SyncPosition:function (gameObject , offsetX , offsetY) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        this.node.x = gameObject.node.x + offsetX;
        this.node.y = gameObject.node.y + offsetY;
    },

    // 同步线性速度
    SyncLinearVelocity:function (gameObject) {
        this.setLinearVelocity(gameObject.getLinearVelocity().x , gameObject.getLinearVelocity().y);
    },

    // 异步坐标 在碰撞时无法同步坐标 使用此函数处理完碰撞逻辑后同步坐标
    AsyncPosition:function (vec2) {
        this._AsyncPos = vec2;
    },

    _AsyncPosition:function (vec2) {
        this.node.x = vec2.x;
        this.node.y = vec2.y;
    },

    // 同步参数
    SyncParam:function (data) {
        data.SyncData(this);
    },

    SyncNewParam:function (data , elasticity , heightAddedValue , minHeight , speedAddedValue , maxSpeed) {
        data.SyncDataForNew(this , elasticity , heightAddedValue , minHeight , speedAddedValue , maxSpeed);
    },

    // 计算弹性参数并应用
    ApplyElasticityParam:function (gameObject) {
        DataCalculator.HandleBounceUp(gameObject);
    },

    // 计算速度参数并应用
    ApplySpeedParam:function (gameObject) {
        DataCalculator.HandleAccelerate(gameObject);
    },

    // 计算所有参数并应用
    ApplyAllParam:function (gameObject) {
        // console.log("this.elasticity" , gameObject.elasticity);
        // console.log("this.heightAddedValue" , gameObject.heightAddedValue);
        // console.log("this.minHeight" , gameObject.minHeight);
        // console.log("this.speedAddedValue" , gameObject.speedAddedValue);
        // console.log("this.maxSpeed" , gameObject.maxSpeed);

        DataCalculator.HandleBounceUp(gameObject);
        DataCalculator.HandleAccelerate(gameObject);
    },

    // 碰撞回调
    onBeginContact:function (contact, selfCollider, otherCollider) {
        var selfGameObject = selfCollider.getComponent(GameObject); 
        var otherGameObject = otherCollider.getComponent(GameObject);
        // console.log(selfGameObject.node.name , "碰撞" , otherGameObject.node.name);
        // if (selfGameObject.isSleep || otherGameObject.isSleep) {
        //     contact.disabled = true;
        //     return;
        // }

        // if (otherGameObject.riseIgnore && selfGameObject.getLinearVelocity().y > 0) {
        //     contact.disabled = true;
        //     return;
        // }

        selfGameObject.onCollision(contact , selfGameObject , otherGameObject);
    },

    onEndContact:function (contact, selfCollider, otherCollider) {
        var selfGameObject = selfCollider.getComponent(GameObject); 
        var otherGameObject = otherCollider.getComponent(GameObject);
        selfGameObject.onEndCollision(contact, selfGameObject, otherGameObject);
    },

    onCollision:function (contact , selfGameObj , otherGameObj) {
        // 碰撞不同类型的游戏物体触发不同的逻辑
        switch (otherGameObj.ObjectType) {
            // 当前碰撞到Floor
            case GameEnum.GAMEOBJ_TYPE.FLOOR:
                if (selfGameObj.canFloor) {
                    console.log(selfGameObj.node.name , "碰撞Floor" , otherGameObj.node.name);
                    this.onFloor(contact , selfGameObj , otherGameObj);
                }
                break;
            // 当前碰撞到Monster
            case GameEnum.GAMEOBJ_TYPE.MONSTER:
                if (selfGameObj.canMonster) {
                    console.log(selfGameObj.node.name , "碰撞Monster" , otherGameObj.node.name);
                    this.onMonster(contact , selfGameObj , otherGameObj);
                }
                break;
            // 当前碰撞到Player
            case GameEnum.GAMEOBJ_TYPE.PLAYER:
                if (selfGameObj.canPlayer) {
                    console.log(selfGameObj.node.name , "碰撞Player" , otherGameObj.node.name);
                    this.onPlayer(contact , selfGameObj , otherGameObj);
                }
                break;
        }
    },

    onEndCollision:function (contact , selfGameObj , otherGameObj) {

    },  

    onFloor:function (contact , self , other) {
        
    },

    onMonster:function (contact , self , other) {
        
    },

    onPlayer:function (contact , self , other) {

    },

    onTouched:function () {

    },

});
