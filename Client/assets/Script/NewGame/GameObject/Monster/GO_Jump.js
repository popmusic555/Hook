
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
        // plugin
        plugin:cc.Node,
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,
        _IsDeath:false,

        _Shadow:null,

        // 是否绑定
        _IsBind:false,

        // 弹跳次数
        _BounceTimes:0,
        // 是否在使用技能
        _isSkill:false,
        // 拳头
        _Fist:null,
        // 技能锁
        _SkillLock:false,
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

        this._BounceTimes = 3;
        this._IsSkill = false;
        this._Fist = this.plugin.getComponent("GO_JumpFist");
        this._SkillLock = false;
    },

    bind:function () {
        this._IsBind = true;  
        this.run(this._Player.getVelocity() , this._Player.getGravityScale());
        this.animation.animation = "ljr_ttj_run";
        this.animation.node.y = 0;
    },

    unBind:function () {
        this._IsBind = false;
        this.onDeath(this._Player);
    },

    update (dt) {
        
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    isUseSkill:function () {
        return this._IsSkill;
    },

    lateUpdate (dt) {
        this.updateVelocity();
        if (this._IsDeath) {
            return;
        }
        this.updateShadow();
        this.updateHighest();
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }
        if (this._IsBind) {
            return;
        }
        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MJump.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateShadow:function () {
        var aniNode = this._Shadow.shadow.node;
        var nodepos = aniNode.parent.convertToNodeSpaceAR(cc.v2(0 , 95));
        aniNode.y = nodepos.y;

        var scale = (-55 - aniNode.y) / 300;
        scale = Math.max(scale , 0);
        scale = Math.min(scale , 1);
        aniNode.scale = (1  - scale);
    },

    updateHighest:function () {
        var curVelocity = this.getVelocity();
        if (curVelocity.y < 0 && this._BounceTimes <= 0) {
            console.log("弹跳机爆炸");  
            var mplayer = Global.Model.MPlayer;
            mplayer.type = Global.Common.Enum.TYPE.PLAYER;
            this._Player.unBindMonster();   

            var Calculator = Global.Common.Utils.Calculator;
            var mJump = Global.Model.MJump;
            var attr = mJump.getAttr();
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

    reduceBounceTimes:function () {
        this._BounceTimes -= 1;  
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
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Jump" , "player");
            Global.Model.MPlayer.handleCollision(contact, this._Player, otherCollider);
        }
        else
        {
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Jump");
            Global.Model.MJump.handleCollision(contact, selfCollider, otherCollider);
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
        this.plugin.destroy();
        this.showDeathAni();
    },

    onDeathWithWall:function () {
        this._IsUpdate = false;
        this.static();
        this.onDeath(this._Player);
    },

    showDeathAni:function () {
        this._Shadow.shadow.node.active = false;
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_ttjgbl";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },

    useSkill:function () {
        console.log("弹跳机技能使用");

        if (this._SkillLock) {
            return;
        }

        this._SkillLock = true;
        this._IsSkill = true;

        var downAction = cc.moveBy(0.2 , 0 , -40);
        var upAction = downAction.reverse();
        var skillAction = cc.sequence(downAction , cc.delayTime(0.2) , cc.callFunc(function () {
            this._IsSkill = false;
        } , this) , upAction , cc.callFunc(function () {
            this._SkillLock = false;
        } , this));
        this.plugin.runAction(skillAction);
    },
});
