
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
    return Timer.getTimeForSec() + this._Timedifference;
}
/**
 * 修正当前时间
 * 
 */
Timer.correct = function (serverTime) {
    var clientTime = Timer.getTimeForSec();
    this._Timedifference = serverTime - clientTime;
    return serverTime;
}

Timer.getTimeForSec = function () {
    return Math.floor(new Date().getTime() / 1000);
}

module.exports = Timer;