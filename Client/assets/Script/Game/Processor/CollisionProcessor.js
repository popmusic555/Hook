
// 碰撞处理器

// 将所有碰撞信号发送到这里 统一进行处理

// 处理时机在lataUpdate中，这能保证 所有的刚体 可以手动的设置位置 

/**
 * 信号对象
 * 
 */
var Signal = function () {
    // 信号值
    this._SignalValue = 0;
    // 有效状态
    this._Valid = true;
    // 处理回调
    this._Callback = null;
    // 回调对象
    this._CallbackTarget = null;
    // 回调参数
    this._CallbackParam = null;

    this.init();
};
/**
 * 初始化
 * 
 */
Signal.prototype.init = function () {

};

/**
 * 获取信号值
 * 
 * @returns 
 */
Signal.prototype.getSignalValue = function () {
    return this._SignalValue;
};

/**
 * 设置信号值
 * 
 * @param {any} value 
 */
Signal.prototype.setSignalValue = function (value) {
    this._SignalValue = value;
};

/**
 * 信号是否有效
 * 
 * @returns true有效 false无效
 */
Signal.prototype.IsValid = function () {
    return this._Valid;
};

/**
 * 设置信号是否有效
 * 
 * @param {any} valid 
 */
Signal.prototype.setNotValid = function () {
    this._Valid = false;
    this._Callback = null;
    this._CallbackTarget = null;
};

/**
 * 处理函数
 * 
 */
Signal.prototype.handle = function () {
    if (this._Callback && this._CallbackTarget) {
        return this._Callback.apply(this._CallbackTarget , this._CallbackParam);
    }
    return true;
};

Signal.prototype.setHandleCallback = function (callback , target , ...arg) {
    this._Callback = callback;
    this._CallbackTarget = target;
    this._CallbackParam = arg;
};


//-----------------------------------------------------------------------------------

/**
 * 信道对象
 * 
 */
var Channel = function () {
    // 信号组
    this._SignalGroup = this.CreateGroup();
};

/**
 * 创建信号组
 * 
 * @param {any} maxnum 最大信号数量
 * @returns 信号组
 */
Channel.prototype.CreateGroup = function (maxnum) {
    var group = new Array;

    return group;
};

/**
 * 获取信号组
 * 
 * @returns 信号组
 */
Channel.prototype.GetGroup = function () {
    return this._SignalGroup;
};

/**
 * 插入信号
 * 
 * @param {any} signalObj 信号对象
 */
Channel.prototype.insert = function (signalObj) {
    var group = this.GetGroup();
    group.push(signalObj);
}
 
/**
 * 获取信号
 * 
 * @param {any} signalValue 信号值
 * @returns 信号对象
 */
Channel.prototype.getSignal = function (signalValue) {
    var group = this.GetGroup();

    // 遍历信号
    var len = group.length;
    for (let index = 0; index < len; index++) {
        const signal = group[index];
        
        if (signalValue == signal.getSignalValue()) {
            return signal;
        }

    }
};

/**
 * 删除信号
 * 
 * @param {any} signalValue 信号值
 */
Channel.prototype.remove = function (signalValue) {
    var group = this.GetGroup();
    // 获取信号
    var signal = this.getSignal(signalValue);
    // 设置其无效
    signal.setNotValid();
};

/**
 * 清除所有信道中的信号
 * 
 */
Channel.prototype.Clear = function () {
    var group = this.GetGroup();
    group.length = 0;
};

/**
 * 更新信道
 * 删除无效信号 在此操作 此函数不要在循环删除中调用
 */
Channel.prototype.ToUpdate = function () {
    var group = this.GetGroup();

    // 遍历信号
    var len = group.length;
    for (let index = len-1; index >= 0; index--) {
        const signal = group[index];
        if (!signal.IsValid()) {
            group.splice(index , 1);
        }
    }
};
/**
 * 处理函数
 * 
 */
Channel.prototype.handle = function () {
    var group = this.GetGroup();

    // 遍历信号
    var len = group.length;
    // console.log("ChannelGroup lenth " , len);
    for (let index = 0; index < len; index++) {
        const signal = group[index];
        if (signal.handle()) {
            signal.setNotValid();    
        }
    }
};

//-----------------------------------------------------------------------------------------------------


// ------------------------------------碰撞处理器 (单信道处理器)-----------------------------------------
var CollisionProcessor = function () {
    // 信道值
    this._SignalValue_ = 0;

    // 创建信道
    this._Channel = this.CreateChannel();
};

// 触发碰撞
CollisionProcessor.prototype.triggerCollision = function (contact, selfGameObject, otherGameObject , callback , target) {
    var signal = this.CreateCollisionSignal();
    signal.setHandleCallback(callback , target , selfGameObject, otherGameObject);
    this._Channel.insert(signal);
};

/**
 * 创建碰撞信号
 * 
 * @param {any} signalValue 信号值
 * @returns 信号对象
 */
CollisionProcessor.prototype.CreateCollisionSignal = function (signalValue) {
    var signal = new Signal();
    return signal;
};

/**
 * 创建信道
 * 
 * @returns 
 */
CollisionProcessor.prototype.CreateChannel = function () {
    var channel = new Channel();

    return channel;
};

/**
 * 处理函数
 * 每帧处理 分发到各个碰撞对象中
 */
CollisionProcessor.prototype.handle = function () {
    this._Channel.handle();
    this._Channel.ToUpdate();
};

//-----------------------------------------------------------------------------------------------------

module.exports = CollisionProcessor;

