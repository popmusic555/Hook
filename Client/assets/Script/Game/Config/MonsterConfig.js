/**
 * 怪物配置文件
 * 
 */

var MonsterConfig = {};

MonsterConfig._Datas = null;

/**
 * 初始化
 * 
 * @param {any} tablename 表名称
 * @param {any} config 配置数据
 */
MonsterConfig.init = function (tablename , config) {
    if (!this._Datas) {
        this._Datas = {};    
    }
    this._Datas[tablename] = config;
};
/**
 * 根据等级获取数据
 * 
 * @param {any} level 等级
 */
MonsterConfig.getDataByLevel = function (tablename, level) {
    var datas = this.getTableByName(tablename);
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        if (data.level == level) {
            return datas[index];
        }
    }
};

MonsterConfig.getTableByName = function (tablename) {
    return this._Datas[tablename];
}

module.exports = MonsterConfig;

