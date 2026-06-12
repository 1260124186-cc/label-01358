const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    policyId: '',
    policy: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ policyId: id });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllInnovationData();
    const policy = dataService.getInnovationPolicyDetail(this.data.policyId);
    if (policy) {
      dataService.increasePolicyViews(this.data.policyId);
      const processedPolicy = {
        ...policy,
        typeInfo: constants.INNOVATION_POLICY_TYPES.find(t => t.value === policy.type),
        tagsText: (policy.tags || []).join(' · '),
        contentLines: (policy.content || '').split('\n')
      };
      this.setData({
        policy: processedPolicy,
        loading: false
      });
    } else {
      this.setData({ loading: false });
      wx.showToast({ title: '政策不存在', icon: 'none' });
    }
  },

  onFavoriteTap() {
    dataService.togglePolicyFavorite(this.data.policyId);
    this.loadData();
  },

  onApplyTap() {
    wx.showModal({
      title: '政策申请',
      content: '确定要申请该政策支持吗？具体申请材料请参考政策详情。',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '申请已提交', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.policy ? this.data.policy.title : '政策详情',
      path: `/pages/innovation/policy-detail?id=${this.data.policyId}`
    };
  }
});
