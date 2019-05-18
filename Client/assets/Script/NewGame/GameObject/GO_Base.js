
var GlobalEnum = require("GlobalEnum");

/**
 * 基类对象
 * 
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        // 刚体组件
        rigidbody:cc.RigidBody,
        // 类型
        type:{
            default:GlobalEnum.TYPE.PLAYER,
            type:GlobalEnum.TYPE,
        },

        // 是否休眠
        _IsSleep:false,
    },

    // onLoad () {},

    start () {

    },

    setType:function (type) {
        this.type = type;
    },

    /**
     * 获取类型
     * 
     */
    getType:function () {
        return this.type;
    },

    /**
     * 设置速度
     * 
     * @param {any} velocity 速度值
     */
    setVelocity:function (velocity) {
        this.rigidbody.linearVelocity = cc.v2(velocity.x , velocity.y);
    },

    /**
     * 设置X轴速度
     * 
     * @param {any} num 速度值
     */
    setVelocityX:function (num) {
        this.rigidbody.linearVelocity = cc.v2(num , this.rigidbody.linearVelocity.y);
    },

    /**
     * 设置Y轴速度
     * 
     * @param {any} num 速度值
     */
    setVelocityY:function (num) {
        this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x , num);
    },

    /**
     * 获取速度
     * 
     */
    getVelocity:function () {
        return this.rigidbody.linearVelocity;
    },
    /**
     * 获取X轴速度
     * 
     */
    getVelocityX:function () {
        return this.rigidbody.linearVelocity.x;
    },
    /**
     * 获取Y轴速度
     * 
     */
    getVelocityY:function () {
        return this.rigidbody.linearVelocity.y;
    },

    /**
     * X轴速度是否正向
     * 
     * @returns 是否正向
     */
    isPositiveVelocityX:function () {
        var velocityX = this.getVelocityX();
        if (velocityX > 0) {
            return true;
        }
        // else if (velocityX < 0) {
        //     return false;
        // }
        return false;
    },

    /**
     * Y轴速度是否正向
     * 
     * @returns 是否正向
     */
    isPositiveVelocityY:function () {
        var velocityY = this.getVelocityY();
        if (velocityY > 0) {
            return true;
        }
        return false;
    },

    /**
     * 设置角速度
     * 
     * @param {any} num 角速度
     */
    setAngularVelocity:function (num) {
        this.rigidbody.angularVelocity = num;
    },

    /**
     * 获取角速度
     * 
     * @returns 角速度
     */
    getAngularVelocity:function () {
        return this.rigidbody.angularVelocity;  
    },

    /**
     * 设置重力
     * 
     * @param {any} scale 
     */
    setGravityScale:function (scale) {
        this.rigidbody.gravityScale = scale;
    },

    /**
     * 获取重力
     * 
     * @returns 
     */
    getGravityScale:function () {
        return this.rigidbody.gravityScale;
    },

    /**
     * 静止
     * 速度为0，重力为0
     */
    static:function () {
        this.setVelocity(cc.v2(0,0));
        this.setGravityScale(0);
    },

    /**
     * 运动
     * 
     */
    run:function (velocity , gravityScale) {
        this.setVelocity(velocity);
        this.setGravityScale(gravityScale);
    },

    /**
     * 停止
     * 速度为0
     */
    stop:function () {
        this.setVelocity(cc.v2(0,0));
    },

    /**
     * 休眠
     * 休眠状态下不会产生任何碰撞逻辑
     */
    sleep:function () {
        this._IsSleep = true;
    },
    /**
     * 唤醒
     * 
     */
    wakeup:function () {
        this._IsSleep = false;
    },
    /**
     * 是否休眠
     * 
     * @returns 
     */
    isSleep:function () {
        return this._IsSleep;
    },

    /**
     * 碰撞回调
     * 在碰撞时回调函数
     * 
     * @param {any} contact 碰撞参数
     * @param {any} selfCollider 自身碰撞器
     * @param {any} otherCollider 被碰撞对象碰撞器
     */
    onBeginContact:function (contact, selfCollider, otherCollider) {

    },
});
