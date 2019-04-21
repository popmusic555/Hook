
var GameCommon = require("GameCommon");
var DataManager = require("DataManager");
var MPlayer = require("MPlayer");
var GameMonster = require("GameMonster");

// 怪物生成器
cc.Class({
    extends: cc.Component,

    properties: {
        // 怪物预制
        monsterPrefabs:cc.Prefab,
        // player
        player:MPlayer,
        // 怪物名称
        monsterName:{
            default:"",
            tooltip:"怪物名称",
        },
        // 最大数量
        maxNum:{
            default:0,
            tooltip:"最大存活数量",
        },
        // 刷新间隔
        refreshInterval:{
            default:0,
            tooltip:"每批刷新间隔",
        },
        // 刷新概率
        refreshProbability:{
            default:0,
            tooltip:"每批刷新概率",
            range:[0 , 100],
        },
        // 刷新数量 (x=最大数量 , y=最小数量)
        refreshNum:{
            default:cc.Vec2.ZERO,
            tooltip:"每批刷新数量",
        },
        // 刷新范围宽度
        refreshRangeWidth:{
            default:0,
            tooltip:"刷新范围宽度",
        },
        // 刷新范围高度
        refreshRangeHeight:{
            default:0,
            tooltip:"刷新范围高度",
        }, 

        // 相对速度常数
        relativeSpeed:{
            default:0,
            visible:false,
        },
        // 相对速度范围
        relativeSpeedRange:{
            default:0,
            visible:false,
        },
        // 相对速度衰减值
        relativeSpeedDecay:{
            default:0,
            visible:false,
        },

        // 刷新点
        refreshPosX:{
            default:0,
            visible:false,
        },
        // 最大存活范围
        maxLiveRange:{
            default:0,
            visible:false,
        },

        // 总数量
        _TotalNum:0,
        // 当前刷新帧
        _CurFrame:0,
        // 当前相对速度
        _CurRelativeSpeed:0,

        // // X轴偏移值
        // xOffset:cc.Vec2,
        // // Y轴偏移值     
        // yOffset:cc.Vec2,   
        // // 速度偏移值
        // speedOffset:cc.Vec2,

        // // 出生点偏移值位置
        // _BrithPosOffset:0,

        // // 可超出最大范围
        // maxRange:{
        //     default:0,
        //     visible:false,
        // },
        // // 怪物总数量
        // _TotalMonsterNum:0,
        // // 当前刷新帧
        // _CurRefFrame:0,

        // // 初始发射速度
        // _LaunchingSpeed:0,


        // // 当前速度差
        // _CurSpeedDifference:0,
    },

    // onLoad () {},

    start () {
        this.refreshPosX = 1000;
        this.maxLiveRange = 1000;

        // 相对速度
        this.relativeSpeed = 700;
        // 相对速度范围
        this.relativeSpeedRange = 400;
        // 相对速度衰减值
        this.relativeSpeedDecay = 40;

        // 当前相对速度等于发射速度
        this._CurRelativeSpeed = DataManager.Userdata.launchingSpeed;
    },

    update (dt) {
        if (!this.player.isLaunching) {
            return;
        }

        var playerSpeed = this.player.getLinearVelocity().x;
        // 刷新相对速度
        this._CurRelativeSpeed = this.updateSpeedDifference(this._CurRelativeSpeed , this.relativeSpeedDecay);
        this.RemoveMonster();
        this.GenerateMonster(playerSpeed);
    },

    /**
     * 刷新相对速度 使之衰减到相对速度常数 每帧衰减
     * 
     * @param {any} relativeSpeed 当前相对速度
     * @param {any} relativeSpeedDecay 相对速度衰减
     * @returns 真实的相对速度
     */
    updateSpeedDifference:function (relativeSpeed , relativeSpeedDecay) {
        var result = relativeSpeed - relativeSpeedDecay;
        if (result < this.relativeSpeed) {
            result = this.relativeSpeed;
        }
        return result;
    },

    /**
     * 生成怪物
     * 
     * @param {any} playerSpeed 
     */
    GenerateMonster:function (playerSpeed) {
        this._CurFrame++;
        if (this._CurFrame <= this.refreshInterval) {
            return;
        }
        this._CurFrame = 0;

        // 概率判断
        var random = Math.random();
        if (random <= this.refreshProbability / 100) {
            // 创建一批怪物
            this.createMonster(playerSpeed);    
        }
    },
    /**
     * 创建一批怪物
     * 
     * @param {any} playerSpeed 人物速度
     * @returns 
     */
    createMonster:function (playerSpeed) {
        // new cc.Node().childrenCount
        // 可创建数量
        var canCreateNum = this.maxNum - this.node.childrenCount;
        if (canCreateNum <= 0) {
            return;
        }

        // 随机生成数量
        var refreshNum = GameCommon.GET_RANDOM(this.refreshNum.x , this.refreshNum.y);
        refreshNum = Math.min(canCreateNum , refreshNum);

        // 刷新位置
        var refreshPosX = cc.Camera.main.node.x + this.refreshPosX;  //+ GameCommon.GET_RANDOM(xOffset.x , xOffset.y);
        
        // 相对速度区间分段
        var num = 20;

        // 循环生成
        for (let index = 0; index < refreshNum; index++) {
            // 生成位置
            var posX = refreshPosX + GameCommon.GET_RANDOM(0 , this.refreshRangeWidth);
            // 生成位置是否在墙内
            if (GameCommon.isInWall(posX)) {
                return;
            }

            var speedOffset = this._CurRelativeSpeed - this.relativeSpeedRange / num * GameCommon.GET_RANDOM(0 , num);
            var speed = playerSpeed - speedOffset;

            var monster = this.createSingleMonster(this.getMonsterName() , posX , speed);
            this.node.addChild(monster);
        }
    },
    /**
     * 创建单个怪物
     * 
     * @param {any} name 怪物名称
     * @param {any} posX X坐标
     * @param {any} speed 速度
     * @returns 怪物节点
     */
    createSingleMonster:function (name , posX , speed) {
        var monsterNode = cc.instantiate(this.monsterPrefabs);
        monsterNode.name = name;
        monsterNode.x = posX;

        var num = 3;
        monsterNode.y = monsterNode.y + this.refreshRangeHeight / num * GameCommon.GET_RANDOM(0 , num);
        var monster = monsterNode.getComponent(GameMonster);
        monster.setLinearVelocity(speed , 0);

        this._TotalMonsterNum++;
        return monsterNode;
    },

    // 删除怪物
    RemoveMonster:function () {
        var len = this.node.childrenCount;
        // 当前摄像机位置
        var cameraPosx = cc.Camera.main.node.x;
        for (let index = 0; index < len; index++) {
            var childNode = this.node.children[index];
            if (cameraPosx - childNode.x > this.maxLiveRange) {
                childNode.destroy();
            }
            if (childNode.x - cameraPosx > this.refreshPosX + this.refreshRangeWidth) {
                childNode.destroy();
            }
        }
    },

    getMonsterName:function () {
        return this.monsterName + this._TotalMonsterNum;
    },

});
