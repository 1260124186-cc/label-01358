const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const storage = require('../../utils/storage');

const PLAY_MODES = [
  { id: 'order', name: '顺序播放', icon: '🔁' },
  { id: 'loop', name: '单曲循环', icon: '🔂' },
  { id: 'random', name: '随机播放', icon: '🔀' }
];

const PLAYBACK_RATES = [0.75, 1.0, 1.25, 1.5];

const SLEEP_TIMES = [
  { minutes: 0, label: '关闭' },
  { minutes: 15, label: '15分钟' },
  { minutes: 30, label: '30分钟' },
  { minutes: 60, label: '60分钟' }
];

Page({
  data: {
    categories: mockData.BROADCAST_CATEGORIES,
    currentCategory: 'all',
    broadcastList: [],
    filteredList: [],
    currentAudio: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTimeText: '00:00',
    durationText: '00:00',
    playMode: 'order',
    playModeIndex: 0,
    playbackRate: 1.0,
    showRatePicker: false,
    showSleepPicker: false,
    sleepMinutes: 0,
    sleepRemaining: 0,
    sleepTimerText: '',
    favorites: [],
    recentList: [],
    showListTab: 'all',
    darkMode: false,
    lyrics: [],
    currentLyricIndex: -1,
    showLyrics: false,
    isCurrentFavorite: false
  },

  innerAudioContext: null,
  sleepTimer: null,
  sleepInterval: null,

  onLoad() {
    this.initAudioContext();
    this.loadData();
    this.loadPreferences();
    this.loadFavorites();
    this.loadRecent();
  },

  onShow() {
    this.loadThemeState();
  },

  onUnload() {
    this.clearSleepTimer();
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
  },

  onHide() {
    // 页面隐藏时继续后台播放
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  initAudioContext() {
    this.innerAudioContext = wx.createInnerAudioContext();

    this.innerAudioContext.onPlay(() => {
      this.setData({ isPlaying: true });
    });

    this.innerAudioContext.onPause(() => {
      this.setData({ isPlaying: false });
    });

    this.innerAudioContext.onStop(() => {
      this.setData({
        isPlaying: false,
        currentTime: 0,
        currentTimeText: '00:00',
        currentLyricIndex: -1
      });
    });

    this.innerAudioContext.onEnded(() => {
      this.handleOnEnded();
    });

    this.innerAudioContext.onTimeUpdate(() => {
      const currentTime = Math.floor(this.innerAudioContext.currentTime || 0);
      const duration = Math.floor(this.innerAudioContext.duration || 0);

      this.setData({
        currentTime,
        duration,
        currentTimeText: this.formatDuration(currentTime),
        durationText: this.formatDuration(duration)
      });

      this.updateLyricIndex(currentTime);
    });

    this.innerAudioContext.onCanplay(() => {
      const duration = Math.floor(this.innerAudioContext.duration || 0);
      this.setData({
        duration,
        durationText: this.formatDuration(duration)
      });
    });

    this.innerAudioContext.onError((err) => {
      console.error('音频播放错误:', err);
      util.showToast('播放失败，请重试');
      this.setData({ isPlaying: false });
    });
  },

  loadData() {
    const broadcastList = mockData.BROADCAST_LIST.map(item => ({
      ...item,
      cover: item.cover || '/assets/images/default-broadcast.png'
    }));

    this.setData({
      broadcastList,
      filteredList: broadcastList,
      currentAudio: broadcastList[0] || null,
      lyrics: broadcastList[0]?.lyrics || []
    });
  },

  loadPreferences() {
    const playMode = storage.get(storage.STORAGE_KEYS.BROADCAST_PLAY_MODE) || 'order';
    const playbackRate = storage.get(storage.STORAGE_KEYS.BROADCAST_PLAYBACK_RATE) || 1.0;
    const playModeIndex = PLAY_MODES.findIndex(m => m.id === playMode);

    this.setData({
      playMode,
      playModeIndex: playModeIndex >= 0 ? playModeIndex : 0,
      playbackRate
    });

    if (this.innerAudioContext) {
      this.innerAudioContext.playbackRate = playbackRate;
    }
  },

  loadFavorites() {
    const favorites = storage.getList(storage.STORAGE_KEYS.BROADCAST_FAVORITES);
    const isCurrentFavorite = this.data.currentAudio
      ? favorites.some(item => item.id === this.data.currentAudio.id)
      : false;
    const favoriteIds = favorites.map(f => f.id);
    const filteredList = this.data.filteredList.map(item => ({
      ...item,
      isFavorite: favoriteIds.indexOf(item.id) > -1
    }));
    this.setData({ favorites, isCurrentFavorite, filteredList });
  },

  loadRecent() {
    const recentList = storage.getList(storage.STORAGE_KEYS.BROADCAST_RECENT);
    this.setData({ recentList });
  },

  savePlayMode(mode) {
    storage.set(storage.STORAGE_KEYS.BROADCAST_PLAY_MODE, mode);
  },

  savePlaybackRate(rate) {
    storage.set(storage.STORAGE_KEYS.BROADCAST_PLAYBACK_RATE, rate);
  },

  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  onSwitchCategory(e) {
    const { id } = e.currentTarget.dataset;
    const { broadcastList } = this.data;

    let filteredList;
    if (id === 'all') {
      filteredList = broadcastList;
    } else {
      filteredList = broadcastList.filter(item => item.category === id);
    }

    this.setData({
      currentCategory: id,
      filteredList
    });
  },

  onSwitchListTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ showListTab: tab });
  },

  playAudio(audio) {
    if (!audio || !audio.audioUrl) {
      util.showToast('暂无音频资源');
      return;
    }

    this.innerAudioContext.src = audio.audioUrl;
    this.innerAudioContext.playbackRate = this.data.playbackRate;
    this.innerAudioContext.play();

    this.addToRecent(audio);

    this.setData({
      lyrics: audio.lyrics || [],
      currentLyricIndex: -1
    });
  },

  onSelectAudio(e) {
    const { item } = e.currentTarget.dataset;

    if (this.data.currentAudio && this.data.currentAudio.id === item.id) {
      this.onPlayPause();
    } else {
      const isCurrentFavorite = this.isFavorite(item.id);
      this.setData({
        currentAudio: item,
        currentTime: 0,
        currentTimeText: '00:00',
        showLyrics: false,
        isCurrentFavorite
      });
      this.playAudio(item);
    }
  },

  onPlayPause() {
    if (!this.data.currentAudio) {
      util.showToast('请选择节目');
      return;
    }

    if (this.data.isPlaying) {
      this.innerAudioContext.pause();
    } else {
      if (this.innerAudioContext.src === this.data.currentAudio.audioUrl) {
        this.innerAudioContext.play();
      } else {
        this.playAudio(this.data.currentAudio);
      }
    }
  },

  onPrev() {
    const list = this.getPlayList();
    if (!this.data.currentAudio || list.length === 0) return;

    const currentIndex = list.findIndex(item => item.id === this.data.currentAudio.id);
    let prevIndex;

    if (this.data.playMode === 'random') {
      prevIndex = Math.floor(Math.random() * list.length);
    } else {
      prevIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
    }

    const prevAudio = list[prevIndex];
    this.setData({
      currentAudio: prevAudio,
      currentTime: 0,
      currentTimeText: '00:00'
    });
    this.playAudio(prevAudio);
  },

  onNext() {
    const list = this.getPlayList();
    if (!this.data.currentAudio || list.length === 0) return;

    const currentIndex = list.findIndex(item => item.id === this.data.currentAudio.id);
    let nextIndex;

    if (this.data.playMode === 'random') {
      nextIndex = Math.floor(Math.random() * list.length);
    } else {
      nextIndex = currentIndex >= list.length - 1 ? 0 : currentIndex + 1;
    }

    const nextAudio = list[nextIndex];
    this.setData({
      currentAudio: nextAudio,
      currentTime: 0,
      currentTimeText: '00:00'
    });
    this.playAudio(nextAudio);
  },

  handleOnEnded() {
    if (this.data.playMode === 'loop') {
      this.innerAudioContext.seek(0);
      this.innerAudioContext.play();
    } else {
      this.onNext();
    }
  },

  getPlayList() {
    if (this.data.showListTab === 'favorites') {
      return this.data.favorites;
    } else if (this.data.showListTab === 'recent') {
      return this.data.recentList;
    }
    return this.data.filteredList;
  },

  onSeek(e) {
    const position = e.detail.value;
    this.innerAudioContext.seek(position);
    this.setData({
      currentTime: position,
      currentTimeText: this.formatDuration(position)
    });
  },

  onChangePlayMode() {
    const currentIndex = this.data.playModeIndex;
    const nextIndex = (currentIndex + 1) % PLAY_MODES.length;
    const nextMode = PLAY_MODES[nextIndex];

    this.setData({
      playMode: nextMode.id,
      playModeIndex: nextIndex
    });

    this.savePlayMode(nextMode.id);
    util.showToast(nextMode.name);
  },

  onToggleRatePicker() {
    this.setData({
      showRatePicker: !this.data.showRatePicker,
      showSleepPicker: false
    });
  },

  onSelectRate(e) {
    const { rate } = e.currentTarget.dataset;
    this.innerAudioContext.playbackRate = rate;
    this.setData({
      playbackRate: rate,
      showRatePicker: false
    });
    this.savePlaybackRate(rate);
    util.showToast(`${rate}x 倍速`);
  },

  onToggleSleepPicker() {
    this.setData({
      showSleepPicker: !this.data.showSleepPicker,
      showRatePicker: false
    });
  },

  onSelectSleepTime(e) {
    const { minutes } = e.currentTarget.dataset;
    this.setSleepTimer(minutes);
    this.setData({
      sleepMinutes: minutes,
      showSleepPicker: false
    });
  },

  setSleepTimer(minutes) {
    this.clearSleepTimer();

    if (minutes <= 0) {
      this.setData({
        sleepMinutes: 0,
        sleepRemaining: 0,
        sleepTimerText: ''
      });
      return;
    }

    const totalSeconds = minutes * 60;
    this.setData({
      sleepRemaining: totalSeconds,
      sleepTimerText: `${minutes}分钟后停止`
    });

    this.sleepInterval = setInterval(() => {
      const remaining = this.data.sleepRemaining - 1;
      if (remaining <= 0) {
        this.clearSleepTimer();
        if (this.innerAudioContext) {
          this.innerAudioContext.pause();
        }
        util.showToast('定时结束，已暂停播放');
        this.setData({
          sleepMinutes: 0,
          sleepRemaining: 0,
          sleepTimerText: ''
        });
      } else {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        this.setData({
          sleepRemaining: remaining,
          sleepTimerText: `${mins}:${String(secs).padStart(2, '0')} 后停止`
        });
      }
    }, 1000);
  },

  clearSleepTimer() {
    if (this.sleepInterval) {
      clearInterval(this.sleepInterval);
      this.sleepInterval = null;
    }
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  },

  onToggleFavorite(e) {
    const { item } = e.currentTarget.dataset;
    const isFavorite = this.isFavorite(item.id);

    if (isFavorite) {
      storage.removeFromList(storage.STORAGE_KEYS.BROADCAST_FAVORITES, item.id);
      util.showToast('已取消收藏');
    } else {
      storage.addToList(storage.STORAGE_KEYS.BROADCAST_FAVORITES, {
        ...item,
        favoriteTime: Date.now()
      });
      util.showToast('已添加到收藏');
    }

    this.loadFavorites();
  },

  isFavorite(id) {
    return this.data.favorites.some(item => item.id === id);
  },

  addToRecent(audio) {
    const list = storage.getList(storage.STORAGE_KEYS.BROADCAST_RECENT);
    const filtered = list.filter(item => item.id !== audio.id);
    filtered.unshift({
      ...audio,
      playTime: Date.now()
    });
    if (filtered.length > 50) filtered.splice(50);
    storage.set(storage.STORAGE_KEYS.BROADCAST_RECENT, filtered);
    this.setData({ recentList: filtered });
  },

  onToggleLyrics() {
    this.setData({
      showLyrics: !this.data.showLyrics
    });
  },

  updateLyricIndex(currentTime) {
    const { lyrics } = this.data;
    if (!lyrics || lyrics.length === 0) return;

    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }

    if (index !== this.data.currentLyricIndex) {
      this.setData({ currentLyricIndex: index });
    }
  },

  onClosePicker() {
    this.setData({
      showRatePicker: false,
      showSleepPicker: false
    });
  },

  onPlayFromFavorite(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      currentAudio: item,
      currentTime: 0,
      currentTimeText: '00:00',
      showListTab: 'all',
      isCurrentFavorite: true
    });
    this.playAudio(item);
  },

  onPlayFromRecent(e) {
    const { item } = e.currentTarget.dataset;
    const isCurrentFavorite = this.isFavorite(item.id);
    this.setData({
      currentAudio: item,
      currentTime: 0,
      currentTimeText: '00:00',
      showListTab: 'all',
      isCurrentFavorite
    });
    this.playAudio(item);
  }
});
