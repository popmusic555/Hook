
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
        _IsDeath:false,

        _Shadow:null,

        // 是否绑定
        _IsBind:false,
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
    },

    update (dt) {
        
    },

    bind:function () {
        this._IsBind = true; 
        this.run(this._Player.getVelocity() , this._Player.getGravityScale());
        // 设置角速度
        // this.setAngularVelocity(300);
        this.animation.animation = "xg_srh_lvr" + Global.Common.Utils.random(1 , 2);
        this.animation.node.runAction(cc.repeatForever(cc.rotateBy(0.5 , 300)));
    },

    unBind:function () {
        this._IsBind = false;
        this.scheduleOnce(function () {
            this.node.rotation = 0;
        }.bind(this) , 0);
        this.onDeath(this._Player);
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        this.updateVelocity();
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }

        if (this._IsBind) {
            return;
        }
        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MClip.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
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
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "clip" , "player");
            Global.Model.MPlayer.handleCollision(contact, this._Player, otherCollider);
        }
        else
        {
            // console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "clip");
            Global.Model.MClip.handleCollision(contact, selfCollider, otherCollider);
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
        this.deathAni.animation = "boom_jzgbl";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },

    useSkill:function () {
        console.log("夹子使用技能");

        var mplayer = Global.Model.MPlayer;
        mplayer.type = Global.Common.Enum.TYPE.PLAYER;
        this._Player.unBindMonster();
        this._Player.useSkill();
    },
});
