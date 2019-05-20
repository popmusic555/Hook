
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

        // 是否绑定
        _IsBind:false,

        _LastVelocity:false,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;
        this._LastVelocity = cc.v2(0,0);
    },

    bind:function () {
        this._IsBind = true;  
        this.run(this._Player.getVelocity() , this._Player.getGravityScale());
        this.animation.animation = "ljr_hj_run";
    },

    unBind:function (notDeath) {
        this._IsBind = false;
        if (!notDeath) {
            this.onDeath(this._Player);    
        }
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
        this.updateHighest();
    },

    updateVelocity:function () {
        if (this._IsBind) {
            return;
        }

        var velocityX = this._Player.getVelocityX();
        velocityX = Global.Model.MRocket.limitVelocityX(velocityX - this._CurRelativeVelocity.x);
        this.setVelocityX(velocityX);
    },

    updateHighest:function () {
        var curVelocity = this.getVelocity();
        // console.log("curVelocity.y" , curVelocity.y , "this._LastVelocity.y" , this._LastVelocity.y);
        if (curVelocity.y < 0) {
            console.log("火箭爆炸");  
            if (this._IsBind) {
                var mplayer = Global.Model.MPlayer;
                mplayer.type = Global.Common.Enum.TYPE.PLAYER;
                this._Player.unBindMonster();   
                this._Player.animation.unlockState();    
            }
            else
            {
                this.onDeath(this._Player);
            }
        }
        // this._LastVelocity.x = curVelocity.x;
        // this._LastVelocity.y = curVelocity.y;
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
            console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Rocket" , "player");
            Global.Model.MPlayer.handleCollision(contact, this._Player, otherCollider);
        }
        else
        {
            console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "Rocket");
            Global.Model.MRocket.handleCollision(contact, selfCollider, otherCollider);
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
        this.animation.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_hjpgbl";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },

    useSkill:function () {
        console.log("火箭技能使用");
        var mplayer = Global.Model.MPlayer;
        mplayer.type = Global.Common.Enum.TYPE.PLAYER;
        this._Player.unBindMonster(true);
        this._Player.useSkill();
    },
});
