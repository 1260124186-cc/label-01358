const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const MEAL_TABS = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' }
];

const MEAL_TIME_RANGES = {
  breakfast: { start: '06:30', end: '09:30' },
  lunch: { start: '09:30', end: '14:00' },
  dinner: { start: '16:30', end: '20:30' }
};

function getCurrentMealType() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const bfStart = 6 * 60 + 30;
  const bfEnd = 9 * 60 + 30;
  const lEnd = 14 * 60;

  if (totalMinutes >= bfStart && totalMinutes < bfEnd) {
    return 'breakfast';
  } else if (totalMinutes >= bfEnd && totalMinutes < lEnd) {
    return 'lunch';
  } else {
    return 'dinner';
  }
}

function isTimeInRange(timeStr, startStr, endStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  const total = h * 60 + m;
  return total >= sh * 60 + sm && total < eh * 60 + em;
}

function getBusinessStatus() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  for (const meal of Object.keys(MEAL_TIME_RANGES)) {
    const { start, end } = MEAL_TIME_RANGES[meal];
    if (isTimeInRange(timeStr, start, end)) {
      let mealLabel = '';
      if (meal === 'breakfast') mealLabel = '早餐';
      else if (meal === 'lunch') mealLabel = '午餐';
      else mealLabel = '晚餐';
      return { status: 'open', text: `营业中·${mealLabel}` };
    }
  }
  return { status: 'closed', text: '已打烊' };
}

function formatRating(rating) {
  const r = Math.max(0, Math.min(5, rating || 0));
  const full = Math.floor(r);
  const half = (r - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    dishes: [],
    reviews: [],
    currentImageIndex: 0,
    mealTabs: MEAL_TABS,
    currentMeal: 'breakfast',
    businessStatus: { status: 'closed', text: '已打烊' },
    mealTimeRanges: MEAL_TIME_RANGES,
    isFavorite: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      const currentMeal = getCurrentMealType();
      this.setData({
        currentMeal,
        businessStatus: getBusinessStatus()
      });
      this.loadDetail();
      this.loadReviews();
      this.loadDishes(currentMeal);
    }
  },

  loadDetail() {
    util.showLoading();
    const detail = typeof dataService.getCanteenDetail === 'function'
      ? dataService.getCanteenDetail(this.data.id)
      : null;

    if (detail) {
      const ratingInfo = formatRating(detail.rating);
      const isFav = typeof dataService.isFavoriteCanteen === 'function'
        ? dataService.isFavoriteCanteen(this.data.id)
        : (detail.isFavorite || false);

      const stalls = (detail.stalls || []).map(stall => ({
        ...stall,
        tagsText: (stall.featureTags || []).join('、')
      }));

      const formattedDetail = {
        ...detail,
        ratingInfo,
        stalls,
        breakfastHours: detail.businessHours && detail.businessHours.breakfast ? detail.businessHours.breakfast : MEAL_TIME_RANGES.breakfast,
        lunchHours: detail.businessHours && detail.businessHours.lunch ? detail.businessHours.lunch : MEAL_TIME_RANGES.lunch,
        dinnerHours: detail.businessHours && detail.businessHours.dinner ? detail.businessHours.dinner : MEAL_TIME_RANGES.dinner
      };

      this.setData({
        detail: formattedDetail,
        isFavorite: isFav
      });

      if (typeof dataService.addHistory === 'function') {
        dataService.addHistory(detail, 'canteen');
      }
    }

    util.hideLoading();
  },

  loadReviews() {
    const reviews = typeof dataService.getCanteenReviews === 'function'
      ? dataService.getCanteenReviews(this.data.id)
      : [];

    const formattedReviews = (reviews || []).map(r => ({
      ...r,
      timeText: util.relativeTime(r.createTime),
      recommendTags: r.recommendTags || [],
      avoidTags: r.avoidTags || []
    }));

    this.setData({ reviews: formattedReviews });
  },

  loadDishes(mealType) {
    const dishes = typeof dataService.getDishesByCanteenAndMeal === 'function'
      ? dataService.getDishesByCanteenAndMeal(this.data.id, mealType)
      : [];

    this.setData({ dishes: dishes || [] });
  },

  onMealTabChange(e) {
    const { meal } = e.currentTarget.dataset;
    if (meal && meal !== this.data.currentMeal) {
      this.setData({ currentMeal: meal });
      this.loadDishes(meal);
    }
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail && this.data.detail.images ? this.data.detail.images : [];
    if (urls.length > 0) {
      wx.previewImage({
        current: urls[index],
        urls
      });
    }
  },

  onDishTap(e) {
    const { id } = e.currentTarget.dataset;
    if (id) {
      wx.navigateTo({
        url: `/pages/canteen/dish-detail?id=${id}`,
        fail: () => {}
      });
    }
  },

  onToggleFavoriteCanteen() {
    if (!util.checkLogin()) return;

    const { id } = this.data;

    if (typeof dataService.toggleFavoriteCanteen === 'function') {
      const result = dataService.toggleFavoriteCanteen(id);
      util.showToast(result.isFavorite ? '收藏成功' : '已取消收藏');
      this.setData({ isFavorite: result.isFavorite });
    } else {
      const { detail, isFavorite } = this.data;
      if (isFavorite) {
        if (typeof dataService.removeFavorite === 'function') {
          dataService.removeFavorite(id, 'canteen');
        }
        util.showToast('已取消收藏');
        this.setData({ isFavorite: false });
      } else {
        if (typeof dataService.addFavorite === 'function' && detail) {
          dataService.addFavorite(detail, 'canteen');
        }
        util.showToast('收藏成功');
        this.setData({ isFavorite: true });
      }
    }
  },

  onCallPhone() {
    const { detail } = this.data;
    if (!detail || !detail.phone) return;
    wx.makePhoneCall({
      phoneNumber: detail.phone,
      fail: () => {}
    });
  },

  onShareAppMessage() {
    const { detail, id } = this.data;
    return {
      title: detail ? detail.name : '食堂详情',
      path: `/pages/canteen/detail?id=${id}`
    };
  }
});
