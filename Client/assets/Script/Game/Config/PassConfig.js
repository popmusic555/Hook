/**
 * 人物配置文件
 * 
 */

var PassConfig = {};

PassConfig._Datas = null;

/**
 * 初始化
 * 
 * @param {any} config 配置数据
 */
PassConfig.init = function (config) {
    this._Datas = config;
    this._MaxPassID = this.initMaxPassID();
};
/**
 * 根据等级获取数据
 * 
 * @param {any} passID 等级
 */
PassConfig.getDataByPassID = function (passID) {
    if (passID > this._MaxPassID) {
        passID = this._MaxPassID;
    }
    var datas = this._Datas;
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        if (data.passID == passID) {
            
            return datas[index];
        }
    }
};

PassConfig.initMaxPassID = function () {
    var result = 0;
    var datas = this._Datas;
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        if (data.passID > result) {
            result = data.passID;
        }
    }
    return result;
};

PassConfig.getMaxPassID = function () {
    return this._MaxPassID;  
};

PassConfig.getPassNum = function () {
    return this._MaxPassID+1;
}

module.exports = PassConfig;



