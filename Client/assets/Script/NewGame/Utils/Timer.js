
var Timer = {};

Timer.init = function () {
    // 时差
    this._Timedifference = 0;
}

/**
 * 获取当前时间
 * 
 */
Timer.getTime = function () {
    return new Data().getTime() + this._Timedifference;
}
/**
 * 修正当前时间
 * 
 */
Timer.correct = function (serverTime) {
    var clientTime = new Data().getTime();
    this._Timedifference = serverTime - clientTime;
    return serverTime;
}

module.exports = Timer;