const path = require('path');
const fs = require('fs');

console.log('=== Scenery 页面修复验证脚本 ===\n');

const PAGES_DIR = path.resolve(__dirname, '../pages/scenery');
const wxmlPath = path.join(PAGES_DIR, 'index.wxml');
const jsPath = path.join(PAGES_DIR, 'index.js');

const wxmlContent = fs.readFileSync(wxmlPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- WXML 语法检查 ---');

assert(!wxmlContent.includes('=>'), 'WXML 中不应包含箭头函数语法 =>');
assert(!wxmlContent.includes('findIndex'), 'WXML 中不应包含复杂的 findIndex 调用');
assert(wxmlContent.includes('{{activeCategoryLabel}}'), 'WXML 中应包含 {{activeCategoryLabel}} 数据绑定');

const chineseClassRegex = /class="[^"]*[\u4e00-\u9fa5]+[^"]*"/g;
const chineseMatches = wxmlContent.match(chineseClassRegex);
assert(chineseMatches === null, 'WXML 中不应包含任何中文类名选择器');

const wxForMatches = [...wxmlContent.matchAll(/wx:for="{{[^}]+}}"/g)];
let allHaveKey = true;
wxForMatches.forEach(match => {
  const snippetStart = match.index;
  const snippet = wxmlContent.substring(snippetStart, snippetStart + 200);
  if (!snippet.includes('wx:key')) {
    allHaveKey = false;
  }
});
assert(allHaveKey, 'WXML wx:for 循环应正确使用 wx:key');

const openViews = (wxmlContent.match(/<view[\s>]/g) || []).length;
const closeViews = (wxmlContent.match(/<\/view>/g) || []).length;
assert(openViews === closeViews, `WXML <view> 和 </view> 标签数量应匹配 (open: ${openViews}, close: ${closeViews})`);

const imageMatches = [...wxmlContent.matchAll(/<image[^>]*>/g)];
let allHaveMode = true;
imageMatches.forEach(match => {
  if (!match[0].includes('mode=')) {
    allHaveMode = false;
  }
});
assert(allHaveMode, 'WXML <image> 标签应有 mode 属性');

console.log('\n--- JS 代码检查 ---');

assert(jsContent.includes('getCategoryLabel'), 'index.js 中应定义 getCategoryLabel 方法');
assert(jsContent.includes('activeCategoryLabel'), 'index.js 中应定义 activeCategoryLabel 数据字段');

const loadDataStart = jsContent.indexOf('loadData()');
const nextMethodIndex = Math.min(
  jsContent.indexOf('onCategoryChange', loadDataStart) >= 0 ? jsContent.indexOf('onCategoryChange', loadDataStart) : jsContent.length,
  jsContent.indexOf('onItemTap', loadDataStart) >= 0 ? jsContent.indexOf('onItemTap', loadDataStart) : jsContent.length
);
const loadDataBlock = loadDataStart >= 0 ? jsContent.substring(loadDataStart, nextMethodIndex) : '';
const loadDataHasLabel = loadDataBlock.includes('activeCategoryLabel');
assert(loadDataHasLabel, 'loadData 方法中应更新 activeCategoryLabel');

const onCategoryChangeStart = jsContent.indexOf('onCategoryChange(e)');
const onCategoryChangeEnd = jsContent.indexOf('},', onCategoryChangeStart);
const onCategoryChangeBlock = onCategoryChangeStart >= 0 && onCategoryChangeEnd >= 0 ? jsContent.substring(onCategoryChangeStart, onCategoryChangeEnd) : '';
const onChangeHasLabel = onCategoryChangeBlock.includes('activeCategoryLabel');
assert(onChangeHasLabel, 'onCategoryChange 方法中应更新 activeCategoryLabel');

assert(jsContent.includes('mixPage'), 'index.js 使用的 mixPage 应正确导入');
assert(jsContent.includes('withTheme'), 'index.js 使用的 withTheme 应正确导入');

console.log('\n--- 数据字段初始化检查 ---');
assert(jsContent.match(/data:\s*\{[\s\S]*?\},\s*\n/) ? true : false, 'data 对象应存在');

const dataBlock = jsContent.match(/activeCategoryLabel:\s*'([^']+)'/);
const labelExists = dataBlock && dataBlock[1] === '全部';
assert(labelExists, `activeCategoryLabel 初始值应为 "全部" (实际: ${dataBlock ? dataBlock[1] : '未找到'})`);

console.log('\n--- getCategoryLabel 方法实现检查 ---');
assert(jsContent.includes('getCategoryLabel'), 'getCategoryLabel 方法存在');

console.log('\n=== 验证结果 ===');
console.log(`通过: ${passed}, 失败: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 所有验证通过！');
}
