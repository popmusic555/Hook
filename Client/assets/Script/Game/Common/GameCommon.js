var GameCommon = {};

GameCommon.GetUIView = function (UIView) {
    return cc.find("Canvas/Main Camera/UI").getComponent(UIView);
};

module.exports = GameCommon;