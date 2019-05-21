
var Utils = {};

// 计算器
var Calculator = {};
/**
 * 处理X速度
 * 
 * @param {any} curVelocityX 当前X速度
 * @param {any} acceleratePower1 加速力1
 * @param {any} acceleratePower2 加速力2
 * @param {any} limit 加速力合力上限
 */
Calculator.processVelocityX = function (curVelocityX , acceleratePower1 , acceleratePower2 , limit) {
    // 两个加速力的和与当前速度相加为最终速度
    var acceleratePower = acceleratePower1 + acceleratePower2;

    if (limit || limit == 0) {
        // 处理上限问题
        acceleratePower = Math.min(acceleratePower , limit);
    }

    return curVelocityX + acceleratePower;
};
/**
 * 处理Y速度
 * 
 * @param {any} curVelocityY 当前Y速度
 * @param {any} elastic1 弹性1
 * @param {any} bouncePower1 反弹力1 
 * @param {any} elastic2 弹性2
 * @param {any} bouncePower2 反弹力2 
 * @param {any} limit 弹性上限
 * @returns 
 */
Calculator.processVelocityY = function (curVelocityY , elastic1 , bouncePower1 ,elastic2 , bouncePower2 , limit) {
    // 两个弹性积为最终弹性
    var elastic = elastic1 * elastic2;
    // 两个反弹力和为最终反弹力
    var bouncePower = bouncePower1 + bouncePower2;
    // 反弹高度转反弹速度
    var bounceSpeed = Utils.Converter.toBounceSpeed(bouncePower);

    if (limit || limit == 0) {
        // 处理弹性上限
        elastic = Math.min(elastic , limit);
    }

    // 计算完弹性后的速度 速度始终向上
    var velocityY = Math.abs(curVelocityY) * elastic;

    // 速度不可小于反弹力
    velocityY = Math.max(velocityY , bounceSpeed);

    return velocityY;
}

// 转换器
var Converter = {};

/**
 * 里程转换
 * 
 * @param {any} num 实际的距离
 */
Converter.toMileage = function (num) {
    return Math.floor(num / Global.Common.Const.MILEAGE_RATIO);
};
/**
 * 速度转换
 * 
 * @param {any} num 实际的速度
 */
Converter.toSpeedPower = function (num) {
    return Math.floor(num / Global.Common.Const.VELOCITY_RATIO);
};

/**
 * 反弹高度转反弹速度
 *
 * @param {*} height
 * @returns
 */
Converter.toBounceSpeed = function (height) {
    return Math.sqrt(2 * Math.abs(cc.director.getPhysicsManager().gravity.y * Global.Common.Const.GRAVITY_SCALE) * height);  
};

/**
 * 从区间获取随机数
 * 
 * @param {any} min 最小值
 * @param {any} max 最大值
 * @returns 随机值
 */
Utils.random = function (min , max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


Utils.Calculator = Calculator;
Utils.Converter = Converter;

module.exports = Utils;