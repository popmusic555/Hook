
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");

/**
 * 普通怪物对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 人物对象
        _Player:GO_Base,
        // ani
        animation:sp.Skeleton,
        // 死亡动画
        deathAni:sp.Skeleton,
        // 爆炸动画
        boomAni:sp.Skeleton,
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,
        // 油桶怪
        oilMonsterPrefab:cc.Prefab,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,
        _IsDeath:false,

        // 是否绑定
        _IsBind:false,

        // 当前油桶生成数量
        _OilNum:0,
        // 当前油桶怪
        _OilMonster:null,
        // 持续时间
        _Duration:0,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;
        this._OilNum = 2;
        this._Duration = -1;
    },

    bind:function () {
        this._IsBind = true;  
        this.run(this._Player.getVelocity() , this._Player.getGravityScale());
        this.animation.animation = "xg_feiji_ljr";
        this.animation.node.y = 35;
        this.generateOil();
    },

    unBind:function () {
        this._IsBind = false;
        this.onDeath(this._Player);
    },

    update (dt) {
        
    },

    generateOil:function (oilName) {
        if (this._OilMonster) {
            if (this._OilMonster.name != oilName) {
                return;
            }
        }

        if (this._OilNum > 0) {
            this._OilNum -= 1;

            var pos = cc.Camera.main.node.convertToWorldSpaceAR(cc.v2(0,0));
            pos = this.node.parent.convertToNodeSpaceAR(pos);
            pos.x += cc.view.getVisibleSize().width * 0.5 + 120;
            pos.y += Global.Common.Utils.random(0 , 400) - 200;

            if (!Global.Model.MWall.isInside(pos.x + 150)) {
                // 可以生成
                var oil = cc.instantiate(this.oilMonsterPrefab);
                oil.name = this.node.name + "MOil" + this._OilNum;
                oil.x = pos.x;
                oil.y = pos.y;
                this.node.parent.addChild(oil);
                this._OilMonster = oil;
            }
            else
            {
                console.log("油桶生成在墙内");
            }
        }
        else
        {
            // 生成完毕
            this._Duration = Global.Model.MPlane.getAttr().duration * 60;
        }
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        this.updateVelocity();
        if (this._IsDeath) {
            return;
        }
        this.updateOil();
        this.updateDuration();
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }
        if (this._IsBind) {
            return;
        }

        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MPlane.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateOil:function () {
        if (!this._OilMonster || !cc.isValid(this._OilMonster)) {
            return;
        }
        var oilPoxX = this._OilMonster.x;
        if (oilPoxX - this.node.x < -500) {
            console.log("远离油桶 飞机爆炸");
            Global.Model.MPlayer.triggerFloor(null , this._Player , null , null);
        }
    },

    updateDuration:function () {
        if (this._Duration > 0) {
            this._Duration -= 1;
        }
        
        if (this._Duration == 0) {
            console.log("油桶生成完毕 飞机爆炸");
            Global.Model.MPlayer.triggerFloor(null , this._Player , null , null);
        }
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
        if (this._IsBind) {
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Plane" , "player");
            Global.Model.MPlayer.handleCollision(contact, this._Player, otherCollider);
        }
        else
        {
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Plane");
            Global.Model.MPlane.handleCollision(contact, selfCollider, otherCollider);
        }
    },

    onDeath:function (player) {
        if (this._IsDeath) {
            return;
        }
        this._IsDeath = true;
        this._CurRelativeVelocity.x = 0;
        this.sleep();
        this.static();
        this.showDeathAni();
        if (player) {
            this.setVelocityX(player.getVelocityX());
            // 随机获取任务碎片
            var fragment = Global.Model.MPlayer.randomFragment();
            if (fragment != -1) {
                Global.Model.MPlayer.addFragment(fragment);
            }
            // 增加击杀数量
            Global.Model.MPlayer.addOneKillNum();
        }
    },

    onDeathWithWall:function () {
        this._IsUpdate = false;
        this.static();
        this.onDeath();
    },

    showDeathAni:function () {
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.boomAni.node.active = true;
        this.deathAni.animation = "boom_plagbl";
        this.boomAni.animation = "gbl_zd_boom";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },

    useSkill:function () {
        console.log("飞机技能使用");
        var mplane = Global.Model.MPlane;
        var Calculator = Global.Common.Utils.Calculator;
        var attr = mplane.getAttr();
        var velocity = this.getVelocity();
        var velocityX = velocity.x;
        var velocityY = velocity.y;

        // 处理Y轴速度 (弹性、反弹力处理)
        velocityY = Calculator.processVelocityY(0 , 0 , attr.skillBounce , 0 , 0);
        // 限定Y速度 (限定速度区间)
        velocityY = mplane.limitVelocityY(velocityY);
        // 处理X轴速度 (加速力处理)
        velocityX = Calculator.processVelocityX(velocityX , attr.skillAccelerate , 0);
        // 限定X速度 (限定速度区间)
        velocityX = mplane.limitVelocityX(velocityX);
        var newVelocity = cc.v2(velocityX , velocityY);
        // 玩家对象设置新速度
        this.setVelocity(newVelocity);
    },
});
