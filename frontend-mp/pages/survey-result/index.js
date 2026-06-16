const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#667EEA',
  '#FA709A', '#2ECC71', '#F39C12', '#3498DB',
  '#9B59B6', '#E74C3C'
];

const TAG_CLOUD_COLORS = [
  '#FF6B6B', '#4ECDC4', '#667EEA', '#FA709A',
  '#2ECC71', '#F39C12', '#3498DB', '#9B59B6',
  '#FFE66D', '#E74C3C'
];

mixPage({
  data: {
    darkMode: false,
    surveyId: '',
    survey: null,
    totalResponses: 0,
    questionStats: [],
    chartType: 'bar',
    isCreator: false,
    canView: true,
    viewReason: '',
    csvText: '',
    showCsvModal: false,
    questionTypeLabels: {
      single: '单选',
      multiple: '多选',
      fill: '填空',
      nps: 'NPS',
      likert: '量表',
      date: '日期'
    }
  },

  onLoad(options) {
    if (!options.id) {
      util.showToast('参数错误');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const app = getApp();
    const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';

    this.setData({ surveyId: options.id });
    this.loadStatistics(userId);
  },

  loadStatistics(userId) {
    const stats = dataService.getSurveyStatistics(this.data.surveyId);
    if (!stats) {
      util.showToast('问卷不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const survey = stats.survey;
    const isCreator = userId && survey.creatorId === userId;
    const viewCheck = dataService.canViewResult(survey, userId);

    if (!viewCheck.canView) {
      this.setData({
        survey: stats.survey,
        totalResponses: stats.totalResponses,
        questionStats: stats.questionStats,
        isCreator,
        canView: false,
        viewReason: viewCheck.reason
      });
      return;
    }

    const questionStats = stats.questionStats.map(stat => {
      if (stat.type === 'fill' && stat.wordFrequency && stat.wordFrequency.length > 0) {
        const maxFreq = stat.wordFrequency[0].count;
        const minFreq = stat.wordFrequency[stat.wordFrequency.length - 1].count;
        stat.tagCloud = stat.wordFrequency.slice(0, 30).map((w, i) => {
          const ratio = maxFreq === minFreq ? 0.5 : (w.count - minFreq) / (maxFreq - minFreq);
          const fontSize = Math.round(22 + ratio * 24);
          return {
            word: w.word,
            count: w.count,
            fontSize,
            color: TAG_CLOUD_COLORS[i % TAG_CLOUD_COLORS.length]
          };
        });
      }
      return stat;
    });

    this.setData({
      survey: stats.survey,
      totalResponses: stats.totalResponses,
      questionStats,
      isCreator,
      canView: true
    }, () => {
      this.renderAllCharts();
    });
  },

  onChartTypeChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ chartType: type }, () => {
      this.renderAllCharts();
    });
  },

  renderAllCharts() {
    const { questionStats, chartType, darkMode } = this.data;
    questionStats.forEach((stat, index) => {
      if (stat.type === 'fill' || stat.type === 'date') return;
      if (stat.type === 'single') {
        if (chartType === 'pie') {
          this.renderPieChart(index, stat, darkMode);
        } else {
          this.renderBarChart(index, stat, darkMode);
        }
      } else if (stat.type === 'multiple') {
        this.renderBarChart(index, stat, darkMode);
      } else if (stat.type === 'nps') {
        this.renderNpsChart(index, stat, darkMode);
      } else if (stat.type === 'likert') {
        this.renderLikertChart(index, stat, darkMode);
      }
    });
  },

  renderPieChart(index, stat, isDark) {
    const query = wx.createSelectorQuery();
    query.select(`#chart-${index}`)
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

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        const options = stat.options || [];
        const total = options.reduce((sum, opt) => sum + opt.count, 0);
        if (total === 0) return;

        let startAngle = -Math.PI / 2;
        options.forEach((opt, i) => {
          const sliceAngle = (opt.count / total) * 2 * Math.PI;
          const endAngle = startAngle + sliceAngle;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
          ctx.fill();
          ctx.strokeStyle = isDark ? '#1A1D28' : '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();

          if (opt.percentage > 5) {
            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius * 0.65;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(opt.percentage + '%', labelX, labelY);
          }
          startAngle = endAngle;
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#1A1D28' : '#FFFFFF';
        ctx.fill();
        ctx.fillStyle = isDark ? '#E8ECF1' : '#2C3E50';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total + '票', centerX, centerY);
      });
  },

  renderBarChart(index, stat, isDark) {
    const query = wx.createSelectorQuery();
    query.select(`#chart-${index}`)
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

        const options = stat.options || [];
        if (options.length === 0) return;
        const padding = { top: 20, right: 20, bottom: 40, left: 20 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const barGap = 12;
        const barWidth = Math.min(48, (chartWidth - barGap * (options.length - 1)) / options.length);
        const totalBarWidth = options.length * barWidth + (options.length - 1) * barGap;
        const startX = padding.left + (chartWidth - totalBarWidth) / 2;
        const maxCount = Math.max(...options.map(o => o.count), 1);

        options.forEach((opt, i) => {
          const x = startX + i * (barWidth + barGap);
          const barHeight = (opt.count / maxCount) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
          const color = CHART_COLORS[i % CHART_COLORS.length];
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color + '60');
          ctx.beginPath();
          const r = Math.min(6, barWidth / 4);
          if (barHeight > r * 2) {
            ctx.moveTo(x, padding.top + chartHeight);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.arcTo(x + barWidth, y, x + barWidth, y + r, r);
            ctx.lineTo(x + barWidth, padding.top + chartHeight);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.closePath();
          ctx.fillStyle = gradient;
          ctx.fill();
          if (opt.count > 0) {
            ctx.fillStyle = isDark ? '#E8ECF1' : '#2C3E50';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(opt.count + '票', x + barWidth / 2, y - 4);
          }
          ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          const label = opt.label.length > 4 ? opt.label.substring(0, 4) + '..' : opt.label;
          ctx.fillText(label, x + barWidth / 2, padding.top + chartHeight + 8);
        });

        ctx.strokeStyle = isDark ? '#2E3348' : '#EAECEF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(width - padding.right, padding.top + chartHeight);
        ctx.stroke();
      });
  },

  renderNpsChart(index, stat, isDark) {
    const query = wx.createSelectorQuery();
    query.select(`#chart-${index}`)
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

        const padding = { top: 30, right: 16, bottom: 50, left: 16 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const scoreCounts = stat.scoreCounts || [];
        const maxCount = Math.max(...scoreCounts, 1);
        const barGap = 4;
        const barWidth = (chartWidth - barGap * 10) / 11;

        const categoryColors = {
          detractor: '#EF4444',
          passive: '#F59E0B',
          promoter: '#10B981'
        };

        scoreCounts.forEach((count, i) => {
          const x = padding.left + i * (barWidth + barGap);
          const barHeight = (count / maxCount) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          let color;
          if (i <= 6) color = categoryColors.detractor;
          else if (i <= 8) color = categoryColors.passive;
          else color = categoryColors.promoter;

          ctx.beginPath();
          const r = Math.min(4, barWidth / 4);
          if (barHeight > r * 2) {
            ctx.moveTo(x, padding.top + chartHeight);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.arcTo(x + barWidth, y, x + barWidth, y + r, r);
            ctx.lineTo(x + barWidth, padding.top + chartHeight);
          } else if (barHeight > 0) {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          if (count > 0) {
            ctx.fillStyle = isDark ? '#E8ECF1' : '#2C3E50';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(count, x + barWidth / 2, y - 2);
          }

          ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(i, x + barWidth / 2, padding.top + chartHeight + 4);
        });

        ctx.strokeStyle = isDark ? '#2E3348' : '#EAECEF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(width - padding.right, padding.top + chartHeight);
        ctx.stroke();

        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('贬损者', padding.left + (barWidth + barGap) * 3, padding.top + chartHeight + 20);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('中立者', padding.left + (barWidth + barGap) * 7, padding.top + chartHeight + 20);
        ctx.fillStyle = '#10B981';
        ctx.fillText('推荐者', padding.left + (barWidth + barGap) * 9.5, padding.top + chartHeight + 20);
      });
  },

  renderLikertChart(index, stat, isDark) {
    const query = wx.createSelectorQuery();
    query.select(`#chart-${index}`)
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

        const padding = { top: 20, right: 20, bottom: 40, left: 20 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const distribution = stat.distribution || [0, 0, 0, 0, 0];
        const maxCount = Math.max(...distribution, 1);
        const barGap = 12;
        const barWidth = (chartWidth - barGap * 4) / 5;
        const likertLabels = ['非常不同意', '不同意', '一般', '同意', '非常同意'];
        const likertColors = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981'];

        distribution.forEach((count, i) => {
          const x = padding.left + i * (barWidth + barGap);
          const barHeight = (count / maxCount) * chartHeight;
          const y = padding.top + chartHeight - barHeight;

          ctx.beginPath();
          const r = Math.min(6, barWidth / 4);
          if (barHeight > r * 2) {
            ctx.moveTo(x, padding.top + chartHeight);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.arcTo(x + barWidth, y, x + barWidth, y + r, r);
            ctx.lineTo(x + barWidth, padding.top + chartHeight);
          } else if (barHeight > 0) {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.closePath();
          ctx.fillStyle = likertColors[i];
          ctx.fill();

          if (count > 0) {
            ctx.fillStyle = isDark ? '#E8ECF1' : '#2C3E50';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(count, x + barWidth / 2, y - 4);
          }

          ctx.fillStyle = isDark ? '#9CA3AF' : '#7F8C8D';
          ctx.font = '8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(likertLabels[i], x + barWidth / 2, padding.top + chartHeight + 6);
        });

        ctx.strokeStyle = isDark ? '#2E3348' : '#EAECEF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(width - padding.right, padding.top + chartHeight);
        ctx.stroke();
      });
  },

  onFillToggle(e) {
    const { index } = e.currentTarget.dataset;
    const key = `questionStats[${index}]._showAll`;
    this.setData({ [key]: !this.data.questionStats[index]._showAll });
  },

  onExportCsv() {
    const csv = dataService.generateSurveyCSV(this.data.surveyId);
    if (!csv) {
      util.showToast('导出失败');
      return;
    }
    this.setData({ csvText: csv, showCsvModal: true });
  },

  onCloseCsvModal() {
    this.setData({ showCsvModal: false });
  },

  onCopyCsv() {
    wx.setClipboardData({
      data: this.data.csvText,
      success: () => {
        util.showToast('已复制到剪贴板');
        this.setData({ showCsvModal: false });
      }
    });
  },

  onViewDashboard() {
    util.navigateTo(`/pages/survey-dashboard/index?id=${this.data.surveyId}`);
  }
});
