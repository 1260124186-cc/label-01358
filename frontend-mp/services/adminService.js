const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const mockData = require('../config/mock-data');
const campusService = require('./campusService');

let announcementsInitialized = false;
let campusNewsInitialized = false;
let broadcastInitialized = false;
let sceneryInitialized = false;

function initAnnouncements() {
  if (announcementsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.ANNOUNCEMENTS);
  if (!existing || existing.length === 0) {
    const list = mockData.ANNOUNCEMENTS.map((item, index) => ({
      id: item.id || util.generateId(),
      title: item.title,
      content: item.content,
      cover: item.image || '',
      isTop: index === 0,
      status: 'published',
      publishTime: item.createTime || Date.now() - index * 86400000,
      createTime: item.createTime || Date.now() - index * 86400000,
      updateTime: Date.now() - index * 86400000,
      sort: index
    }));
    storage.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
  }
  announcementsInitialized = true;
}

function initCampusNews() {
  if (campusNewsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.CAMPUS_NEWS);
  if (!existing || existing.length === 0) {
    const list = mockData.CAMPUS_NEWS.map((item, index) => ({
      id: item.id || util.generateId(),
      title: item.title,
      summary: item.summary || item.content.substring(0, 80),
      content: item.content,
      cover: item.image || '',
      images: item.images || [],
      category: item.category || 'notice',
      tags: item.tags || [],
      isTop: index < 2,
      status: 'published',
      publishTime: item.createTime || Date.now() - index * 3600000,
      createTime: item.createTime || Date.now() - index * 3600000,
      updateTime: Date.now() - index * 3600000,
      views: item.views || 0,
      sort: index
    }));
    storage.set(STORAGE_KEYS.CAMPUS_NEWS, list);
  }
  campusNewsInitialized = true;
}

function initBroadcastPrograms() {
  if (broadcastInitialized) return;
  const existing = storage.get(STORAGE_KEYS.BROADCAST_PROGRAMS);
  if (!existing || existing.length === 0) {
    const list = mockData.BROADCAST_LIST.map((item, index) => ({
      id: item.id || util.generateId(),
      title: item.title,
      description: item.description || '',
      audioUrl: item.audioUrl || '',
      cover: item.cover || '',
      category: item.category || 'music',
      anchor: item.anchor || '',
      duration: item.duration || 0,
      lyrics: item.lyrics || [],
      status: 'published',
      publishTime: item.createTime || Date.now() - index * 86400000,
      createTime: item.createTime || Date.now() - index * 86400000,
      updateTime: Date.now() - index * 86400000,
      sort: index
    }));
    storage.set(STORAGE_KEYS.BROADCAST_PROGRAMS, list);
  }
  broadcastInitialized = true;
}

function initSceneryManage() {
  if (sceneryInitialized) return;
  const existing = storage.get(STORAGE_KEYS.SCENERY_MANAGE);
  if (!existing || existing.length === 0) {
    const list = mockData.SCENERY_LIST
      .filter(item => item.reviewStatus === 'approved')
      .slice(0, 12)
      .map((item, index) => ({
        id: item.id || util.generateId(),
        title: item.title,
        description: item.description || '',
        image: item.image || '',
        category: item.category || 'nature',
        status: 'published',
        publishTime: item.createTime || Date.now() - index * 86400000,
        createTime: item.createTime || Date.now() - index * 86400000,
        updateTime: Date.now() - index * 86400000,
        sort: index
      }));
    storage.set(STORAGE_KEYS.SCENERY_MANAGE, list);
  }
  sceneryInitialized = true;
}

function getAnnouncements(campusId) {
  initAnnouncements();
  let list = storage.getList(STORAGE_KEYS.ANNOUNCEMENTS);
  list = campusService.filterListByCampus(list, campusId);
  return list.slice().sort((a, b) => {
    if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
    if (a.sort !== b.sort) return a.sort - b.sort;
    return (b.publishTime || 0) - (a.publishTime || 0);
  });
}

function getAnnouncementById(id) {
  initAnnouncements();
  const list = storage.getList(STORAGE_KEYS.ANNOUNCEMENTS);
  return list.find(item => item.id === id) || null;
}

function createAnnouncement(data) {
  initAnnouncements();
  const list = storage.getList(STORAGE_KEYS.ANNOUNCEMENTS);
  const now = Date.now();
  const item = {
    id: util.generateId(),
    title: data.title,
    content: data.content,
    cover: data.cover || '',
    isTop: !!data.isTop,
    status: data.status || 'published',
    publishTime: data.publishTime || now,
    createTime: now,
    updateTime: now,
    sort: data.sort != null ? data.sort : list.length,
    campusId: data.campusId || campusService.getCurrentCampusId()
  };
  list.unshift(item);
  storage.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
  return item;
}

function updateAnnouncement(id, data) {
  initAnnouncements();
  const list = storage.getList(STORAGE_KEYS.ANNOUNCEMENTS);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...data,
    id,
    updateTime: Date.now()
  };
  storage.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
  return list[index];
}

function deleteAnnouncement(id) {
  initAnnouncements();
  return storage.removeFromList(STORAGE_KEYS.ANNOUNCEMENTS, id);
}

function toggleAnnouncementTop(id) {
  initAnnouncements();
  const list = storage.getList(STORAGE_KEYS.ANNOUNCEMENTS);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return false;
  list[index].isTop = !list[index].isTop;
  list[index].updateTime = Date.now();
  storage.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
  return true;
}

function getCampusNewsList(campusId) {
  initCampusNews();
  let list = storage.getList(STORAGE_KEYS.CAMPUS_NEWS);
  list = campusService.filterListByCampus(list, campusId);
  return list.slice().sort((a, b) => {
    if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
    if (a.sort !== b.sort) return a.sort - b.sort;
    return (b.publishTime || 0) - (a.publishTime || 0);
  });
}

function getCampusNewsById(id) {
  initCampusNews();
  const list = storage.getList(STORAGE_KEYS.CAMPUS_NEWS);
  return list.find(item => item.id === id) || null;
}

function createCampusNews(data) {
  initCampusNews();
  const list = storage.getList(STORAGE_KEYS.CAMPUS_NEWS);
  const now = Date.now();
  const item = {
    id: util.generateId(),
    title: data.title,
    summary: data.summary || data.content.substring(0, 80),
    content: data.content,
    cover: data.cover || '',
    images: data.images || [],
    category: data.category || 'notice',
    tags: data.tags || [],
    isTop: !!data.isTop,
    status: data.status || 'published',
    publishTime: data.publishTime || now,
    createTime: now,
    updateTime: now,
    views: 0,
    sort: data.sort != null ? data.sort : list.length,
    campusId: data.campusId || campusService.getCurrentCampusId()
  };
  list.unshift(item);
  storage.set(STORAGE_KEYS.CAMPUS_NEWS, list);
  return item;
}

function updateCampusNews(id, data) {
  initCampusNews();
  const list = storage.getList(STORAGE_KEYS.CAMPUS_NEWS);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...data,
    id,
    updateTime: Date.now()
  };
  storage.set(STORAGE_KEYS.CAMPUS_NEWS, list);
  return list[index];
}

function deleteCampusNews(id) {
  initCampusNews();
  return storage.removeFromList(STORAGE_KEYS.CAMPUS_NEWS, id);
}

function toggleCampusNewsTop(id) {
  initCampusNews();
  const list = storage.getList(STORAGE_KEYS.CAMPUS_NEWS);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return false;
  list[index].isTop = !list[index].isTop;
  list[index].updateTime = Date.now();
  storage.set(STORAGE_KEYS.CAMPUS_NEWS, list);
  return true;
}

function getBroadcastPrograms(campusId) {
  initBroadcastPrograms();
  let list = storage.getList(STORAGE_KEYS.BROADCAST_PROGRAMS);
  list = campusService.filterListByCampus(list, campusId);
  return list.slice().sort((a, b) => {
    if (a.sort !== b.sort) return a.sort - b.sort;
    return (b.publishTime || 0) - (a.publishTime || 0);
  });
}

function getBroadcastProgramById(id) {
  initBroadcastPrograms();
  const list = storage.getList(STORAGE_KEYS.BROADCAST_PROGRAMS);
  return list.find(item => item.id === id) || null;
}

function createBroadcastProgram(data) {
  initBroadcastPrograms();
  const list = storage.getList(STORAGE_KEYS.BROADCAST_PROGRAMS);
  const now = Date.now();
  const item = {
    id: util.generateId(),
    title: data.title,
    description: data.description || '',
    audioUrl: data.audioUrl || '',
    cover: data.cover || '',
    category: data.category || 'music',
    anchor: data.anchor || '',
    duration: data.duration || 0,
    lyrics: data.lyrics || [],
    status: data.status || 'published',
    publishTime: data.publishTime || now,
    createTime: now,
    updateTime: now,
    sort: data.sort != null ? data.sort : list.length,
    campusId: data.campusId || campusService.getCurrentCampusId()
  };
  list.unshift(item);
  storage.set(STORAGE_KEYS.BROADCAST_PROGRAMS, list);
  return item;
}

function updateBroadcastProgram(id, data) {
  initBroadcastPrograms();
  const list = storage.getList(STORAGE_KEYS.BROADCAST_PROGRAMS);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...data,
    id,
    updateTime: Date.now()
  };
  storage.set(STORAGE_KEYS.BROADCAST_PROGRAMS, list);
  return list[index];
}

function deleteBroadcastProgram(id) {
  initBroadcastPrograms();
  return storage.removeFromList(STORAGE_KEYS.BROADCAST_PROGRAMS, id);
}

function moveBroadcastProgram(id, direction) {
  initBroadcastPrograms();
  const list = storage.getList(STORAGE_KEYS.BROADCAST_PROGRAMS);
  const sorted = list.slice().sort((a, b) => a.sort - b.sort);
  const currentIndex = sorted.findIndex(item => item.id === id);
  if (currentIndex === -1) return false;
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return false;
  const currentSort = sorted[currentIndex].sort;
  sorted[currentIndex].sort = sorted[targetIndex].sort;
  sorted[targetIndex].sort = currentSort;
  sorted[currentIndex].updateTime = Date.now();
  sorted[targetIndex].updateTime = Date.now();
  storage.set(STORAGE_KEYS.BROADCAST_PROGRAMS, list);
  return true;
}

function getSceneryList(campusId) {
  initSceneryManage();
  let list = storage.getList(STORAGE_KEYS.SCENERY_MANAGE);
  list = campusService.filterListByCampus(list, campusId);
  return list.slice().sort((a, b) => {
    if (a.sort !== b.sort) return a.sort - b.sort;
    return (b.publishTime || 0) - (a.publishTime || 0);
  });
}

function getSceneryById(id) {
  initSceneryManage();
  const list = storage.getList(STORAGE_KEYS.SCENERY_MANAGE);
  return list.find(item => item.id === id) || null;
}

function createScenery(data) {
  initSceneryManage();
  const list = storage.getList(STORAGE_KEYS.SCENERY_MANAGE);
  const now = Date.now();
  const item = {
    id: util.generateId(),
    title: data.title,
    description: data.description || '',
    image: data.image || '',
    category: data.category || 'nature',
    status: data.status || 'published',
    publishTime: data.publishTime || now,
    createTime: now,
    updateTime: now,
    sort: data.sort != null ? data.sort : list.length,
    campusId: data.campusId || campusService.getCurrentCampusId()
  };
  list.unshift(item);
  storage.set(STORAGE_KEYS.SCENERY_MANAGE, list);
  return item;
}

function updateScenery(id, data) {
  initSceneryManage();
  const list = storage.getList(STORAGE_KEYS.SCENERY_MANAGE);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...data,
    id,
    updateTime: Date.now()
  };
  storage.set(STORAGE_KEYS.SCENERY_MANAGE, list);
  return list[index];
}

function deleteScenery(id) {
  initSceneryManage();
  return storage.removeFromList(STORAGE_KEYS.SCENERY_MANAGE, id);
}

function moveScenery(id, direction) {
  initSceneryManage();
  const list = storage.getList(STORAGE_KEYS.SCENERY_MANAGE);
  const sorted = list.slice().sort((a, b) => a.sort - b.sort);
  const currentIndex = sorted.findIndex(item => item.id === id);
  if (currentIndex === -1) return false;
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return false;
  const currentSort = sorted[currentIndex].sort;
  sorted[currentIndex].sort = sorted[targetIndex].sort;
  sorted[targetIndex].sort = currentSort;
  sorted[currentIndex].updateTime = Date.now();
  sorted[targetIndex].updateTime = Date.now();
  storage.set(STORAGE_KEYS.SCENERY_MANAGE, list);
  return true;
}

function getStats(campusId) {
  return {
    announcementCount: getAnnouncements(campusId).length,
    newsCount: getCampusNewsList(campusId).length,
    broadcastCount: getBroadcastPrograms(campusId).length,
    sceneryCount: getSceneryList(campusId).length
  };
}

module.exports = {
  initAnnouncements,
  initCampusNews,
  initBroadcastPrograms,
  initSceneryManage,
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementTop,
  getCampusNewsList,
  getCampusNewsById,
  createCampusNews,
  updateCampusNews,
  deleteCampusNews,
  toggleCampusNewsTop,
  getBroadcastPrograms,
  getBroadcastProgramById,
  createBroadcastProgram,
  updateBroadcastProgram,
  deleteBroadcastProgram,
  moveBroadcastProgram,
  getSceneryList,
  getSceneryById,
  createScenery,
  updateScenery,
  deleteScenery,
  moveScenery,
  getStats
};
