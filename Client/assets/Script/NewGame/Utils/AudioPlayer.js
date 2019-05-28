// 音乐音效
var Auido = {};

Audio.init = function () {
    this._Enabled = false;
    this._AudioClips = {};
    this._BGM = null;
    this._BGMLoop = false;
};
/**
 * 设置音乐资源
 * 
 * @param {any} name 名称
 * @param {any} clip 音频资源
 */
Audio.setAudioClip = function (name , clip) {
    this._AudioClips[name] = clip;
};  

Audio.getAudioClip = function (name) {
    return this._AudioClips[name];
};

Audio.enabled = function (flag) {
    this._Enabled = flag;
    if (this._Enabled) {
        if (this._BGM) {
            this.playMusic(this._BGM , this._BGMLoop);    
        }
    }
    else
    {
        cc.audioEngine.stopAll();
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
    }
};

Audio.playMusic = function (name , loop) {
    console.log("playMusic" , name);
    this._BGM = name;
    this._BGMLoop = loop;
    if (!this._Enabled) {
        return false;
    }
    var clip = this.getAudioClip(name);
    if (!clip) {
        return false;
    }
    cc.audioEngine.playMusic(clip , loop);
    return true;
};

Audio.stopMusic = function () {
    if (!this._Enabled) {
        return;
    }
    cc.audioEngine.stopMusic();
}

Audio.playEffect = function (name , loop) {
    if (!this._Enabled) {
        return 0;
    }
    var clip = this.getAudioClip(name);
    if (!clip) {
        return 0;
    }
    return cc.audioEngine.playEffect(clip , loop);
}

Audio.stopEffect = function (audioId) {
    if (!this._Enabled) {
        return false;
    }
    cc.audioEngine.stopEffect(audioId)
};

module.exports = Audio;