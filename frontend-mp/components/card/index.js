Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showMore: {
      type: Boolean,
      value: false
    },
    moreText: {
      type: String,
      value: '更多'
    },
    hoverable: {
      type: Boolean,
      value: false
    },
    customClass: {
      type: String,
      value: ''
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    },
    onMore() {
      this.triggerEvent('more');
    }
  }
});
