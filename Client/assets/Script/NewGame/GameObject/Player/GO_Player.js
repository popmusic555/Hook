
var GO_Base = require("GO_Base");
var GlobalEnum = require("GlobalEnum");
var Ani_Player = require("Ani_Player");
var VArtillery = require("VArtillery");

/**
 * 玩家对象
 */
cc.Class({
    extends: GO_Base,

    properties: {
        // 玩家动画
        animation:Ani_Player,
        // 大炮
        artillery:VArtillery,
        // 玩家状态
        state:{
            default:GlobalEnum.P_STATE.READY,
            type:GlobalEnum.P_STATE,
        },

        // 当前绑定的怪物 绑定怪物会跟随人物一起运动
        _BindMonster:null,
        _BindMonsterPos:cc.Vec2.ZERO,
        _BindMonsterFrist:false,

        // 穿墙
        _CrossWall:null,

        _Shadow:null,

        _SpData:null,
    },

    onLoad () {
        var crossWallAni = this.node.getChildByName("CrossWallAni").getComponent(sp.Skeleton);
        var touchdownAni = this.node.getChildByName("TouchdownAni").getComponent(sp.Skeleton);
        var shadow = this.node.getChildByName("Shadow").getComponent(cc.Sprite);

        this._CrossWall = {
            canCross:0,
            // 撞墙发射速度
            wallLaunchVelocity:null,
            // 撞墙动画
            crossWallAni:crossWallAni,
            // 撞墙动画位置
            crossWallAniPos:cc.Vec2.ZERO,
        }

        this._Touchdown = {
            // 触地动画
            touchdownAni:touchdownAni,
            // 触地动画位置
            touchdownAniPos:cc.Vec2.ZERO,
        }
        
        this._Shadow = {
            // 阴影动画
            shadow:shadow,
            // 阴影动画位置
            shadowAni:this.node.position,
        };
    },

    start () {
        Global.Model.MPlayer.setPlayerObj(this);
        this.animation.transState(GlobalEnum.P_ANI_STATE.READY);
    },

    update (dt) {
        if (this.node.x >= 0) {
            Global.Model.MPlayer.setMileage(this.node.x + 812);    
        }

        var velocityX = this.getVelocity().x;
        var velocityY = this.getVelocity().y;

        if (velocityY > 0) {
            if (this.animation.getState() == GlobalEnum.P_ANI_STATE.SKILL) {
                this.animation.unlockState();
            }
            this.animation.transState(GlobalEnum.P_ANI_STATE.FLY);
        }
        else if (velocityY < 0) {
            if (Global.Model.MPlayer.isImpact(velocityY)) {
                this.animation.transState(GlobalEnum.P_ANI_STATE.IMPACT);
            }
            else
            {
                this.animation.transState(GlobalEnum.P_ANI_STATE.DROP);
            }
        }
        
        if (velocityX == 0)
        {
            if (velocityY == 0 && this.getGravityScale() == 0) {
                // 死亡状态
                if (this.animation.getState() != GlobalEnum.P_ANI_STATE.READY) {
                    this.animation.transState(GlobalEnum.P_ANI_STATE.DEATH2);    
                }
            }
            else
            {
                this.animation.transState(GlobalEnum.P_ANI_STATE.DEATH1);
                this.sleep();
            }
        }
    },

    lateUpdate (dt) {
        this.updateHoleAni();
        this.updateTouchdownAni();
        this.updateShadow();

        this.updateBindMonster();
    },

    /**
     * 发射
     * 
     * @param {any} velocity 发射速度
     */
    launching:function (velocity) {
        this.state = GlobalEnum.P_STATE.NORMAL;
        this.animation.transState(GlobalEnum.P_ANI_STATE.LAUNCH);
        this.run(velocity , Global.Common.Const.GRAVITY_SCALE);

        this.showShadow();

        // this.setGravityScale(Global.Common.Const.GRAVITY_SCALE);
        // this.schedule(function () {
        //     // console.log("------------");
        //     this.rigidbody.applyForceToCenter(velocity);
        //     console.log(this.getVelocity());
        // }.bind(this) , 0 , 59 , 0);

        // this.node.runAction(cc.sequence(cc.delayTime(1.0) , cc.callFunc(function () {
        //     this.setGravityScale(Global.Common.Const.GRAVITY_SCALE);
        // } , this)));
        // 播放发射音效
    },

    launchingForSpeed:function (speed) {
        // 大炮
        this.artillery.launching(speed , function (velocityX , velocityY) {
            console.log("发射速度" , velocityX , velocityY)
            this.animation.transState(GlobalEnum.P_ANI_STATE.LAUNCH);
            var vCamera = cc.Camera.main.getComponent("VCamera");
            vCamera.targetFollow = this.node;
            vCamera.anchorPos.x = -(cc.view.getVisibleSize().width / 2 - 250);
            this.launching(cc.v2(velocityX , velocityY));
            this.node.parent.getChildByName("Monster").getComponent("VMonster").launching();
        }.bind(this));
    },  

    /**
     * 穿墙1
     * 
     * @param {any} canCross 是否可以穿越
     */
    crossWall1:function (canCross) {
        this.animation.transStateAndLock(GlobalEnum.P_ANI_STATE.HITWALL);
        this.setCrossWall(canCross);
    },
    /**
     * 穿墙2
     * 
     * @param {any} velocity 穿墙速度
     */
    crossWall2:function (velocity) {
        if (velocity) {
            this.animation.transStateAndLock(GlobalEnum.P_ANI_STATE.HITWALL);
            this.setWallLaunchVelocity(velocity);
            this.static();
            this.setVelocityX(Global.Common.Const.INWALL_SPEED);    
        }
        else
        {
            this.animation.unlockState();
        }
    },
    /**
     * 穿墙3
     * 
     * @param {any} velocity 出墙速度
     */
    crossWall3:function (velocity) {
        this.animation.unlockState();
        this.setVelocity(velocity);
        this.setGravityScale(Global.Common.Const.GRAVITY_SCALE);
        this.setCrossWall(false);
        this.setWallLaunchVelocity(null);
    },
    /**
     * 触发受伤
     * 
     * @returns 是否触发成功
     */
    onHurt:function () {
        // if (this.animation.getState() == GlobalEnum.P_ANI_STATE.SKILL) {
        //     return false;
        // }

        // if (this.animation.getState() == GlobalEnum.P_ANI_STATE.IMPACT) {
        //     return false;
        // }

        this.animation.transStateAndLock(GlobalEnum.P_ANI_STATE.HURT);
        // return true;
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
        if (this._BindMonster) {
            var other = otherCollider.node.getComponent(Global.GameObj.GBase);
            if (!(other.getType() == Global.Common.Enum.TYPE.WALL && otherCollider.tag == 1)) {
                contact.disabled = true; 
                return;    
            }
        }
        console.log(selfCollider.node.name , "碰撞" , otherCollider.node.name , "碰撞回调" , "player");
        Global.Model.MPlayer.handleCollision(contact, selfCollider, otherCollider);
    },

    /**
     * 设置是否可以穿墙
     * 
     * @param {any} flag 
     */
    setCrossWall:function (flag) {
        this._CrossWall.canCross = flag;
    },

    /**
     * 是否可以穿墙
     * 
     * @returns 是否可以穿墙
     */
    isCanCrossWall:function () {
        return this._CrossWall.canCross;
    },
    /**
     * 设置出墙发射速度
     * 
     * @param {any} velocity 
     */
    setWallLaunchVelocity:function (velocity) {
        this._CrossWall.wallLaunchVelocity = velocity;
    },
    /**
     * 获取出墙发射速度
     * 
     * @returns 出墙发射速度
     */
    getWallLaunchVelocity:function () {
        return this._CrossWall.wallLaunchVelocity;
    },
    /**
     * 显示穿墙破洞动画
     * 
     */
    showHoleAni:function () {
        this._CrossWall.crossWallAni.node.active = true;
        this._CrossWall.crossWallAni.animation = "posui";
        this._CrossWall.crossWallAni.setCompleteListener(function () {
            this._CrossWall.crossWallAni.node.active = false;
        }.bind(this));

        var aniNode = this._CrossWall.crossWallAni.node;
        var worldPos = aniNode.parent.convertToWorldSpaceAR(cc.v2(315 , 0));

        this._CrossWall.crossWallAniPos = worldPos;
    },

    /**
     * 显示触地动画
     * 
     */
    showTouchdownAni:function () {
        this._Touchdown.touchdownAni.node.active = true;
        this._Touchdown.touchdownAni.animation = "zadi";

        this._Touchdown.touchdownAni.setCompleteListener(function () {
            this._Touchdown.touchdownAni.node.active = false;
        }.bind(this));
    },

    /**
     * 显示阴影
     * 
     */
    showShadow:function () {
        this._Shadow.shadow.node.active = true;
    },

    /**
     * 更新穿墙破洞动画
     * 
     */
    updateHoleAni:function () {
        var aniNode = this._CrossWall.crossWallAni.node;
        if (aniNode.active) {
            var nodepos = aniNode.parent.convertToNodeSpaceAR(this._CrossWall.crossWallAniPos);
            aniNode.x = 315;
            aniNode.y = nodepos.y;
        }
    },

    /**
     * 更新触地动画
     * 
     */
    updateTouchdownAni:function () {
        var aniNode = this._Touchdown.touchdownAni.node;
        if (aniNode.active) {
            var nodepos = aniNode.parent.convertToNodeSpaceAR(cc.v2(0 , 90));
            aniNode.y = nodepos.y;
        }
    },

    /**
     * 更新阴影
     * 
     */
    updateShadow:function () {
        var aniNode = this._Shadow.shadow.node;
        var nodepos = aniNode.parent.convertToNodeSpaceAR(cc.v2(0 , 90));
        aniNode.y = nodepos.y;

        var scale = (-55 - aniNode.y) / 400;
        scale = Math.max(scale , 0);
        scale = Math.min(scale , 1);
        aniNode.scale = (1  - scale);
    },

    onAttack:function () {
        this.animation.transStateAndLock(GlobalEnum.P_ANI_STATE.ATTACK , 0.2);
    },

    /**
     * 点击
     * 
     */
    onTouched:function () {
        if (this.animation.getState() == GlobalEnum.P_ANI_STATE.READY) {
            this.launchingForSpeed(1000);
        }
        else
        {
            if (this._BindMonster) {
                this._BindMonster.useSkill();
            }
            else
            {
                this.useSkill();
            }
            
        }
    },
    /**
     * 使用技能
     * 
     * @returns 
     */
    useSkill:function () {
        console.log("使用技能");
        if (this.animation.getState() == GlobalEnum.P_ANI_STATE.SKILL) {
            return;
        }

        if (this.animation.getState() == GlobalEnum.P_ANI_STATE.DEATH1) {
            return;
        }

        if (this.animation.getState() == GlobalEnum.P_ANI_STATE.DEATH2) {
            return;
        }

        if (this.getGravityScale() == 0) {
            return;
        }

        this.castSkill();
    },
    /**
     * 触发技能
     * 
     */
    castSkill:function () {
        if (!Global.Model.MPlayer.isEnoughEnergy(Global.Common.Const.ENERGY_RATIO)) {
            return;
        }
        this.setVelocityY(-2000);
        this.animation.transStateAndLock(GlobalEnum.P_ANI_STATE.SKILL);
        Global.Model.MPlayer.reduceEnergy(Global.Common.Const.ENERGY_RATIO);
    },
    /**
     * 震屏
     * 
     */
    shockScreen:function () {
        this.node.parent.getComponent("VGame").shockScreen();
    },  

    /**
     * 绑定怪物
     *
     */
    bindMonster:function (monster , pos) {
        if (!this._BindMonster) {
            this._BindMonster = monster;
            this._BindMonster.bind();  
            this._BindMonsterFrist = true;
            if (pos) {
                this._BindMonsterPos = pos;
            }
            else
            {
                this._BindMonsterPos = cc.v2(0,0);
            }
            this.animation.node.parent.active = false;
        }
    },  

    /**
     * 解绑怪物
     *
     */
    unBindMonster:function (notDeath) {
        if (this._BindMonster) {
            this._BindMonster.unBind(notDeath);
            this._BindMonster = null;
            this.animation.node.parent.active = true;
        }
    },

    isBind:function () {
        return !!this._BindMonster;  
    },

    getBindMonster:function () {
        return this._BindMonster;  
    },

    updateBindMonster:function () {
        if (!this._BindMonster) {
            return;
        }

        if (this._BindMonsterFrist) {
            this._BindMonsterFrist = false;
            // 设置位置
            var worldPos = this.node.parent.convertToWorldSpaceAR(cc.v2(this.node.x , this.node.y));
            var nodePos = this._BindMonster.node.parent.convertToNodeSpaceAR(worldPos);
            this._BindMonster.node.position = nodePos.sub(this._BindMonsterPos);
        }
        else
        {
            var worldPos = this._BindMonster.node.parent.convertToWorldSpaceAR(this._BindMonster.node.position);
            var nodePos = this.node.parent.convertToNodeSpaceAR(worldPos);
            this.node.position = nodePos.add(this._BindMonsterPos);
        }

        this.setVelocity(this._BindMonster.getVelocity());
        
    },
});
