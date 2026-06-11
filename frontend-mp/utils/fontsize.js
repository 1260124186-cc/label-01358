const storage = require('./storage');

const FONT_SIZE_KEY = 'font_size_settings';

const FONT_SIZES = {
  standard: { name: '标准', scale: 1, className: 'font-size-standard' },
  large: { name: '大', scale: 1.15, className: 'font-size-large' },
  xl: { name: '特大', scale: 1.3, className: 'font-size-xl' }
};

const DEFAULT_FONT_SIZE = 'standard';

function getSettings() {
  return storage.get(FONT_SIZE_KEY) || { size: DEFAULT_FONT_SIZE };
}

function saveSettings(settings) {
  storage.set(FONT_SIZE_KEY, settings);
}

function getFontSize() {
  const settings = getSettings();
  return settings.size || DEFAULT_FONT_SIZE;
}

function getFontSizeConfig(size) {
  return FONT_SIZES[size] || FONT_SIZES[DEFAULT_FONT_SIZE];
}

function getClassName() {
  const size = getFontSize();
  return getFontSizeConfig(size).className;
}

function setFontSize(size) {
  if (!FONT_SIZES[size]) {
    size = DEFAULT_FONT_SIZE;
  }
  const settings = { size };
  saveSettings(settings);

  try {
    const pages = getCurrentPages();
    pages.forEach(p => {
      if (p && p.setData) {
        p.setData({ fontSizeClass: getFontSizeConfig(size).className, fontSize: size });
      }
    });
  } catch (e) {}

  return { size, config: getFontSizeConfig(size) };
}

function init() {
  const settings = getSettings();
  const size = settings.size || DEFAULT_FONT_SIZE;
  const config = getFontSizeConfig(size);
  return { size, config, className: config.className };
}

module.exports = {
  FONT_SIZES,
  DEFAULT_FONT_SIZE,
  getSettings,
  saveSettings,
  getFontSize,
  getFontSizeConfig,
  getClassName,
  setFontSize,
  init
};
