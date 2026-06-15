const storage = require('./storage');

const LIST_CACHE_PREFIX = 'list_cache_';
const DEFAULT_PAGE_SIZE = 15;
const CACHE_EXPIRE_TIME = 5 * 60 * 1000;

const DEFAULT_EMPTY_CONFIG = {
  image: '',
  text: '暂无数据',
  showAction: false,
  actionText: '刷新',
  onAction: null
};

const DEFAULT_SKELETON_CONFIG = {
  enable: true,
  type: 'list',
  count: 5,
  avatar: true,
  title: true,
  paragraph: 2
};

function getCacheKey(listKey, filters) {
  const filterStr = filters ? JSON.stringify(filters) : 'default';
  return LIST_CACHE_PREFIX + listKey + '_' + filterStr;
}

function getListCache(listKey, filters) {
  try {
    const cacheKey = getCacheKey(listKey, filters);
    const cache = storage.get(cacheKey);
    if (cache && cache.expireTime > Date.now()) {
      return cache.data;
    }
    return null;
  } catch (e) {
    console.error('getListCache error:', e);
    return null;
  }
}

function setListCache(listKey, filters, data) {
  try {
    const cacheKey = getCacheKey(listKey, filters);
    storage.set(cacheKey, {
      data,
      expireTime: Date.now() + CACHE_EXPIRE_TIME
    });
  } catch (e) {
    console.error('setListCache error:', e);
  }
}

function clearListCache(listKey) {
  try {
    const keys = [];
    const info = wx.getStorageInfoSync();
    info.keys.forEach(key => {
      if (key.startsWith(LIST_CACHE_PREFIX + listKey)) {
        keys.push(key);
      }
    });
    keys.forEach(key => storage.remove(key));
  } catch (e) {
    console.error('clearListCache error:', e);
  }
}

function mixinList(pageOptions, options = {}) {
  const {
    listKey = '',
    pageSize = DEFAULT_PAGE_SIZE,
    enableCache = true,
    cacheFirst = false,
    dataField = 'list',
    loadMethod = null,
    formatItem = null,
    enablePullDownRefresh = true,
    enableReachBottom = true,
    skeleton = {},
    empty = {},
    autoLoad = true
  } = options;

  const skeletonConfig = { ...DEFAULT_SKELETON_CONFIG, ...skeleton };
  const emptyConfig = { ...DEFAULT_EMPTY_CONFIG, ...empty };

  const originalOnLoad = pageOptions.onLoad;
  const originalOnShow = pageOptions.onShow;
  const originalOnPullDownRefresh = pageOptions.onPullDownRefresh;
  const originalOnReachBottom = pageOptions.onReachBottom;

  pageOptions.data = pageOptions.data || {};
  pageOptions.data[dataField] = pageOptions.data[dataField] || [];
  pageOptions.data.loading = pageOptions.data.loading !== undefined ? pageOptions.data.loading : false;
  pageOptions.data.refreshing = pageOptions.data.refreshing !== undefined ? pageOptions.data.refreshing : false;
  pageOptions.data.loadingMore = false;
  pageOptions.data.noMore = false;
  pageOptions.data.page = 1;
  pageOptions.data.pageSize = pageSize;
  pageOptions.data.total = 0;
  pageOptions.data.showSkeleton = skeletonConfig.enable;
  pageOptions.data.skeletonConfig = skeletonConfig;
  pageOptions.data.emptyConfig = emptyConfig;
  pageOptions.data._listInitialized = false;
  pageOptions.data._cacheLoaded = false;

  if (enablePullDownRefresh) {
    pageOptions.enablePullDownRefresh = true;
  }

  pageOptions.onLoad = function (query) {
    this._listQuery = query || {};
    this._listFilters = {};
    this._listKey = listKey;
    this._skeletonConfig = skeletonConfig;
    this._emptyConfig = emptyConfig;

    if (originalOnLoad) {
      originalOnLoad.call(this, query);
    }

    if (enableCache && cacheFirst) {
      const cachedData = getListCache(listKey, this._listFilters);
      if (cachedData && cachedData.list && cachedData.list.length > 0) {
        const formattedList = formatItem
          ? cachedData.list.map(item => formatItem.call(this, item))
          : cachedData.list;
        this.setData({
          [dataField]: formattedList,
          total: cachedData.total || 0,
          page: cachedData.page || 1,
          noMore: cachedData.noMore || false,
          showSkeleton: false,
          _cacheLoaded: true
        });
        this._listInitialized = true;
      }
    }

    if (autoLoad && !this._listInitialized) {
      this.loadList(true);
    }
  };

  pageOptions.onShow = function () {
    if (originalOnShow) {
      originalOnShow.call(this);
    }

    if (this._fromDetail && enableCache && this._listInitialized) {
      this._fromDetail = false;
      return;
    }

    if (autoLoad && !this._listInitialized) {
      this.loadList(true);
    }
  };

  if (enablePullDownRefresh) {
    pageOptions.onPullDownRefresh = function () {
      if (originalOnPullDownRefresh) {
        originalOnPullDownRefresh.call(this);
      }
      this.refreshList().then(() => {
        wx.stopPullDownRefresh();
      });
    };
  }

  if (enableReachBottom) {
    pageOptions.onReachBottom = function () {
      if (originalOnReachBottom) {
        originalOnReachBottom.call(this);
      }
      this.loadMore();
    };
  }

  pageOptions.loadList = function (isRefresh = false) {
    if (this.data.loading || this.data.loadingMore) {
      return Promise.resolve();
    }

    const page = isRefresh ? 1 : this.data.page;
    const currentList = isRefresh ? [] : this.data[dataField];

    this.setData({
      loading: isRefresh && !this._listInitialized,
      refreshing: isRefresh && this._listInitialized,
      showSkeleton: skeletonConfig.enable && isRefresh && !this._listInitialized && !this.data._cacheLoaded
    });

    const filters = { ...this._listFilters };

    return new Promise((resolve) => {
      if (loadMethod) {
        loadMethod.call(this, { page, pageSize, filters })
          .then(result => {
            this._handleLoadResult(result, page, isRefresh, currentList, resolve);
          })
          .catch(() => {
            this._handleLoadError(resolve);
          });
      } else {
        this._handleLoadError(resolve);
      }
    });
  };

  pageOptions._handleLoadResult = function (result, page, isRefresh, currentList, resolve) {
    const { list = [], total = 0, hasMore = true } = result || {};

    const formattedList = formatItem
      ? list.map(item => formatItem.call(this, item))
      : list;

    const newList = isRefresh ? formattedList : [...currentList, ...formattedList];
    const noMore = !hasMore || newList.length >= total;

    this.setData({
      [dataField]: newList,
      total,
      page: isRefresh ? 1 : page,
      noMore,
      loading: false,
      refreshing: false,
      loadingMore: false,
      showSkeleton: false
    });

    this._listInitialized = true;

    if (enableCache && isRefresh) {
      setListCache(this._listKey, this._listFilters, {
        list: newList,
        total,
        page: 1,
        noMore
      });
    }

    resolve();
  };

  pageOptions._handleLoadError = function (resolve) {
    this.setData({
      loading: false,
      refreshing: false,
      loadingMore: false,
      showSkeleton: false
    });
    resolve();
  };

  pageOptions.refreshList = function () {
    return this.loadList(true);
  };

  pageOptions.loadMore = function () {
    if (this.data.loading || this.data.loadingMore || this.data.noMore || this.data.refreshing) {
      return Promise.resolve();
    }

    this.setData({ loadingMore: true });

    const nextPage = this.data.page + 1;
    this.setData({ page: nextPage });

    return this.loadList(false);
  };

  pageOptions.setListFilters = function (filters) {
    this._listFilters = { ...filters };
    this.loadList(true);
  };

  pageOptions.goToDetail = function (url) {
    this._fromDetail = true;
    wx.navigateTo({ url });
  };

  pageOptions.clearListCache = function () {
    clearListCache(this._listKey);
  };

  pageOptions.onEmptyAction = function () {
    if (emptyConfig.onAction && typeof emptyConfig.onAction === 'function') {
      emptyConfig.onAction.call(this);
    } else {
      this.refreshList();
    }
  };

  pageOptions.onListRefresh = function () {
    this.refreshList();
  };

  pageOptions.onListLoadMore = function () {
    this.loadMore();
  };

  pageOptions.onListItemTap = function (e) {
    const { item } = e.currentTarget.dataset;
    if (item && item.id) {
      this.goToDetail(`${this.data.detailPagePath || '/pages/detail/index'}?id=${item.id}`);
    }
  };

  return pageOptions;
}

module.exports = {
  mixinList,
  getListCache,
  setListCache,
  clearListCache,
  DEFAULT_PAGE_SIZE,
  DEFAULT_EMPTY_CONFIG,
  DEFAULT_SKELETON_CONFIG
};
