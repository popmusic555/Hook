/**
 * 人物配置文件
 * 
 */

var PlayerConfig = {};

PlayerConfig._Datas = null;

/**
 * 初始化
 * 
 * @param {any} config 配置数据
 */
PlayerConfig.init = function (config) {
    this._Datas = config;
};
/**
 * 根据等级获取数据
 * 
 * @param {any} level 等级
 */
PlayerConfig.getDataByLevel = function (level) {
    var datas = this._Datas;
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        if (data.level == level) {
            return datas[index];
        }
    }
};

module.exports = PlayerConfig;



