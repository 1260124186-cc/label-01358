const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    surveyId: '',
    survey: null,
    dashboardData: null,
    totalResponses: 0,
    todayResponses: 0,
    avgNps: '--',
    avgLikert: '--'
  },

  onLoad(options) {
    if (!options.id) {
      util.showToast('参数错误');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this.setData({ surveyId: options.id });
    this.loadDashboard();
  },

  loadDashboard() {
    const survey = dataService.getSurveyDetail(this.data.surveyId);
    if (!survey) {
      util.showToast('问卷不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const app = getApp();
    const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';
    if (survey.creatorId !== userId && survey.creator !== userId) {
      util.showToast('无权查看');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const dashboardData = dataService.getSurveyDashboardData(this.data.surveyId);
    if (!dashboardData) {
      util.showToast('数据加载失败');
      return;
    }

    const totalResponses = dashboardData.dailyResponses.reduce((sum, d) => sum + d.count, 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayItem = dashboardData.dailyResponses.find(d => d.date === todayStr);
    const todayResponses = todayItem ? todayItem.count : 0;

    this.setData({
      survey,
      dashboardData,
      totalResponses,
      todayResponses,
      avgNps: dashboardData.avgNps !== null ? dashboardData.avgNps : '--',
      avgLikert: dashboardData.avgLikert !== null ? dashboardData.avgLikert : '--'
    }, () => {
      this.renderLineChart();
    });
  },

  renderLineChart() {
    const { dashboardData, darkMode } = this.data;
    if (!dashboardData || !dashboardData.dailyResponses) return;

    const query = wx.createSelectorQuery();
    query.select('#line-chart')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
        const dpr = sysInfo.pixelRatio || 2;
        const width = res[0].width;
        const height = res[0].height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const isDark = darkMode;
        const data = dashboardData.dailyResponses;
        if (data.length === 0) {
          ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('暂无数据', width / 2, height / 2);
          return;
        }

        const padding = { top: 24, right: 24, bottom: 50, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxCount = Math.max(...data.map(d => d.count), 1);
        const ySteps = Math.min(maxCount, 5);
        const yStepValue = maxCount / ySteps;

        ctx.strokeStyle = isDark ? '#2E3348' : '#EAECEF';
        ctx.lineWidth = 1;
        ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let i = 0; i <= ySteps; i++) {
          const yVal = Math.round(yStepValue * i);
          const y = padding.top + chartHeight - (i / ySteps) * chartHeight;
          ctx.beginPath();
          ctx.moveTo(padding.left, y);
          ctx.lineTo(width - padding.right, y);
          ctx.stroke();
          ctx.fillText(yVal, padding.left - 6, y);
        }

        const xStep = data.length > 1 ? chartWidth / (data.length - 1) : 0;

        const points = data.map((d, i) => ({
          x: data.length > 1 ? padding.left + i * xStep : padding.left + chartWidth / 2,
          y: padding.top + chartHeight - (d.count / maxCount) * chartHeight,
          count: d.count,
          date: d.date
        }));

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 107, 107, 0.02)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        ctx.lineTo(points[0].x, points[0].y);

        if (points.length > 1) {
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
            ctx.bezierCurveTo(cpx1, prev.y, cpx2, curr.y, curr.x, curr.y);
          }
        }

        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        if (points.length > 1) {
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
            ctx.bezierCurveTo(cpx1, prev.y, cpx2, curr.y, curr.x, curr.y);
          }
        }
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        points.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = '#FF6B6B';
          ctx.lineWidth = 2;
          ctx.stroke();

          if (p.count > 0 && (data.length <= 10 || i % 2 === 0)) {
            ctx.fillStyle = isDark ? '#E8ECF1' : '#2C3E50';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(p.count, p.x, p.y - 8);
          }
        });

        ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelStep = Math.max(1, Math.floor(data.length / 7));
        data.forEach((d, i) => {
          if (i % labelStep === 0 || i === data.length - 1) {
            const x = points[i].x;
            const label = d.date.substring(5);
            ctx.fillText(label, x, padding.top + chartHeight + 8);
          }
        });

        ctx.strokeStyle = isDark ? '#2E3348' : '#EAECEF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(width - padding.right, padding.top + chartHeight);
        ctx.stroke();
      });
  },

  onExportCsv() {
    const csv = dataService.generateSurveyCSV(this.data.surveyId);
    if (!csv) {
      util.showToast('导出失败');
      return;
    }
    wx.setClipboardData({
      data: csv,
      success: () => {
        util.showToast('CSV已复制到剪贴板');
      }
    });
  },

  onViewResult() {
    util.navigateTo(`/pages/survey-result/index?id=${this.data.surveyId}`);
  }
});
