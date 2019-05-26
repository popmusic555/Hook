
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
        // 提示
        tips:cc.Sprite,
        // 最大相对速度
        maxRelativeVelocity:cc.Vec2.ZERO,
        // 最小相对速度
        minRelativeVelocity:cc.Vec2.ZERO,

        _CurRelativeVelocity:cc.Vec2.ZERO,

        _IsUpdate:false,
        _IsDeath:false,
        _TipsPos:null,

        _Duration:0,
    },

    // onLoad () {},

    start () {
        this._Player = Global.Model.MPlayer.getPlayerObj();
        this.randomRelativeVelocity();
        this._IsUpdate = true;  
        this._TipsPos = cc.v2(this.tips.x , this.tips.y);

        this.setDuration(Global.Model.MPlane.getAttr().duration * 60);
    },

    setDuration:function (num) {
        this._Duration = num;
    },

    update (dt) {
        
    },

    randomRelativeVelocity:function () {
        this._CurRelativeVelocity.x = Global.Common.Utils.random(this.minRelativeVelocity.x , this.maxRelativeVelocity.x);
    },

    lateUpdate (dt) {
        this.updateVelocity();

        if (this.tips.node.active) {
            var pos = this.tips.node.parent.convertToWorldSpaceAR(this._TipsPos);
            pos = cc.Camera.main.getWorldToCameraPoint(pos);
            if (pos.y > cc.view.getVisibleSize().height - 80) {
                pos.y = cc.view.getVisibleSize().height - 80;
            }
            if (pos.y < 0 + 80) {
                pos.y = 0 + 80;
            }
            pos = cc.Camera.main.getCameraToWorldPoint(pos);
            pos = this.tips.node.parent.convertToNodeSpaceAR(pos);
            // this.tips.node.x = pos.x;
            this.tips.node.y = pos.y;
        }
    },

    updateVelocity:function () {
        if (!this._IsUpdate) {
            return;
        }

        if (this._Duration > 0) {
            this._Duration -= 1;
        }
        
        if (this._Duration == 0) {
            // 开始运动
            var velocityX = this._Player.getVelocityX();
            velocityX = velocityX - this._CurRelativeVelocity.x;
            this.setVelocityX(velocityX);
            this.tips.node.active = false;
        }
        else
        {
            var velocityX = this._Player.getVelocityX();
            this.setVelocityX(velocityX);
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
        Global.Model.MFly.handleCollision(contact, selfCollider, otherCollider);
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
            var fragment = Global.Model.MPlayer.getFragmentForRandom();
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
        this.tips.node.active = false;
        this.animation.node.active = false;
        this.tips.node.active = false;
        this.deathAni.node.active = true;
        this.deathAni.animation = "boom_spz";
        this.deathAni.setCompleteListener(function () {
            this.node.destroy();
        }.bind(this));  
    },
});
