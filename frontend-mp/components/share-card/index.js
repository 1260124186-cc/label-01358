Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    image: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    price: {
      type: String,
      value: ''
    },
    originalPrice: {
      type: String,
      value: ''
    },
    discount: {
      type: String,
      value: ''
    },
    statusText: {
      type: String,
      value: ''
    },
    status: {
      type: String,
      value: ''
    }
  },

  methods: {
    onMaskTap() {
      this.triggerEvent('close');
    },

    preventTap() {
    },

    onSaveImage() {
      this.triggerEvent('save');
    },

    onShareAppMessage() {
      this.triggerEvent('share');
    },

    onClose() {
      this.triggerEvent('close');
    }
  }
});
