
var GameConst = require("GameConst");

// 数据计算器
var DataCalculaor = {};

// 处理弹起
DataCalculaor.HandleBounceUp = function (gameObject) {
    // 弹性
    var elasticity = gameObject.elasticity;
    // 增加值
    var heightAddedValue = gameObject.heightAddedValue;
    // 阈值
    var minHeight = gameObject.minHeight;

    // 当前高度
    var height = DataCalculaor.LinearVelocity2Height(gameObject.getLinearVelocity().y , GameConst.GRAVITY_SCALE);
    // 计算弹性
    height = height * elasticity;
    // 增加值
    height = height + heightAddedValue;
    
    if (height < minHeight) {
        height = minHeight;
    }
    console.log("height" , height);

    // 转化为速度
    var linearVelocity = DataCalculaor.Height2LinearVelocity(height , GameConst.GRAVITY_SCALE);

    // 设置速度
    gameObject.setLinearVelocityY(linearVelocity);
    // 设置重力
    gameObject.setGravityScale(GameConst.GRAVITY_SCALE);
};

// 处理加速
DataCalculaor.HandleAccelerate = function (gameObject) {
    // 速度增加值
    var speedAddedValue = gameObject.speedAddedValue;
    // 速度阈值
    var maxSpeed = gameObject.maxSpeed;

    // 当前速度
    var speed = gameObject.getLinearVelocity().x;
    // 计算速度
    speed = speed + speedAddedValue;

    if (speed > maxSpeed) {
        speed = maxSpeed;
    }

    // 设置速度
    gameObject.setLinearVelocityX(speed);
};

DataCalculaor.LinearVelocity2Height = function (linearVelocity , gravityScale) {
    return (linearVelocity * linearVelocity) / (2 * Math.abs(DataCalculaor.getGravity(gravityScale)));
};

DataCalculaor.Height2LinearVelocity = function (height , gravityScale) {
    return Math.sqrt(2 * Math.abs(DataCalculaor.getGravity(gravityScale)) * height);
};

// 获取重力值
DataCalculaor.getGravity = function (gravityScale) {
    return cc.director.getPhysicsManager().gravity.y * gravityScale;
},

module.exports = DataCalculaor;


