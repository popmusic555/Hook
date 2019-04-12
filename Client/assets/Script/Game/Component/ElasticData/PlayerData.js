
cc.Class({
    extends: cc.Component,

    properties: {
        // 弹性系数
        elasticity:{
            default:0,
        },
        // 附加值
        heightAddedValue:{
            default:0,
        },
        // 弹性阈值
        minHeight:{
            default:0,
        },
        // 摩擦力系数
        // friction:0,
        // 速度增加值
        speedAddedValue:{
            default:0,
        },
        // 速度阈值
        maxSpeed:{
            default:0,
        },
    },

    // onLoad () {},

    start () {

    },

    // 同步数据
    SyncData:function (gameObject) {
        gameObject.elasticity = this.elasticity;
        gameObject.heightAddedValue = this.heightAddedValue;
        gameObject.minHeight = this.minHeight;
        gameObject.speedAddedValue = this.speedAddedValue;
        gameObject.maxSpeed = this.maxSpeed;
    },

    SyncDataForNew:function (gameObject , elasticity , heightAddedValue , minHeight , speedAddedValue , maxSpeed) {
        if (elasticity || elasticity == 0) {
            gameObject.elasticity = elasticity;    
        }
        else
        {
            gameObject.elasticity = this.elasticity; 
        }

        if (heightAddedValue || heightAddedValue == 0) {
            gameObject.heightAddedValue = heightAddedValue;    
        }
        else
        {
            gameObject.heightAddedValue = this.heightAddedValue; 
        }

        if (minHeight || minHeight == 0) {
            gameObject.minHeight = minHeight;    
        }
        else
        {
            gameObject.minHeight = this.minHeight; 
        }

        if (speedAddedValue || speedAddedValue == 0) {
            gameObject.speedAddedValue = speedAddedValue;    
        }
        else
        {
            gameObject.speedAddedValue = this.speedAddedValue; 
        }

        if (maxSpeed || maxSpeed == 0) {
            gameObject.maxSpeed = maxSpeed;    
        }
        else
        {
            gameObject.maxSpeed = this.maxSpeed; 
        }
    },

    // update (dt) {},
});
