const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activityId: '',
    activity: null,
    userRegistration: null,
    totalHours: 0,
    certificateDate: '',
    certNo: '',
    categoryInfo: null,
    canvasReady: false
  },

  onLoad(options) {
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';

    let activity = null;
    let userRegistration = null;

    if (options.activityId) {
      activity = dataService.getVolunteerActivityDetail(options.activityId);
      if (activity) {
        const registrations = activity.registrations || [];
        userRegistration = registrations.find(r => r.userId === userId) || null;
      }
    }

    if (!activity) {
      const allActivities = dataService.getVolunteerActivityList({});
      for (const act of allActivities) {
        const reg = (act.registrations || []).find(r => r.userId === userId && r.status === 'completed');
        if (reg) {
          activity = act;
          userRegistration = reg;
          break;
        }
      }
    }

    if (activity && userRegistration) {
      const categoryInfo = constants.VOLUNTEER_CATEGORIES.find(c => c.value === activity.category) || {};
      const hoursData = dataService.getUserVolunteerHours(userId);
      const certNo = 'VC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      this.setData({
        activityId: activity.id || options.activityId,
        activity,
        userRegistration,
        totalHours: hoursData.totalHours,
        certificateDate: util.formatTime(Date.now(), 'YYYY年MM月DD日'),
        certNo,
        categoryInfo
      });
    }
  },

  onShow() {
    const isDark = app.globalData.isDark;
    if (this.data.darkMode !== isDark) {
      this.setData({ darkMode: !!isDark });
    }
  },

  async onGenerateImage() {
    if (!this.data.activity) {
      util.showError('无活动信息');
      return;
    }

    util.showLoading('生成证明中...');

    try {
      const query = wx.createSelectorQuery();
      query.select('#certCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) {
            util.hideLoading();
            util.showError('画布初始化失败');
            return;
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getWindowInfo().pixelRatio;

          const canvasWidth = 600;
          const canvasHeight = 850;
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.scale(dpr, dpr);

          this.drawCertificate(ctx, canvasWidth, canvasHeight);

          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvas,
              width: canvasWidth * dpr,
              height: canvasHeight * dpr,
              destWidth: canvasWidth * 3,
              destHeight: canvasHeight * 3,
              success: (tempRes) => {
                util.hideLoading();
                this.setData({ imagePath: tempRes.tempFilePath });
                this.saveImage(tempRes.tempFilePath);
              },
              fail: () => {
                util.hideLoading();
                util.showError('生成图片失败');
              }
            });
          }, 300);
        });
    } catch (e) {
      util.hideLoading();
      util.showError('生成失败，请重试');
    }
  },

  drawCertificate(ctx, w, h) {
    const { activity, categoryInfo, totalHours, certificateDate, certNo } = this.data;
    const userInfo = app.globalData.userInfo || {};
    const userName = userInfo.nickName || '志愿者';

    ctx.fillStyle = '#FFFBF0';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.fillStyle = '#D4A574';
    ctx.fillRect(w / 2 - 60, 20, 120, 6);
    ctx.fillRect(w / 2 - 60, h - 26, 120, 6);

    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('志愿服务证明', w / 2, 85);

    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 100);
    ctx.lineTo(420, 100);
    ctx.stroke();

    ctx.fillStyle = '#D4A574';
    ctx.font = '16px serif';
    ctx.fillText('VOLUNTEER SERVICE CERTIFICATE', w / 2, 125);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#333333';
    ctx.font = '20px serif';
    ctx.fillText('兹证明', 60, 185);

    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 26px serif';
    ctx.fillText(userName, 140, 185);

    ctx.fillStyle = '#333333';
    ctx.font = '20px serif';
    ctx.fillText('同学', 140 + userName.length * 28, 185);

    ctx.font = '18px serif';
    ctx.fillStyle = '#444444';
    const line1 = '于' + util.formatTime(activity.startTime, 'YYYY年MM月DD日') + '至' + util.formatTime(activity.endTime, 'YYYY年DD日') + '，';
    ctx.fillText(line1, 60, 240);

    ctx.fillText('参加了"' + activity.title + '"志愿服务活动，', 60, 278);

    const catLabel = categoryInfo ? categoryInfo.label : '志愿服务';
    ctx.fillText('属于' + catLabel + '类别，', 60, 316);

    ctx.fillText('在' + (activity.location || '本校') + '圆满完成志愿服务工作。', 60, 354);

    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 22px serif';
    ctx.fillText('本次服务时长：' + activity.hours + ' 小时', 60, 416);

    ctx.fillStyle = '#444444';
    ctx.font = '18px serif';
    ctx.fillText('累计志愿服务时长：' + totalHours + ' 小时', 60, 456);

    ctx.fillStyle = '#666666';
    ctx.font = '15px serif';
    ctx.fillText('该同学在志愿服务中表现积极、认真负责，特此证明。', 60, 516);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#444444';
    ctx.font = '17px serif';
    ctx.fillText('XX大学团委', w - 60, 610);
    ctx.fillText(certificateDate, w - 60, 642);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#999999';
    ctx.font = '12px serif';
    ctx.fillText('编号：' + certNo, w / 2, h - 45);
  },

  saveImage(tempFilePath) {
    wx.showModal({
      title: '保存证明',
      content: '证明图片已生成，是否保存到相册？',
      confirmText: '保存',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: () => {
              util.showSuccess('已保存到相册');
            },
            fail: (err) => {
              if (err.errMsg.indexOf('auth deny') !== -1 || err.errMsg.indexOf('authorize') !== -1) {
                wx.showModal({
                  title: '需要授权',
                  content: '请在设置中允许访问相册',
                  confirmText: '去设置',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      wx.openSetting();
                    }
                  }
                });
              } else {
                util.showError('保存失败');
              }
            }
          });
        }
      }
    });
  },

  onPreviewImage() {
    if (this.data.imagePath) {
      wx.previewImage({
        urls: [this.data.imagePath],
        current: this.data.imagePath
      });
    } else {
      this.onGenerateImage();
    }
  }
});
