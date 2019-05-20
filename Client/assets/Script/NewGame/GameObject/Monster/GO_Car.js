
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
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,

        _Shadow:null,

        // 是否绑定
        _IsBind:false,

        // 持续时间
        _Duration:0,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;

        var shadow = this.node.getChildByName("Shadow").getComponent(cc.Sprite);
        this._Shadow = {
            // 阴影动画
            shadow:shadow,
            // 阴影动画位置
            shadowAni:this.node.position,
        };

        this._Duration = -1;
    },

    bind:function () {
        this._IsBind = true;
        this.run(this._Player.getVelocity() , this._Player.getGravityScale());
        this.animation.animation = "car_ljr_run01";
        this.scheduleOnce(function () {
            this.node.rotation = -30;
        }.bind(this) , 0);
    },

    unBind:function () {
        this._IsBind = false;
        this.scheduleOnce(function () {
            this.node.rotation = 0;
        }.bind(this) , 0);
        this.onDeath(this._Player);
    },

    setDuration:function (num) {
        this._Duration = num;  
        this.animation.animation = "car_ljr_runtx";
    },

    update (dt) {
        
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        if (!this._IsUpdate) {
            return;
        }
        this.updateVelocity();
        this.updateDuration();
    },

    updateVelocity:function () {
        if (this._IsBind) {
            return;
        }

        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MCar.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateDuration:function () {
        if (this._Duration > 0) {
            this._Duration -= 1;
        }
        
        if (this._Duration == 0) {
            console.log("汽车爆炸");
            var mplayer = Global.Model.MPlayer;
            mplayer.type = Global.Common.Enum.TYPE.PLAYER;
            this._Player.unBindMonster();   

            var Calculator = Global.Common.Utils.Calculator;
            var mCar = Global.Model.MCar;
            var attr = mCar.getAttr();
            var velocity = this._Player.getVelocity();
            var velocityX = velocity.x;
            var velocityY = velocity.y;

            // 处理Y轴速度 (弹性、反弹力处理)
            velocityY = Calculator.processVelocityY(velocityY , 0 , attr.endRideBounce , 0 , 0);
            // 限定Y速度 (限定速度区间)
            velocityY = mplayer.limitVelocityY(velocityY);
            // 处理X轴速度 (加速力处理)
            velocityX = Calculator.processVelocityX(velocityX , attr.endRideAccelerate , 0);
            // 限定X速度 (限定速度区间)
            velocityX = mplayer.limitVelocityX(velocityX);
            var newVelocity = cc.v2(velocityX , velocityY);
            // 玩家对象设置新速度
            this._Player.setVelocity(newVelocity);

            this._Player.animation.unlockState();  
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
            console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Car" , "player");
            Global.Model.MPlayer.handleCollision(contact, this._Player, otherCollider);
        }
        else
        {
            console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Car");
            Global.Model.MCar.handleCollision(contact, selfCollider, otherCollider);
        }
        
    },

    onDeath:function (player) {
        this._IsUpdate = false;
        this.sleep();
        this.static();
        if (player) {
            this.setVelocityX(player.getVelocityX());
        }
        this.showDeathAni();
    },

    showDeathAni:function () {
        this._Shadow.shadow.node.active = false;
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_cargbl";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },

    useSkill:function () {
        console.log("汽车技能使用");
        if (this._Duration <= 0) {
            return;
        }

        var mCar = Global.Model.MCar;
        var Calculator = Global.Common.Utils.Calculator;
        var attr = mCar.getAttr();
        var velocity = this.getVelocity();
        var velocityX = velocity.x;
        var velocityY = velocity.y;

        // 处理Y轴速度 (弹性、反弹力处理)
        velocityY = Calculator.processVelocityY(0 , 0 , attr.skillBounce , 0 , 0);
        // 限定Y速度 (限定速度区间)
        velocityY = mCar.limitVelocityY(velocityY);
        // 处理X轴速度 (加速力处理)
        velocityX = Calculator.processVelocityX(velocityX , attr.skillAccelerate , 0);
        // 限定X速度 (限定速度区间)
        velocityX = mCar.limitVelocityX(velocityX);
        var newVelocity = cc.v2(velocityX , velocityY);
        // 玩家对象设置新速度
        this.setVelocity(newVelocity);
    },
});