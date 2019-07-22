
var WxAdapter = require("WxAdapter");

cc.Class({
    extends: cc.Component,

    properties: {
        taskId:0,
        rewardId:0,

        // 任务图标资源
        taskIconRes:[cc.SpriteFrame],
        // 任务奖励图标资源
        rewardIconRes:[cc.SpriteFrame],
        // 任务图标对象
        taskIcon:cc.Sprite,
        // 任务奖励对象
        rewardIcon:cc.Sprite,
        rewardAni:sp.Skeleton,
        // 任务描述Label
        taskDescLabel:cc.RichText,
        // 任务剩余时间
        taskTimesLabel:cc.Label,
        // 任务星级
        taskStar:[cc.Button],
        // 拼图
        jigsaw:cc.Node,
        content:cc.Node,

        // 领取按钮
        receiveBtn:cc.Button,
        // 分享按钮
        shareBtn:cc.Button,
        
        _Timecallback:null,
        
        _Progress:0,
    },

    onLoad () {
    },

    start () {
    },

    _SetTaskBg:function () {

    },

    setTaskId:function (id) {
        this.taskId = id;
    },

    setRewardId:function (id) {
        this.rewardId = id;
    },

    onReceiveBtn:function () {
        Global.Common.Audio.playEffect("btn2Click" , false);
        console.log("领取奖励成功");
        // 领取任务奖励
        Global.Common.Http.req("getTaskAward" , {
            uuid:Global.Model.Game.uuid,
            taskID:Global.Model.Game.getTask().id+1,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            var result = parseInt(resp[0]);
            if (result != 0) {
                return;
            }
            // 增加任务奖励
            Global.Model.Game.addRevive(parseInt(resp[1]));
            var vMain = cc.Camera.main.node.parent.getComponentInChildren("VMain");
            vMain.refreshTopBar();
            // 切换到下一个任务
            Global.Model.Game.nextTask();
            Global.Model.Game.getTask().state = 0;
            this.show();
        }.bind(this));
    },

    onShare:function () {
        Global.Common.Audio.playEffect("btn1Click" , false);
        // 分享
        Global.Model.Game.share(WxAdapter , 1);
    },

    hide:function () {
        this.node.active = false;  
    },

    show:function () {
        // 任务信息获取
        Global.Common.Http.req("getTasks" , {
            uuid:Global.Model.Game.uuid,
        } , function (resp , url) {
            console.log("Response " , url , resp);
            this.node.active = true;
            this.content.active =  true;
            // 任务ID
            var taskId = parseInt(resp[0]) - 1;
            Global.Model.Game.getTask().id = taskId;
            if (taskId == 0) {
                // 任务0 击杀100小怪
                // 目标值
                // 任务进度
                Global.Model.Game.setKillNum(parseInt(resp[2]));
                this._Progress = Global.Model.Game.getKillNum();
            }
            else if (taskId == 1) {
                // 任务1 邀请一个好友
                // 目标值
                // 任务进度
                this._Progress = parseInt(resp[2]);
            }
            else if (taskId == 2) {
                // 任务2 收集拼图
                // 目标值
                // 任务进度
                Global.Model.Game.initFragment(parseInt(resp[2]));
                this._Progress = Global.Model.Game.getFragmentNum();
            }
            // 任务状态
            Global.Model.Game.getTask().state = parseInt(resp[3]);
            // 奖励类型
            Global.Model.Game.getTask().rewardId = parseInt(resp[4]);
            // 奖励剩余时间
            Global.Model.Game.getTask().times = parseInt(resp[5]);

            this.refresh();
        }.bind(this));
    },

    refresh:function () {
        this.setTaskId(Global.Model.Game.getTask().id);
        this.setRewardId(Global.Model.Game.getTask().rewardId);

        this.setTaskStar(this.taskId);
        this.setTaskDesc(this.taskId);
        this.setTaskIcon(this.taskId);

        
        this.unschedule(this._Timecallback);
        this._Timecallback = this.refreshTimes.bind(this);
        this.setTaskTimes(Global.Model.Game.getTask().times);
        this.schedule(this._Timecallback , 1);

        if (this.taskId == 2) {
            this.setRewardIcon(this.taskId + this.rewardId);
            this.setJigsaw(Global.Model.Game.getTask().fragment);
        }
        else
        {
            this.setRewardIcon(this.taskId);
            this.setJigsaw();
        }
        if (this.isFinshTask(this.taskId)) {
            this.shareBtn.node.active = false;
            this.receiveBtn.node.active = true;
            // 任务完成 可领取奖励
            this.receiveBtn.interactable = true;
        }
        else
        {
            if (this.taskId == 1) {
                this.shareBtn.node.active = true;
                this.receiveBtn.node.active = false;
            }
            else
            {
                this.shareBtn.node.active = false;
                this.receiveBtn.node.active = true;
                this.receiveBtn.interactable = false;
            }
            
        }
    },

    refreshTimes:function () {
        Global.Model.Game.getTask().times -= 1;
        this.setTaskTimes(Global.Model.Game.getTask().times);
    },
    
    // 设置任务星级
    setTaskStar:function (taskId) {
        var len = this.taskStar.length;
        for (let index = 0; index < len; index++) {
            var item = this.taskStar[index];
            if (taskId == index) {
                item.interactable = false;
            }
            else
            {
                item.interactable = true;
            }
        }
    },

    // 设置任务描述
    setTaskDesc:function (taskId) {
        var desc = Global.Common.Const.TASK_DESC[taskId];
        var progress = Math.min(this._Progress , desc[2]);
        var progressText = "<color=#e6000a>" + progress + "</c>";
        this.taskDescLabel.string = "任务" + (taskId+1) + "：" + desc[0] + progressText + "/" + "" + desc[1];
    },

    // 设置任务剩余时间
    setTaskTimes:function (times) {
        var timeString = Global.Common.Utils.getTimeToTimeString(times);
        this.taskTimesLabel.string = timeString;
    },

    // 设置任务Icon
    setTaskIcon:function (taskId) {
        this.taskIcon.spriteFrame = this.taskIconRes[taskId];
    },

    // 设置奖励Icon
    setRewardIcon:function (rewardId) {
        console.log("rewardId" , rewardId);
        this.rewardIcon.spriteFrame = this.rewardIconRes[rewardId];
        if (rewardId >= 2) {
            this.rewardAni.node.active = true;
            this.rewardIcon.node.scale = 1;
        }
        else
        {
            this.rewardAni.node.active = false;
            this.rewardIcon.node.scale = 3;
        }
    },

    // 设置拼图
    setJigsaw:function (fragment) {
        if (fragment) {
            this.jigsaw.active = true;
        }
        else
        {
            this.jigsaw.active = false;
            return;
        }

        var jigsaw = this.jigsaw.children;
        var len = fragment.length;
        for (let index = 0; index < len; index++) {
            var item = fragment[index];
            var fragmentNode = jigsaw[index];
            if (item) {
                // 当前有拼图
                fragmentNode.active = true;
            }
            else
            {
                // 当前无拼图
                fragmentNode.active = false;
            }
        }
    },

    // 是否完成任务
    isFinshTask:function (taskid) {
        // var result = false;
        // switch (taskid) {
        //     case 0:
        //         var num = Global.Model.Game.getKillNum();
        //         result = num >= 100;
        //         break;
        //     case 1:
        //         // 邀请好友人数
        //         result = Global.Model.Game.getFriend().length > 0
        //         break;
        //     case 2:
        //         result = Global.Model.Game.fullFragment();
        //         break;
        // }
        var result = false;
        var state = Global.Model.Game.getTask().state;
        if (state == 1) {
            result = true;
        }
        return result;
    },

    // update (dt) {},
});
