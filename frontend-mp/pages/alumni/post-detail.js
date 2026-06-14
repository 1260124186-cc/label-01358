const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    postId: '',
    post: null,
    loading: true,
    isLiked: false,
    commentInput: '',
    comments: []
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ postId: id });
    this.loadPostDetail();
  },

  onShow() {
    if (this.data.postId) {
      this.loadPostDetail();
    }
  },

  loadPostDetail() {
    this.setData({ loading: true });
    const post = dataService.getAlumniPostDetail(this.data.postId);
    if (post) {
      const typeInfo = constants.ALUMNI_POST_TYPE_MAP[post.type];
      const processed = {
        ...post,
        typeInfo,
        formattedTime: util.relativeTime(post.createTime),
        commentCount: Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)
      };
      const mockComments = [
        {
          id: 'c1',
          userId: 'u1',
          userName: '小李同学',
          userAvatar: 'https://picsum.photos/seed/comment1/200/200',
          content: '感谢学长分享，受益匪浅！',
          createTime: Date.now() - 3600000
        },
        {
          id: 'c2',
          userId: 'u2',
          userName: '追梦人',
          userAvatar: 'https://picsum.photos/seed/comment2/200/200',
          content: '请问学长，创业初期最困难的是什么？',
          createTime: Date.now() - 7200000
        }
      ];
      this.setData({
        post: processed,
        comments: mockComments.map(c => ({
          ...c,
          formattedTime: util.relativeTime(c.createTime)
        })),
        loading: false
      });
      wx.setNavigationBarTitle({
        title: typeInfo ? typeInfo.label : '动态详情'
      });
    } else {
      wx.showToast({
        title: '动态不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onLikeTap() {
    const newLiked = !this.data.isLiked;
    this.setData({ isLiked: newLiked });
    if (newLiked) {
      dataService.likeAlumniPost(this.data.postId);
      const post = { ...this.data.post };
      post.likes = (post.likes || 0) + 1;
      this.setData({ post });
      wx.showToast({ title: '已点赞', icon: 'success' });
    }
  },

  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  onSubmitComment() {
    const content = this.data.commentInput.trim();
    if (!content) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    const newComment = {
      id: 'c_' + Date.now(),
      userId: 'current_user',
      userName: '我',
      userAvatar: 'https://picsum.photos/seed/currentuser/200/200',
      content,
      createTime: Date.now(),
      formattedTime: '刚刚'
    };
    const comments = [newComment, ...this.data.comments];
    const post = { ...this.data.post };
    post.commentCount = (post.commentCount || 0) + 1;
    this.setData({
      comments,
      post,
      commentInput: ''
    });
    wx.showToast({ title: '评论成功', icon: 'success' });
  },

  onImagePreview(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.post.images || [];
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  stopPropagation() {}
});
