const app = getApp();
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatShortDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function generateMockData() {
  const now = new Date();
  const today = formatDate(now);

  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const baseDau = 8000 + Math.sin(i * 0.8) * 800;
    const basePublish = 180 + Math.cos(i * 0.6) * 50;
    const baseErrand = 120 + Math.sin(i * 0.5) * 40;
    trendData.push({
      date: formatDate(d),
      label: i === 0 ? '今日' : formatShortDate(d),
      dau: Math.round(baseDau + (Math.random() - 0.5) * 1000),
      publish: Math.round(basePublish + (Math.random() - 0.5) * 60),
      errand: Math.round(baseErrand + (Math.random() - 0.5) * 50),
      posX: Math.round((6 - i) * 100 / 6),
    });
  }

  const maxDau = Math.max(...trendData.map(d => d.dau));
  const maxPublish = Math.max(...trendData.map(d => d.publish));
  const maxErrand = Math.max(...trendData.map(d => d.errand));

  trendData.forEach(item => {
    item.dauY = Math.round((item.dau / maxDau) * 100);
    item.publishY = Math.round((item.publish / maxPublish) * 100);
    item.errandY = Math.round((item.errand / maxErrand) * 100);
  });

  const trendClipPaths = generateLineClipPaths(trendData);

  const modulePublishData = [
    { name: '论坛发帖', count: 89, percent: 28, color: '#6366F1' },
    { name: '二手市场', count: 72, percent: 22, color: '#10B981' },
    { name: '失物招领', count: 56, percent: 17, color: '#F59E0B' },
    { name: '跑腿订单', count: 52, percent: 16, color: '#EF4444' },
    { name: '其他模块', count: 55, percent: 17, color: '#8B5CF6' },
  ];

  const totalPublish = modulePublishData.reduce((s, m) => s + m.count, 0);
  const modulePieAngles = generatePieAngles(modulePublishData.map(m => m.percent));

  const hotWords = [
    { word: '考研复试', count: 328 },
    { word: '四六级报名', count: 256 },
    { word: '二手自行车', count: 198 },
    { word: '校园卡充值', count: 176 },
    { word: '失物招领', count: 154 },
    { word: '图书馆占座', count: 142 },
    { word: '兼职招聘', count: 128 },
    { word: '宿舍维修', count: 116 },
    { word: '食堂推荐', count: 108 },
    { word: '快递代取', count: 96 },
  ];
  const maxHot = hotWords[0].count;
  hotWords.forEach(w => {
    w.percent = Math.round((w.count / maxHot) * 100);
  });

  const creditDistribution = [
    { level: 'excellent', label: '优秀 (95-100)', icon: '🌟', count: 3256, percent: 32 },
    { level: 'good', label: '良好 (85-94)', icon: '👍', count: 4082, percent: 40 },
    { level: 'normal', label: '一般 (70-84)', icon: '👌', count: 1936, percent: 19 },
    { level: 'poor', label: '较差 (50-69)', icon: '⚠️', count: 712, percent: 7 },
    { level: 'bad', label: '极差 (0-49)', icon: '🚫', count: 214, percent: 2 },
  ];

  const avatarColors = ['#6366F1', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#8B5CF6'];
  const violationTypes = ['违规内容', '频繁取消', '超时未完成', '虚假信息', '交易纠纷', '辱骂攻击'];
  const statusMap = {
    warning: { text: '警告', status: 'warning' },
    punished: { text: '处罚中', status: 'punished' },
    banned: { text: '已封禁', status: 'banned' },
    normal: { text: '正常', status: 'normal' },
  };
  const statusKeys = ['warning', 'punished', 'banned', 'normal'];
  const names = ['张同学', '李同学', '王同学', '赵同学', '刘同学', '陈同学', '杨同学', '黄同学', '周同学', '吴同学'];

  const violationUsers = [];
  for (let i = 0; i < 10; i++) {
    const sKey = statusKeys[Math.floor(Math.random() * statusKeys.length)];
    const s = statusMap[sKey];
    violationUsers.push({
      id: i + 1,
      userId: '2024' + String(1000 + i).padStart(4, '0'),
      name: names[i],
      avatarColor: avatarColors[i % avatarColors.length],
      type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
      count: Math.floor(Math.random() * 5) + 1,
      status: s.status,
      statusText: s.text,
    });
  }

  const contentHealth = {
    pendingReview: 127,
    pendingPercent: 15,
    pendingBreakdown: [
      { name: '论坛', count: 58 },
      { name: '二手', count: 36 },
      { name: '失物', count: 20 },
      { name: '风光', count: 13 },
    ],
    sensitiveHit: 42,
    sensitiveTrend: -12,
    topSensitive: [
      { word: '刷单', count: 8 },
      { word: '代考', count: 7 },
      { word: '违禁品', count: 6 },
      { word: '赌博', count: 5 },
      { word: '传销', count: 4 },
    ],
    healthScore: 87,
  };

  const lastDau = trendData[trendData.length - 1].dau;
  const prevDau = trendData[trendData.length - 2].dau;
  const lastPublish = trendData[trendData.length - 1].publish;
  const prevPublish = trendData[trendData.length - 2].publish;

  const kpi = {
    dau: lastDau.toLocaleString(),
    dauTrend: Math.round(((lastDau - prevDau) / prevDau) * 100),
    totalPublish: totalPublish,
    publishTrend: Math.round(((lastPublish - prevPublish) / prevPublish) * 100),
    hotSearchCount: hotWords.length,
    searchGrowth: 18,
    reportRate: '0.42',
    reportTrend: -5,
    completionRate: '94.6',
    completionTrend: 2.3,
    errandOrders: 156,
    errandGrowth: 12,
  };

  return {
    updateTime: `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    kpi,
    trendData,
    yAxisLabels: ['', '', '', '', ''],
    trendClipPaths,
    modulePublishData,
    modulePieAngles,
    hotWords,
    creditDistribution,
    violationUsers,
    contentHealth,
  };
}

function generateLineClipPaths(trendData) {
  const n = trendData.length;

  function buildLine(key, area = false) {
    const points = [];
    if (area) {
      points.push('0% 0%');
    }
    trendData.forEach((item, idx) => {
      const x = idx === 0 ? 0 : (idx === n - 1 ? 100 : item.posX);
      const y = 100 - item[key];
      points.push(`${x}% ${y}%`);
    });
    if (area) {
      points.push('100% 0%');
    }
    return points.join(', ');
  }

  function buildOutlinePoints(key) {
    const pts = [];
    trendData.forEach((item, idx) => {
      const x = idx === 0 ? 0 : (idx === n - 1 ? 100 : item.posX);
      const y = 100 - item[key];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          pts.push(`${x + dx * 0.3}% ${y + dy * 0.5}%`);
        }
      }
      pts.push(`${x}% ${y}%`);
    });
    return pts.join(', ');
  }

  return {
    dau: buildLine('dauY'),
    publish: buildLine('publishY'),
    errand: buildLine('errandY'),
    dauArea: buildLine('dauY', true),
  };
}

function generatePieAngles(percents) {
  const angles = [];
  let cumulative = 0;
  const total = percents.reduce((s, p) => s + p, 0);
  percents.forEach(p => {
    const start = (cumulative / total) * 360;
    const sweep = (p / total) * 360;
    angles.push(start);
    angles.push(sweep - 90);
    cumulative += p;
  });
  while (angles.length < 10) angles.push(0);
  return angles;
}

function convertToCSV(data) {
  const rows = [];

  rows.push(['运营数据看板 - 导出报表']);
  rows.push([`导出时间: ${data.updateTime}`]);
  rows.push([]);

  rows.push(['=== 核心指标 ===']);
  rows.push(['指标名称', '数值', '较昨日变化']);
  rows.push(['DAU 日活用户', data.kpi.dau, `${data.kpi.dauTrend >= 0 ? '+' : ''}${data.kpi.dauTrend}%`]);
  rows.push(['今日发布总量', data.kpi.totalPublish, `${data.kpi.publishTrend >= 0 ? '+' : ''}${data.kpi.publishTrend}%`]);
  rows.push(['搜索热词数', data.kpi.hotSearchCount, `+${data.kpi.searchGrowth}%`]);
  rows.push(['举报率', `${data.kpi.reportRate}%`, `${data.kpi.reportTrend >= 0 ? '+' : ''}${data.kpi.reportTrend}%`]);
  rows.push(['跑腿完单率', `${data.kpi.completionRate}%`, `${data.kpi.completionTrend >= 0 ? '+' : ''}${data.kpi.completionTrend}%`]);
  rows.push(['跑腿订单量', data.kpi.errandOrders, `+${data.kpi.errandGrowth}%`]);
  rows.push([]);

  rows.push(['=== 7日数据趋势 ===']);
  rows.push(['日期', 'DAU', '发布量', '跑腿订单量']);
  data.trendData.forEach(t => {
    rows.push([t.date, t.dau, t.publish, t.errand]);
  });
  rows.push([]);

  rows.push(['=== 模块发布占比 ===']);
  rows.push(['模块名称', '发布量', '占比']);
  data.modulePublishData.forEach(m => {
    rows.push([m.name, m.count, `${m.percent}%`]);
  });
  rows.push([]);

  rows.push(['=== 搜索热词 TOP10 ===']);
  rows.push(['排名', '关键词', '搜索次数']);
  data.hotWords.forEach((w, i) => {
    rows.push([i + 1, w.word, w.count]);
  });
  rows.push([]);

  rows.push(['=== 用户信用分布 ===']);
  rows.push(['信用等级', '用户数', '占比']);
  data.creditDistribution.forEach(c => {
    rows.push([c.label, c.count, `${c.percent}%`]);
  });
  rows.push([]);

  rows.push(['=== 违规用户列表 ===']);
  rows.push(['用户ID', '昵称', '违规类型', '违规次数', '状态']);
  data.violationUsers.forEach(u => {
    rows.push([u.userId, u.name, u.type, u.count, u.statusText]);
  });
  rows.push([]);

  rows.push(['=== 内容健康度 ===']);
  rows.push(['待审核内容总数', data.contentHealth.pendingReview]);
  rows.push(['敏感词命中次数', data.contentHealth.sensitiveHit, `${data.contentHealth.sensitiveTrend >= 0 ? '+' : ''}${data.contentHealth.sensitiveTrend}%`]);
  rows.push(['内容健康指数', `${data.contentHealth.healthScore}分`]);
  rows.push([]);
  rows.push(['待审核明细:']);
  data.contentHealth.pendingBreakdown.forEach(b => {
    rows.push([b.name, b.count]);
  });
  rows.push([]);
  rows.push(['高频敏感词:']);
  data.contentHealth.topSensitive.forEach(s => {
    rows.push([s.word, `${s.count}次`]);
  });

  return rows.map(row =>
    row.map(cell => {
      const s = String(cell ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }).join(',')
  ).join('\n');
}

mixPage({
  data: {
    darkMode: false,
    updateTime: '',
    kpi: {},
    trendData: [],
    yAxisLabels: [],
    trendClipPaths: {},
    modulePublishData: [],
    modulePieAngles: [],
    hotWords: [],
    creditDistribution: [],
    violationUsers: [],
    contentHealth: {},
  },

  onLoad() {
    this.loadDashboardData();
  },

  onShow() {
    this.loadDashboardData();
  },

  onPullDownRefresh() {
    this.loadDashboardData();
    wx.stopPullDownRefresh();
    util.showToast('数据已刷新');
  },

  loadDashboardData() {
    const data = generateMockData();
    const maxVal = Math.max(
      ...data.trendData.map(d => d.dau),
      ...data.trendData.map(d => d.publish),
      ...data.trendData.map(d => d.errand)
    );
    const step = Math.ceil(maxVal / 4);
    data.yAxisLabels = [];
    for (let i = 4; i >= 0; i--) {
      const v = step * i;
      data.yAxisLabels.push(v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v);
    }
    this.setData(data);
  },

  onExportCSV() {
    const csvContent = '\uFEFF' + convertToCSV(this.data);

    const fs = wx.getFileSystemManager();
    const timestamp = Date.now();
    const filePath = `${wx.env.USER_DATA_PATH}/运营数据_${timestamp}.csv`;

    try {
      fs.writeFileSync(filePath, csvContent, 'utf8');

      wx.showModal({
        title: '导出成功',
        content: `CSV 文件已生成，是否打开或保存？\n文件路径: ${filePath}`,
        confirmText: '打开文件',
        cancelText: '分享',
        success: (res) => {
          if (res.confirm) {
            wx.openDocument({
              filePath: filePath,
              fileType: 'csv',
              showMenu: true,
              fail: () => {
                util.showToast('打开失败，请使用分享功能');
              }
            });
          } else {
            wx.shareFileMessage({
              filePath: filePath,
              fail: () => {
                wx.saveFile({
                  tempFilePath: filePath,
                  success: (saveRes) => {
                    util.showToast(`文件已保存至: ${saveRes.savedFilePath.slice(0, 20)}...`);
                  },
                  fail: () => {
                    util.showError('保存失败，请重试');
                  }
                });
              }
            });
          }
        }
      });
    } catch (e) {
      console.error('CSV导出失败:', e);
      util.showError('导出失败，请重试');
    }
  },

  onShareAppMessage() {
    return {
      title: '运营数据看板',
      path: '/pages/admin/dashboard/index',
    };
  }
});
