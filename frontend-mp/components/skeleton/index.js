Component({
  properties: {
    type: {
      type: String,
      value: 'list'
    },
    count: {
      type: Number,
      value: 5
    },
    avatar: {
      type: Boolean,
      value: true
    },
    title: {
      type: Boolean,
      value: true
    },
    paragraph: {
      type: Number,
      value: 2
    },
    loading: {
      type: Boolean,
      value: true
    }
  },

  data: {
    items: []
  },

  lifetimes: {
    attached() {
      this._generateItems();
    }
  },

  observers: {
    'count': function() {
      this._generateItems();
    }
  },

  methods: {
    _generateItems() {
      const items = [];
      for (let i = 0; i < this.data.count; i++) {
        items.push({ index: i });
      }
      this.setData({ items });
    }
  }
});
