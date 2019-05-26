
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
        // 任务描述Label
        taskDescLabel:cc.Label,
        // 任务星级
        taskStar:[cc.Button],
        // 拼图
        jigsaw:cc.Node,

        // 领取按钮
        receiveBtn:cc.Button,
        
        _TaskDesc:null,
        
    },

    onLoad () {
        this._TaskDesc = [
            "杀死100只小怪",
            "邀请一个好友",
            "收集所有的碎片",
        ];
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
        console.log("领取奖励成功");
        // 切换到下一个任务
        Global.Model.Game.nextTask();
        this.show();
    },

    hide:function () {
        this.node.active = false;  
    },

    show:function () {
        this.node.active = true;  

        this.setTaskId(Global.Model.Game.getTask().id);
        this.setRewardId(Global.Model.Game.getTask().rewardId);

        this.setTaskStar(this.taskId);
        this.setTaskDesc(this.taskId);
        this.setTaskIcon(this.taskId);
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
            // 任务完成 可领取奖励
            this.receiveBtn.interactable = true;
        }
        else
        {
            this.receiveBtn.interactable = false;
        }

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
        this.taskDescLabel.string = this._TaskDesc[taskId];
    },

    // 设置任务Icon
    setTaskIcon:function (taskId) {
        this.taskIcon.spriteFrame = this.taskIconRes[taskId];
    },

    // 设置奖励Icon
    setRewardIcon:function (rewardId) {
        console.log("rewardId" , rewardId);
        this.rewardIcon.spriteFrame = this.rewardIconRes[rewardId];
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
        var result = false;

        switch (taskid) {
            case 0:
                var num = Global.Model.Game.getKillNum();
                result = num >= 100;
                break;
            case 1:
                // 邀请好友人数
                result = Global.Model.Game.getFriend().length > 0
                break;
            case 2:
                result = Global.Model.Game.fullFragment();
                break;
        }

        return result;
    },

    // update (dt) {},
});
