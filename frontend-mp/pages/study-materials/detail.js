const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isFavorite: false,
    currentImageIndex: 0,
    downloading: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.checkFavorite();
    }
  },

  loadDetail() {
    util.showLoading();
    const detail = dataService.getStudyMaterialDetail(this.data.id);

    if (detail) {
      const categoryInfo = constants.STUDY_MATERIAL_CATEGORIES.find(c => c.value === detail.category);
      const fileTypeInfo = constants.FILE_TYPE_OPTIONS.find(f => f.value === detail.fileType);

      const formattedDetail = {
        ...detail,
        categoryText: categoryInfo ? categoryInfo.label : detail.category,
        categoryColor: categoryInfo ? categoryInfo.color : '#999',
        categoryIcon: categoryInfo ? categoryInfo.icon : '📚',
        fileTypeText: fileTypeInfo ? fileTypeInfo.label : detail.fileType,
        fileTypeIcon: fileTypeInfo ? fileTypeInfo.icon : '📁',
        timeText: util.relativeTime(detail.createTime),
        semesterText: detail.semester ? constants.getLabelByValue(constants.SEMESTER_OPTIONS, detail.semester) : ''
      };

      this.setData({ detail: formattedDetail });

      dataService.increaseStudyMaterialViews(this.data.id);
      dataService.addHistory(detail, 'study-material');

      this.checkFavorite();
    }

    util.hideLoading();
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'study-material');
    this.setData({ isFavorite });
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  async onDownload() {
    if (!util.checkLogin()) {
      return;
    }

    if (this.data.downloading) {
      return;
    }

    const { detail } = this.data;
    if (!detail) return;

    this.setData({ downloading: true });
    util.showLoading('下载中...');

    try {
      if (detail.images && detail.images.length > 0) {
        for (const imageUrl of detail.images) {
          try {
            const tempPath = await fileUtil.downloadFile(imageUrl);
            await fileUtil.saveImageToAlbum(tempPath);
          } catch (e) {
            console.error('下载图片失败:', e);
          }
        }
        dataService.increaseStudyMaterialDownloads(this.data.id);
        await util.showSuccess('下载成功，已保存到相册');
      } else if (detail.files && detail.files.length > 0) {
        for (const filePath of detail.files) {
          try {
            const tempPath = await fileUtil.downloadFile(filePath);
            await fileUtil.saveFileToAlbum(tempPath);
          } catch (e) {
            console.error('下载文件失败:', e);
          }
        }
        dataService.increaseStudyMaterialDownloads(this.data.id);
        await util.showSuccess('下载成功');
      } else {
        util.showToast('暂无可下载的文件');
      }
    } catch (e) {
      util.showError('下载失败，请重试');
    } finally {
      this.setData({ downloading: false });
      util.hideLoading();
    }
  },

  onToggleFavorite() {
    if (!util.checkLogin()) {
      return;
    }

    const { id, isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(id, 'study-material');
      dataService.increaseStudyMaterialFavorites(id, -1);
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'study-material');
      dataService.increaseStudyMaterialFavorites(id, 1);
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? detail.title : '学习资料',
      path: `/pages/study-materials/detail?id=${this.data.id}`
    };
  },

  onShareTimeline() {
    const { detail } = this.data;
    return {
      title: detail ? detail.title : '学习资料'
    };
  }
});
