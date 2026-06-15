const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentMonth: '',
    totalConsume: 0,
    canteenTotal: 0,
    supermarketTotal: 0,
    bathroomTotal: 0,
    dailyList: [],
    categoryList: [],
    pieData: [],
    pieCenterText: '',
    weekData: [],
    maxDayAmount: 0
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      const monthTransactions = mockData.CAMPUS_CARD_TRANSACTIONS.filter(t =>
        t.type === 'consume' && t.createTime >= monthStart
      );

      let totalConsume = 0;
      let canteenTotal = 0;
      let supermarketTotal = 0;
      let bathroomTotal = 0;
      const dayMap = {};
      const weekMap = {};

      monthTransactions.forEach(t => {
        totalConsume += t.amount;

        if (t.category === 'canteen') canteenTotal += t.amount;
        else if (t.category === 'supermarket') supermarketTotal += t.amount;
        else if (t.category === 'bathroom') bathroomTotal += t.amount;

        const dateKey = util.formatTime(t.createTime, 'MM-DD');
        if (!dayMap[dateKey]) {
          dayMap[dateKey] = { date: dateKey, amount: 0, count: 0 };
        }
        dayMap[dateKey].amount += t.amount;
        dayMap[dateKey].count += 1;

        const weekKey = this.getWeekKey(t.createTime);
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = { week: weekKey, amount: 0, count: 0 };
        }
        weekMap[weekKey].amount += t.amount;
        weekMap[weekKey].count += 1;
      });

      const categoryList = [
        {
          key: 'canteen',
          name: '食堂',
          icon: '🍜',
          amount: canteenTotal,
          percent: totalConsume > 0 ? (canteenTotal / totalConsume * 100).toFixed(1) : 0,
          color: '#F59E0B',
          bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
        },
        {
          key: 'supermarket',
          name: '超市',
          icon: '🛒',
          amount: supermarketTotal,
          percent: totalConsume > 0 ? (supermarketTotal / totalConsume * 100).toFixed(1) : 0,
          color: '#3B82F6',
          bgGradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
        },
        {
          key: 'bathroom',
          name: '浴室',
          icon: '🚿',
          amount: bathroomTotal,
          percent: totalConsume > 0 ? (bathroomTotal / totalConsume * 100).toFixed(1) : 0,
          color: '#06B6D4',
          bgGradient: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)'
        }
      ].filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);

      const pieData = this.calculatePieData(categoryList);

      const dailyList = Object.values(dayMap)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

      const maxDayAmount = Math.max(...dailyList.map(d => d.amount), 1);

      const weekData = Object.values(weekMap)
        .sort((a, b) => a.week.localeCompare(b.week))
        .map(w => ({ ...w, amountText: w.amount.toFixed(0) }));

      this.setData({
        currentMonth,
        totalConsume,
        canteenTotal,
        supermarketTotal,
        bathroomTotal,
        categoryList,
        pieData,
        pieCenterText: totalConsume.toFixed(0),
        dailyList,
        maxDayAmount,
        weekData
      });

      resolve();
    });
  },

  getWeekKey(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDay() || 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + 1);
    return util.formatTime(monday.getTime(), 'MM-DD');
  },

  calculatePieData(categories) {
    if (categories.length === 0) return [];

    let startAngle = -90;
    return categories.map(cat => {
      const angle = (parseFloat(cat.percent) / 100) * 360;
      const data = {
        ...cat,
        startAngle,
        endAngle: startAngle + angle,
        sweep: angle
      };
      startAngle += angle;
      return data;
    });
  },

  onCategoryTap(e) {
    const { key } = e.currentTarget.dataset;
    util.navigateTo(`/pages/campus-card/transactions?category=${key}`);
  }
});
