const config = require('../../config/index');
const fileUtil = require('../../utils/file');

Page({
  data: {
    sceneryList: [],
    currentIndex: 0
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    const sceneryList = config.SCENERY_LIST.map(item => ({
      ...item,
      image: item.image || '/assets/images/default-scenery.png'
    }));
    
    this.setData({ sceneryList });
  },

  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },

  onThumbTap(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      currentIndex: index
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.sceneryList.map(item => item.image);
    fileUtil.previewImage(urls, urls[index]);
  }
});
