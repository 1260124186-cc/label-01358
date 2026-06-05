Component({
  properties: {
    image: {
      type: String,
      value: ''
    },
    text: {
      type: String,
      value: '暂无数据'
    },
    showAction: {
      type: Boolean,
      value: false
    },
    actionText: {
      type: String,
      value: '刷新'
    },
    loading: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onAction() {
      if (!this.data.loading) {
        this.triggerEvent('action');
      }
    }
  }
});
