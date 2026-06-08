/**
 * 文件操作封装
 */

const fs = wx.getFileSystemManager();

/**
 * 获取用户目录路径
 */
function getUserDir() {
  return `${wx.env.USER_DATA_PATH}`;
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  return new Promise((resolve) => {
    try {
      fs.accessSync(dirPath);
      resolve(true);
    } catch (e) {
      try {
        fs.mkdirSync(dirPath, true);
        resolve(true);
      } catch (err) {
        console.error('创建目录失败:', err);
        resolve(false);
      }
    }
  });
}

/**
 * 保存文件到本地
 */
function saveFile(tempFilePath, fileName) {
  return new Promise(async (resolve, reject) => {
    const userDir = getUserDir();
    const filesDir = `${userDir}/files`;
    
    await ensureDir(filesDir);
    
    const targetPath = `${filesDir}/${fileName}`;
    
    fs.saveFile({
      tempFilePath,
      filePath: targetPath,
      success: () => resolve(targetPath),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 复制临时文件到本地
 */
function copyTempFile(tempFilePath, fileName) {
  return new Promise(async (resolve, reject) => {
    const userDir = getUserDir();
    const filesDir = `${userDir}/files`;
    
    await ensureDir(filesDir);
    
    const targetPath = `${filesDir}/${fileName}`;
    
    fs.copyFile({
      srcPath: tempFilePath,
      destPath: targetPath,
      success: () => resolve(targetPath),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 读取文件
 */
function readFile(filePath, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile({
      filePath,
      encoding,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 写入文件
 */
function writeFile(filePath, data, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile({
      filePath,
      data,
      encoding,
      success: () => resolve(true),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 删除文件
 */
function deleteFile(filePath) {
  return new Promise((resolve) => {
    fs.unlink({
      filePath,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
}

/**
 * 检查文件是否存在
 */
function fileExists(filePath) {
  return new Promise((resolve) => {
    fs.access({
      path: filePath,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
}

/**
 * 选择图片
 */
function chooseImage(count = 9, sizeType = ['compressed'], sourceType = ['album', 'camera']) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType,
      sourceType,
      success: (res) => resolve(res.tempFilePaths),
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) {
          resolve([]);
        } else {
          reject(err);
        }
      }
    });
  });
}

/**
 * 预览图片
 */
function previewImage(urls, current = '') {
  wx.previewImage({
    urls,
    current: current || urls[0]
  });
}

/**
 * 保存图片到相册
 */
function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => resolve(true),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 生成唯一文件名
 */
function generateFileName(ext = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 8);
  return ext ? `${timestamp}_${random}.${ext}` : `${timestamp}_${random}`;
}

/**
 * 获取文件扩展名
 */
function getFileExt(filePath) {
  const parts = filePath.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function chooseMessageFile(count = 5) {
  return new Promise((resolve, reject) => {
    wx.chooseMessageFile({
      count,
      type: 'all',
      success: (res) => {
        const files = res.tempFiles.map(f => ({
          path: f.path,
          name: f.name,
          size: f.size,
          type: f.type
        }));
        resolve(files);
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) {
          resolve([]);
        } else {
          reject(err);
        }
      }
    });
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          reject(new Error('下载失败'));
        }
      },
      fail: reject
    });
  });
}

function saveFileToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    const ext = getFileExt(filePath);
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
      saveImageToAlbum(filePath).then(resolve).catch(reject);
    } else {
      wx.openDocument({
        filePath,
        showMenu: true,
        success: () => resolve(true),
        fail: reject
      });
    }
  });
}

module.exports = {
  getUserDir,
  ensureDir,
  saveFile,
  copyTempFile,
  readFile,
  writeFile,
  deleteFile,
  fileExists,
  chooseImage,
  chooseMessageFile,
  downloadFile,
  previewImage,
  saveImageToAlbum,
  saveFileToAlbum,
  generateFileName,
  getFileExt
};
