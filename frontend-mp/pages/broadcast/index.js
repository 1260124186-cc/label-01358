const config = require('../../config/index');
const util = require('../../utils/util');

Page({
  data: {
    broadcastList: [],
    currentAudio: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTimeText: '00:00',
    durationText: '00:00'
  },

  // 使用 InnerAudioContext 实现音频播放
  innerAudioContext: null,

  onLoad() {
    this.initAudioContext();
    this.loadData();
  },

  onUnload() {
    // 页面卸载时销毁音频实例
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
  },

  // 初始化 InnerAudioContext
  initAudioContext() {
    this.innerAudioContext = wx.createInnerAudioContext();
    
    // 播放事件
    this.innerAudioContext.onPlay(() => {
      this.setData({ isPlaying: true });
    });
    
    // 暂停事件
    this.innerAudioContext.onPause(() => {
      this.setData({ isPlaying: false });
    });

    // 停止事件
    this.innerAudioContext.onStop(() => {
      this.setData({ 
        isPlaying: false, 
        currentTime: 0, 
        currentTimeText: '00:00' 
      });
    });
    
    // 播放结束事件
    this.innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false });
      this.onNext();
    });
    
    // 时间更新事件
    this.innerAudioContext.onTimeUpdate(() => {
      const currentTime = Math.floor(this.innerAudioContext.currentTime || 0);
      const duration = Math.floor(this.innerAudioContext.duration || 0);
      
      this.setData({
        currentTime,
        duration,
        currentTimeText: this.formatDuration(currentTime),
        durationText: this.formatDuration(duration)
      });
    });
    
    // 可以播放事件（获取音频时长）
    this.innerAudioContext.onCanplay(() => {
      const duration = Math.floor(this.innerAudioContext.duration || 0);
      this.setData({
        duration,
        durationText: this.formatDuration(duration)
      });
    });
    
    // 错误事件
    this.innerAudioContext.onError((err) => {
      console.error('音频播放错误:', err);
      util.showToast('播放失败，请重试');
      this.setData({ isPlaying: false });
    });
  },

  loadData() {
    const broadcastList = config.BROADCAST_LIST.map(item => ({
      ...item,
      cover: item.cover || '/assets/images/default-broadcast.png'
    }));

    const firstAudio = broadcastList[0] || null;
    
    this.setData({ 
      broadcastList,
      currentAudio: firstAudio
    });
  },

  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  // 播放音频
  playAudio(audio) {
    if (!audio || !audio.audioUrl) {
      util.showToast('暂无音频资源');
      return;
    }
    
    // 设置音频源并播放
    this.innerAudioContext.src = audio.audioUrl;
    this.innerAudioContext.play();
  },

  // 选择音频
  onSelectAudio(e) {
    const { item } = e.currentTarget.dataset;
    
    if (this.data.currentAudio && this.data.currentAudio.id === item.id) {
      // 点击当前播放的音频，切换播放/暂停
      this.onPlayPause();
    } else {
      // 切换到新音频
      this.setData({ 
        currentAudio: item,
        currentTime: 0,
        currentTimeText: '00:00'
      });
      this.playAudio(item);
    }
  },

  // 播放/暂停
  onPlayPause() {
    if (!this.data.currentAudio) {
      util.showToast('请选择节目');
      return;
    }
    
    if (this.data.isPlaying) {
      this.innerAudioContext.pause();
    } else {
      // 如果是同一首继续播放，否则重新播放
      if (this.innerAudioContext.src === this.data.currentAudio.audioUrl) {
        this.innerAudioContext.play();
      } else {
        this.playAudio(this.data.currentAudio);
      }
    }
  },

  // 上一首
  onPrev() {
    const { broadcastList, currentAudio } = this.data;
    if (!currentAudio || broadcastList.length === 0) return;
    
    const currentIndex = broadcastList.findIndex(item => item.id === currentAudio.id);
    const prevIndex = currentIndex <= 0 ? broadcastList.length - 1 : currentIndex - 1;
    const prevAudio = broadcastList[prevIndex];
    
    this.setData({ 
      currentAudio: prevAudio,
      currentTime: 0,
      currentTimeText: '00:00'
    });
    this.playAudio(prevAudio);
  },

  // 下一首
  onNext() {
    const { broadcastList, currentAudio } = this.data;
    if (!currentAudio || broadcastList.length === 0) return;
    
    const currentIndex = broadcastList.findIndex(item => item.id === currentAudio.id);
    const nextIndex = currentIndex >= broadcastList.length - 1 ? 0 : currentIndex + 1;
    const nextAudio = broadcastList[nextIndex];
    
    this.setData({ 
      currentAudio: nextAudio,
      currentTime: 0,
      currentTimeText: '00:00'
    });
    this.playAudio(nextAudio);
  },

  // 进度条拖动
  onSeek(e) {
    const position = e.detail.value;
    this.innerAudioContext.seek(position);
    this.setData({
      currentTime: position,
      currentTimeText: this.formatDuration(position)
    });
  }
});
