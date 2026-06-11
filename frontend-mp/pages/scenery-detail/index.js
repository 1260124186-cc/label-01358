const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    scenery: null,
    commentInput: '',
    comments: [],
    categoryInfo: null,
    seasonInfo: null,
    solarTermInfo: null,
    locationName: '',
    showMapModal: false,
    mapMarkers: [],
    mapLatitude: 39.9042,
    mapLongitude: 116.4074,
    isLiked: false,
    likeCount: 0,
    commentCount: 0,
    uploadTime: ''
  },

  onLoad(options) {
    const { id } = options;
    this.loadSceneryDetail(id);
  },

  loadSceneryDetail(id) {
    util.showLoading();
    const scenery = mockData.SCENERY_LIST.find(item => item.id === id);
    
    if (!scenery) {
      util.hideLoading();
      util.showError('内容不存在');
      setTimeout(() => util.navigateBack(), 1500);
      return;
    }

    const categoryInfo = constants.SCENERY_CATEGORY_MAP[scenery.category];
    const seasonInfo = constants.SCENERY_SEASONS.find(s => s.value === scenery.season);
    const solarTermInfo = constants.SCENERY_SOLAR_TERMS.find(t => t.value === scenery.solarTerm);
    
    const formattedComments = (scenery.comments || []).map(c => ({
      ...c,
      timeText: util.relativeTime(c.createTime)
    }));

    const mapMarkers = scenery.location ? [{
      id: 1,
      latitude: scenery.location.latitude,
      longitude: scenery.location.longitude,
      iconPath: '/assets/icons/nav-scenery.png',
      width: 40,
      height: 40,
      callout: {
        content: scenery.location.label,
        color: '#333',
        fontSize: 12,
        borderRadius: 8,
        bgColor: '#fff',
        padding: 6,
        display: 'ALWAYS'
      }
    }] : [];

    this.setData({
      scenery,
      comments: formattedComments,
      categoryInfo,
      seasonInfo,
      solarTermInfo,
      locationName: scenery.location ? scenery.location.label : '',
      mapMarkers,
      mapLatitude: scenery.location ? scenery.location.latitude : 39.9042,
      mapLongitude: scenery.location ? scenery.location.longitude : 116.4074,
      isLiked: scenery.liked,
      likeCount: scenery.likes,
      commentCount: scenery.commentCount,
      uploadTime: util.relativeTime(scenery.createTime)
    });

    util.hideLoading();
  },

  onPreviewImage() {
    if (this.data.scenery) {
      fileUtil.previewImage([this.data.scenery.image]);
    }
  },

  onLike() {
    if (!util.checkLogin()) return;

    const newLiked = !this.data.isLiked;
    const newCount = newLiked ? this.data.likeCount + 1 : this.data.likeCount - 1;
    
    this.setData({
      isLiked: newLiked,
      likeCount: newCount
    });

    util.showToast(newLiked ? '点赞成功' : '已取消点赞');
  },

  onCommentInput(e) {
    this.setData({
      commentInput: e.detail.value
    });
  },

  onSubmitComment() {
    if (!util.checkLogin()) return;

    const content = this.data.commentInput.trim();
    if (!content) {
      util.showToast('请输入评论内容');
      return;
    }

    const newComment = {
      id: util.generateId(),
      userId: 'current_user',
      userName: '当前用户',
      avatar: '/assets/images/default-avatar.png',
      content,
      createTime: Date.now(),
      likes: 0,
      timeText: '刚刚'
    };

    const comments = [newComment, ...this.data.comments];
    this.setData({
      comments,
      commentInput: '',
      commentCount: this.data.commentCount + 1
    });

    util.showSuccess('评论成功');
  },

  onLikeComment(e) {
    if (!util.checkLogin()) return;

    const { index } = e.currentTarget.dataset;
    const comments = [...this.data.comments];
    comments[index].likes += 1;
    
    this.setData({ comments });
    util.showToast('点赞成功');
  },

  onOpenLocation() {
    if (this.data.scenery && this.data.scenery.location) {
      this.setData({ showMapModal: true });
    }
  },

  onCloseMapModal() {
    this.setData({ showMapModal: false });
  },

  onNavigateToMap() {
    if (this.data.scenery && this.data.scenery.location) {
      const { latitude, longitude, label } = this.data.scenery.location;
      wx.openLocation({
        latitude,
        longitude,
        name: label,
        address: '校园内',
        scale: 18
      });
    }
  },

  onShareAppMessage() {
    if (this.data.scenery) {
      return {
        title: `${this.data.scenery.title} - 校园风光`,
        path: `/pages/scenery-detail/index?id=${this.data.scenery.id}`,
        imageUrl: this.data.scenery.image
      };
    }
    return {
      title: '校园风光',
      path: '/pages/scenery/index'
    };
  }
});
