Component({
  properties: {
    type: {
      type: String,
      value: 'primary' // primary, secondary, outline, text, danger, success
    },
    size: {
      type: String,
      value: 'medium' // small, medium, large
    },
    block: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String,
      value: ''
    },
    formType: {
      type: String,
      value: ''
    },
    openType: {
      type: String,
      value: ''
    }
  },

  methods: {
    onClick() {
      if (!this.data.loading && !this.data.disabled) {
        this.triggerEvent('click');
      }
    },
    onGetUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail);
    }
  }
});
