const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const constants = require('../config/constants');

let sosInitialized = false;
let safetyArticlesInitialized = false;

function initSOSData() {
  if (sosInitialized) return;
  
  const existingContacts = storage.get(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS);
  if (!existingContacts || existingContacts.length === 0) {
    storage.set(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, []);
  }
  
  const existingHistory = storage.get(STORAGE_KEYS.SOS_HISTORY);
  if (!existingHistory) {
    storage.set(STORAGE_KEYS.SOS_HISTORY, []);
  }
  
  const existingSettings = storage.get(STORAGE_KEYS.SOS_SETTINGS);
  if (!existingSettings) {
    storage.set(STORAGE_KEYS.SOS_SETTINGS, {
      notifyAdmin: true,
      notifyContacts: true,
      soundAlert: true,
      vibrateAlert: true,
      autoCall: false
    });
  }
  
  sosInitialized = true;
}

function initSafetyArticles() {
  if (safetyArticlesInitialized) return;
  
  const existing = storage.get(STORAGE_KEYS.SAFETY_ARTICLES);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.SAFETY_ARTICLES, constants.SAFETY_ARTICLES);
  }
  
  safetyArticlesInitialized = true;
}

function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy,
          altitude: res.altitude,
          timestamp: Date.now()
        });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

function getNearestPOI(location) {
  const poiList = storage.getList(STORAGE_KEYS.POI_LIST);
  if (!poiList || poiList.length === 0 || !location) {
    return null;
  }
  
  let nearest = null;
  let minDistance = Infinity;
  
  poiList.forEach(poi => {
    if (poi.latitude && poi.longitude) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        poi.latitude,
        poi.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...poi, distance };
      }
    }
  });
  
  return nearest;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getEmergencyContacts() {
  initSOSData();
  return storage.getList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS);
}

function addEmergencyContact(contact) {
  initSOSData();
  const newContact = {
    id: util.generateId(),
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship || '其他',
    isPrimary: contact.isPrimary || false,
    createTime: Date.now(),
    updateTime: Date.now()
  };
  
  if (newContact.isPrimary) {
    const contacts = getEmergencyContacts();
    contacts.forEach(c => {
      storage.updateInList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, c.id, { isPrimary: false });
    });
  }
  
  return storage.addToList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, newContact);
}

function updateEmergencyContact(id, updates) {
  initSOSData();
  
  if (updates.isPrimary) {
    const contacts = getEmergencyContacts();
    contacts.forEach(c => {
      if (c.id !== id) {
        storage.updateInList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, c.id, { isPrimary: false });
      }
    });
  }
  
  return storage.updateInList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function removeEmergencyContact(id) {
  initSOSData();
  return storage.removeFromList(STORAGE_KEYS.SOS_EMERGENCY_CONTACTS, id);
}

function getSOSSettings() {
  initSOSData();
  return storage.get(STORAGE_KEYS.SOS_SETTINGS);
}

function updateSOSSettings(settings) {
  initSOSData();
  const current = getSOSSettings();
  return storage.set(STORAGE_KEYS.SOS_SETTINGS, {
    ...current,
    ...settings
  });
}

function getSOSHistory() {
  initSOSData();
  return storage.getList(STORAGE_KEYS.SOS_HISTORY);
}

function addSOSHistory(record) {
  initSOSData();
  const newRecord = {
    id: util.generateId(),
    status: record.status || constants.SOS_STATUS.PENDING,
    location: record.location,
    nearestPOI: record.nearestPOI,
    emergencyContacts: record.emergencyContacts || [],
    notifiedAdmin: record.notifiedAdmin || false,
    notifiedContacts: record.notifiedContacts || [],
    timestamp: Date.now(),
    remark: record.remark || ''
  };
  
  storage.addToList(STORAGE_KEYS.SOS_HISTORY, newRecord);
  return newRecord;
}

function updateSOSHistory(id, updates) {
  initSOSData();
  return storage.updateInList(STORAGE_KEYS.SOS_HISTORY, id, updates);
}

async function triggerSOS(remark = '') {
  initSOSData();
  
  const settings = getSOSSettings();
  const contacts = getEmergencyContacts();
  
  if (settings.soundAlert) {
    try {
      wx.vibrateLong({});
    } catch (e) {}
  }
  
  if (settings.vibrateAlert) {
    try {
      wx.vibrateShort({});
    } catch (e) {}
  }
  
  let location = null;
  let nearestPOI = null;
  
  try {
    location = await getLocation();
    nearestPOI = getNearestPOI(location);
  } catch (e) {
    console.error('Get location failed:', e);
  }
  
  const sosRecord = addSOSHistory({
    location,
    nearestPOI,
    emergencyContacts: contacts,
    remark
  });
  
  let notifiedAdmin = false;
  const notifiedContacts = [];
  
  if (settings.notifyAdmin) {
    try {
      await notifyAdmin(sosRecord);
      notifiedAdmin = true;
    } catch (e) {
      console.error('Notify admin failed:', e);
    }
  }
  
  if (settings.notifyContacts && contacts.length > 0) {
    for (const contact of contacts) {
      try {
        await notifyContact(contact, sosRecord);
        notifiedContacts.push(contact.id);
      } catch (e) {
        console.error(`Notify contact ${contact.name} failed:`, e);
      }
    }
  }
  
  if (settings.autoCall && constants.CAMPUS_SECURITY_CONTACTS.length > 0) {
    const securityContact = constants.CAMPUS_SECURITY_CONTACTS[0];
    try {
      wx.makePhoneCall({
        phoneNumber: securityContact.phone,
        fail: () => {}
      });
    } catch (e) {}
  }
  
  updateSOSHistory(sosRecord.id, {
    status: constants.SOS_STATUS.SENT,
    notifiedAdmin,
    notifiedContacts
  });
  
  return {
    ...sosRecord,
    status: constants.SOS_STATUS.SENT,
    notifiedAdmin,
    notifiedContacts
  };
}

async function notifyAdmin(sosRecord) {
  return new Promise((resolve, reject) => {
    const adminContacts = constants.CAMPUS_SECURITY_CONTACTS.filter(c => 
      c.id === 'security_office' || c.id === 'campus_police'
    );
    
    if (adminContacts.length === 0) {
      resolve(false);
      return;
    }
    
    console.log('Notifying admin with SOS record:', sosRecord);
    resolve(true);
  });
}

async function notifyContact(contact, sosRecord) {
  return new Promise((resolve, reject) => {
    console.log(`Notifying contact ${contact.name}:`, sosRecord);
    resolve(true);
  });
}

function getSafetyArticles(category = 'all') {
  initSafetyArticles();
  const articles = storage.getList(STORAGE_KEYS.SAFETY_ARTICLES);
  
  if (category === 'all') {
    return articles;
  }
  
  return articles.filter(a => a.category === category);
}

function getSafetyArticleById(id) {
  initSafetyArticles();
  const articles = storage.getList(STORAGE_KEYS.SAFETY_ARTICLES);
  const article = articles.find(a => a.id === id);
  
  if (article) {
    storage.updateInList(STORAGE_KEYS.SAFETY_ARTICLES, id, {
      views: (article.views || 0) + 1
    });
    article.views = (article.views || 0) + 1;
  }
  
  return article;
}

function getCampusSecurityContacts() {
  return constants.CAMPUS_SECURITY_CONTACTS;
}

module.exports = {
  initSOSData,
  initSafetyArticles,
  getLocation,
  getNearestPOI,
  calculateDistance,
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  removeEmergencyContact,
  getSOSSettings,
  updateSOSSettings,
  getSOSHistory,
  addSOSHistory,
  updateSOSHistory,
  triggerSOS,
  notifyAdmin,
  notifyContact,
  getSafetyArticles,
  getSafetyArticleById,
  getCampusSecurityContacts
};
