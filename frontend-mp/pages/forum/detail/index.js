const dataService = require('/services/data');
const constants = require('/config/constants');
const util = require('/utils/util');
const fileUtil = require('/utils/file');
const { mixPage } = require('/utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isLiked: false,
    isFavorited: false,
    isFollowing: false,
    commentText: '',
    commentAnonymous: false,
    showReportPicker: false,
    reportReasons: constants.FORUM_REPORT_REASONS,
    showDeleteConfirm: false,
    showMoreMenu: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) { this.loadDetail(); }
  },

  loadDetail() {
    const detail = dataService.getForumPostDetail(this.data.id);
    if (detail) {
      dataService.increaseForumPostViews(this.data.id);
      const formattedDetail = {
        ...detail,
        timeText: util.relativeTime(detail.createTime),
        typeInfo: constants.FORUM_POST_TYPES.find(t => t.value === detail.type) || {},
        topicLabels: (detail.topics || []).map(t => {
          const found = constants.FORUM_TOPIC_LIST.find(tp => tp.value === t);
          return found ? found.label : t;
        }),
        comments: (detail.comments || []).map(c => ({
          ...c,
          timeText: util.relativeTime(c.createTime)
        }))
      };
      this.setData({ detail: formattedDetail });
      this.checkStates();
    }
  },

  checkStates() {
    const isLiked = dataService.isForumPostLiked(this.data.id);
    const isFavorited = dataService.isForumPostFavorited(this.data.id);
    let isFollowing = false;
    if (this.data.detail && !this.data.detail.isAnonymous && this.data.detail.userId) {
      isFollowing = dataService.isFollowingAuthor(this.data.detail.userId);
    }
    this.setData({ isLiked, isFavorited, isFollowing });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleLike() {
    if (!util.checkLogin()) return;
    const result = dataService.toggleForumPostLike(this.data.id);
    if (result.success) {
      this.setData({ isLiked: result.isLiked, 'detail.likes': result.likes });
    }
  },

  onToggleFavorite() {
    if (!util.checkLogin()) return;
    const result = dataService.toggleForumPostFavorite(this.data.id);
    if (result.success) {
      this.setData({ isFavorited: result.isFavorite });
      util.showSuccess(result.isFavorite ? '收藏成功' : '已取消收藏');
    }
  },

  onFollowAuthor() {
    if (!util.checkLogin()) return;
    if (!this.data.detail || this.data.detail.isAnonymous) { util.showToast('匿名用户无法关注'); return; }
    const result = dataService.followForumAuthor(this.data.detail.userId);
    if (result.success) {
      this.setData({ isFollowing: result.isFollowing });
      util.showSuccess(result.isFollowing ? '关注成功' : '已取消关注');
    }
  },

  onCommentInput(e) { this.setData({ commentText: e.detail.value }); },
  onToggleCommentAnonymous() { this.setData({ commentAnonymous: !this.data.commentAnonymous }); },

  onSubmitComment() {
    if (!util.checkLogin()) return;
    const content = this.data.commentText.trim();
    if (!content) { util.showToast('请输入评论内容'); return; }
    const result = dataService.addForumComment(this.data.id, content, this.data.commentAnonymous);
    if (result.success) {
      this.setData({ commentText: '', commentAnonymous: false });
      this.loadDetail();
      util.showSuccess('评论成功');
    } else {
      util.showError(result.message || '评论失败');
    }
  },

  onCommentLike(e) {
    if (!util.checkLogin()) return;
    const { id } = e.currentTarget.dataset;
    dataService.toggleForumCommentLike(this.data.id, id);
    this.loadDetail();
  },

  onToggleMoreMenu() {
    this.setData({ showMoreMenu: !this.data.showMoreMenu });
  },

  onHideMoreMenu() {
    this.setData({ showMoreMenu: false });
  },

  onMoreReport() {
    this.setData({ showMoreMenu: false });
    this.onShowReport();
  },

  onMoreDelete() {
    this.setData({ showMoreMenu: false });
    this.onDeletePost();
  },

  onShowReport() { this.setData({ showReportPicker: true }); },
  onHideReport() { this.setData({ showReportPicker: false }); },

  onReport(e) {
    const { value } = e.currentTarget.dataset;
    const result = dataService.reportForumPost(this.data.id, value);
    if (result.success) {
      this.setData({ showReportPicker: false });
      util.showSuccess('举报成功');
    } else {
      util.showToast(result.message || '举报失败');
    }
  },

  onDeletePost() {
    if (!util.checkLogin()) return;
    util.showConfirm('确定要删除这篇帖子吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.deleteForumPost(this.data.id);
        if (result.success) {
          util.showSuccess('已删除').then(() => { wx.navigateBack(); });
        } else {
          util.showError(result.message || '删除失败');
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.detail ? this.data.detail.title : '校园论坛帖子',
      path: `/pages/forum/detail?id=${this.data.id}`
    };
  },

  stopPropagation() {}
});
