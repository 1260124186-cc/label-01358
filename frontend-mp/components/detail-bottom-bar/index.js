Component({
  properties: {
    isFavorite: {
      type: Boolean,
      value: false
    },
    isOwner: {
      type: Boolean,
      value: false
    },
    enableFavorite: {
      type: Boolean,
      value: true
    },
    enableShare: {
      type: Boolean,
      value: true
    },
    enableReport: {
      type: Boolean,
      value: true
    },
    enableContact: {
      type: Boolean,
      value: true
    },
    enableOffer: {
      type: Boolean,
      value: false
    },
    contactText: {
      type: String,
      value: '立即联系'
    },
    ownerText: {
      type: String,
      value: '编辑'
    },
    offerText: {
      type: String,
      value: '我要出价'
    },
    contactDisabled: {
      type: Boolean,
      value: false
    },
    offerDisabled: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onFavorite() {
      this.triggerEvent('favorite');
    },

    onShare() {
      this.triggerEvent('share');
    },

    onReport() {
      this.triggerEvent('report');
    },

    onContact() {
      if (this.data.contactDisabled) return;
      this.triggerEvent('contact');
    },

    onOffer() {
      if (this.data.offerDisabled) return;
      this.triggerEvent('offer');
    }
  }
});
