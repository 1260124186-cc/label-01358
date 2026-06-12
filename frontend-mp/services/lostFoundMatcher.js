const dataService = require('./data');
const constants = require('../config/constants');
const aiService = require('./aiImageRecognition');

const MATCH_WEIGHTS = {
  type: 0.25,
  itemType: 0.25,
  colors: 0.2,
  brands: 0.15,
  location: 0.1,
  date: 0.05
};

const COLOR_MATCH_SCORE = 0.8;
const BRAND_MATCH_SCORE = 0.9;
const ITEM_TYPE_MATCH_SCORE = 1.0;
const LOCATION_MATCH_SCORE = 0.7;
const DATE_PROXIMITY_DECAY = 0.1;
const MAX_DATE_DAYS = 14;

function calculateTypeMatch(lostItem, foundItem) {
  if (lostItem.type === foundItem.type) {
    return 0;
  }
  return MATCH_WEIGHTS.type;
}

function calculateItemTypeMatch(lostTags, foundTags) {
  if (!lostTags.category || !foundTags.category) {
    return 0;
  }
  
  if (lostTags.category.value === foundTags.category.value) {
    const confidence = Math.min(lostTags.category.confidence, foundTags.category.confidence);
    return MATCH_WEIGHTS.itemType * ITEM_TYPE_MATCH_SCORE * confidence;
  }
  
  return 0;
}

function calculateColorMatch(lostTags, foundTags) {
  if (!lostTags.colors || !foundTags.colors || lostTags.colors.length === 0 || foundTags.colors.length === 0) {
    return 0;
  }
  
  const lostColors = new Set(lostTags.colors.map(c => c.value));
  const foundColors = new Set(foundTags.colors.map(c => c.value));
  
  let matchScore = 0;
  let matchedColors = [];
  
  lostTags.colors.forEach(lostColor => {
    if (foundColors.has(lostColor.value)) {
      const foundColor = foundTags.colors.find(c => c.value === lostColor.value);
      const confidence = Math.min(lostColor.confidence, foundColor.confidence);
      matchScore += confidence * COLOR_MATCH_SCORE;
      matchedColors.push({
        value: lostColor.value,
        label: lostColor.label,
        confidence
      });
    }
  });
  
  const maxPossibleScore = lostColors.size;
  const normalizedScore = maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0;
  
  return {
    score: MATCH_WEIGHTS.colors * normalizedScore,
    matchedColors,
    allLostColors: lostTags.colors,
    allFoundColors: foundTags.colors
  };
}

function calculateBrandMatch(lostTags, foundTags) {
  if (!lostTags.brands || !foundTags.brands || lostTags.brands.length === 0 || foundTags.brands.length === 0) {
    return {
      score: 0,
      matchedBrands: [],
      allLostBrands: lostTags.brands || [],
      allFoundBrands: foundTags.brands || []
    };
  }
  
  const lostBrands = new Set(lostTags.brands.map(b => b.value));
  const foundBrands = new Set(foundTags.brands.map(b => b.value));
  
  let matchScore = 0;
  let matchedBrands = [];
  
  lostTags.brands.forEach(lostBrand => {
    if (foundBrands.has(lostBrand.value)) {
      const foundBrand = foundTags.brands.find(b => b.value === lostBrand.value);
      const confidence = Math.min(lostBrand.confidence, foundBrand.confidence);
      matchScore += confidence * BRAND_MATCH_SCORE;
      matchedBrands.push({
        value: lostBrand.value,
        label: lostBrand.label,
        confidence
      });
    }
  });
  
  const maxPossibleScore = Math.max(lostBrands.size, 1);
  const normalizedScore = matchScore / maxPossibleScore;
  
  return {
    score: MATCH_WEIGHTS.brands * normalizedScore,
    matchedBrands,
    allLostBrands: lostTags.brands,
    allFoundBrands: foundTags.brands
  };
}

function calculateLocationMatch(lostItem, foundItem) {
  if (!lostItem.location || !foundItem.location) {
    return 0;
  }
  
  if (lostItem.location === foundItem.location) {
    return MATCH_WEIGHTS.location * LOCATION_MATCH_SCORE;
  }
  
  if (lostItem.locationPOIId && foundItem.locationPOIId && 
      lostItem.locationPOIId === foundItem.locationPOIId) {
    return MATCH_WEIGHTS.location * LOCATION_MATCH_SCORE * 0.9;
  }
  
  return 0;
}

function calculateDateMatch(lostItem, foundItem) {
  if (!lostItem.date || !foundItem.date) {
    return 0;
  }
  
  const lostDate = new Date(lostItem.date);
  const foundDate = new Date(foundItem.date);
  
  const diffMs = Math.abs(foundDate.getTime() - lostDate.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays <= MAX_DATE_DAYS) {
    const decayFactor = Math.max(0, 1 - diffDays * DATE_PROXIMITY_DECAY);
    return MATCH_WEIGHTS.date * decayFactor;
  }
  
  return 0;
}

function calculateMatchScore(lostItem, foundItem) {
  const lostTags = lostItem.aiTags || { colors: [], brands: [], category: null };
  const foundTags = foundItem.aiTags || { colors: [], brands: [], category: null };
  
  const typeScore = calculateTypeMatch(lostItem, foundItem);
  const itemTypeScore = calculateItemTypeMatch(lostTags, foundTags);
  const colorResult = calculateColorMatch(lostTags, foundTags);
  const brandResult = calculateBrandMatch(lostTags, foundTags);
  const locationScore = calculateLocationMatch(lostItem, foundItem);
  const dateScore = calculateDateMatch(lostItem, foundItem);
  
  const colorScore = typeof colorResult === 'object' ? colorResult.score : colorResult;
  const brandScore = typeof brandResult === 'object' ? brandResult.score : brandResult;
  
  const totalScore = typeScore + itemTypeScore + colorScore + brandScore + locationScore + dateScore;
  const normalizedScore = Math.min(100, Math.round(totalScore * 100));
  
  const details = {
    type: { score: typeScore, weight: MATCH_WEIGHTS.type },
    itemType: { score: itemTypeScore, weight: MATCH_WEIGHTS.itemType },
    colors: { 
      score: colorScore, 
      weight: MATCH_WEIGHTS.colors,
      details: typeof colorResult === 'object' ? colorResult : null
    },
    brands: { 
      score: brandScore, 
      weight: MATCH_WEIGHTS.brands,
      details: typeof brandResult === 'object' ? brandResult : null
    },
    location: { score: locationScore, weight: MATCH_WEIGHTS.location },
    date: { score: dateScore, weight: MATCH_WEIGHTS.date }
  };
  
  let matchLevel = 'low';
  if (normalizedScore >= 80) {
    matchLevel = 'excellent';
  } else if (normalizedScore >= 60) {
    matchLevel = 'high';
  } else if (normalizedScore >= 40) {
    matchLevel = 'medium';
  }
  
  return {
    score: normalizedScore,
    matchLevel,
    details,
    lostItemId: lostItem.id,
    foundItemId: foundItem.id,
    timestamp: Date.now()
  };
}

function findMatchesForItem(item, options = {}) {
  const {
    minScore = 30,
    limit = 10,
    oppositeTypeOnly = true,
    customGetList = null
  } = options;
  
  const allItems = customGetList 
    ? customGetList() 
    : dataService.getLostFoundList({ status: 'active' });
  const matches = [];
  
  allItems.forEach(candidate => {
    if (candidate.id === item.id) return;
    
    if (oppositeTypeOnly && candidate.type === item.type) return;
    
    const matchResult = calculateMatchScore(item, candidate);
    
    if (matchResult.score >= minScore) {
      matches.push({
        ...matchResult,
        item: {
          ...candidate,
          itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, candidate.itemType),
          locationText: constants.getLabelByValue(constants.LOCATIONS, candidate.location) || candidate.location,
          timeText: require('../utils/util').relativeTime(candidate.createTime)
        }
      });
    }
  });
  
  matches.sort((a, b) => b.score - a.score);
  
  return {
    total: matches.length,
    matches: matches.slice(0, limit),
    threshold: minScore
  };
}

function findLostFoundMatches(options = {}) {
  const {
    minScore = 30,
    limit = 20,
    customGetList = null
  } = options;
  
  const allItems = customGetList 
    ? customGetList() 
    : dataService.getLostFoundList({ status: 'active' });
  const lostItems = allItems.filter(i => i.type === 'lost');
  const foundItems = allItems.filter(i => i.type === 'found');
  
  const allMatches = [];
  const processedPairs = new Set();
  
  lostItems.forEach(lostItem => {
    foundItems.forEach(foundItem => {
      const pairKey = [lostItem.id, foundItem.id].sort().join('_');
      if (processedPairs.has(pairKey)) return;
      processedPairs.add(pairKey);
      
      const matchResult = calculateMatchScore(lostItem, foundItem);
      
      if (matchResult.score >= minScore) {
        allMatches.push({
          ...matchResult,
          lostItem: {
            ...lostItem,
            itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, lostItem.itemType),
            locationText: constants.getLabelByValue(constants.LOCATIONS, lostItem.location) || lostItem.location,
            timeText: require('../utils/util').relativeTime(lostItem.createTime)
          },
          foundItem: {
            ...foundItem,
            itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, foundItem.itemType),
            locationText: constants.getLabelByValue(constants.LOCATIONS, foundItem.location) || foundItem.location,
            timeText: require('../utils/util').relativeTime(foundItem.createTime)
          }
        });
      }
    });
  });
  
  allMatches.sort((a, b) => b.score - a.score);
  
  const groupedMatches = {
    excellent: [],
    high: [],
    medium: [],
    low: []
  };
  
  allMatches.forEach(match => {
    if (groupedMatches[match.matchLevel]) {
      groupedMatches[match.matchLevel].push(match);
    }
  });
  
  return {
    total: allMatches.length,
    matches: allMatches.slice(0, limit),
    grouped: groupedMatches,
    threshold: minScore,
    statistics: {
      excellent: groupedMatches.excellent.length,
      high: groupedMatches.high.length,
      medium: groupedMatches.medium.length,
      low: groupedMatches.low.length,
      lostCount: lostItems.length,
      foundCount: foundItems.length
    }
  };
}

function getMatchLevelInfo(level) {
  const levels = {
    excellent: {
      label: '极高度匹配',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      icon: '🔥',
      description: '物品特征高度吻合，极有可能是您要找的物品'
    },
    high: {
      label: '高度匹配',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      icon: '⭐',
      description: '多项特征匹配，建议查看详情确认'
    },
    medium: {
      label: '中度匹配',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      icon: '🔍',
      description: '部分特征匹配，可以进一步确认'
    },
    low: {
      label: '低度匹配',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      icon: '📌',
      description: '少数特征相似，匹配度较低'
    }
  };
  
  return levels[level] || levels.low;
}

function generateMatchComparison(lostItem, foundItem, matchResult) {
  const lostTags = lostItem.aiTags || { colors: [], brands: [], category: null };
  const foundTags = foundItem.aiTags || { colors: [], brands: [], category: null };
  
  const colorMatch = matchResult.details.colors.details;
  const brandMatch = matchResult.details.brands.details;
  
  return {
    overall: {
      score: matchResult.score,
      level: matchResult.matchLevel,
      levelInfo: getMatchLevelInfo(matchResult.matchLevel)
    },
    items: {
      lost: {
        id: lostItem.id,
        title: lostItem.title,
        images: lostItem.images || [],
        type: lostItem.type,
        date: lostItem.date,
        location: lostItem.location,
        tags: lostTags,
        description: lostItem.description
      },
      found: {
        id: foundItem.id,
        title: foundItem.title,
        images: foundItem.images || [],
        type: foundItem.type,
        date: foundItem.date,
        location: foundItem.location,
        tags: foundTags,
        description: foundItem.description
      }
    },
    comparison: [
      {
        field: '物品类型',
        lost: lostTags.category ? lostTags.category.label : '未识别',
        found: foundTags.category ? foundTags.category.label : '未识别',
        matched: matchResult.details.itemType.score > 0,
        score: matchResult.details.itemType.score
      },
      {
        field: '颜色特征',
        lost: lostTags.colors.map(c => c.label).join('、') || '未识别',
        found: foundTags.colors.map(c => c.label).join('、') || '未识别',
        matched: colorMatch && colorMatch.matchedColors && colorMatch.matchedColors.length > 0,
        matchedValues: colorMatch && colorMatch.matchedColors ? colorMatch.matchedColors.map(c => c.label) : [],
        score: matchResult.details.colors.score
      },
      {
        field: '品牌特征',
        lost: lostTags.brands.map(b => b.label).join('、') || '未识别',
        found: foundTags.brands.map(b => b.label).join('、') || '未识别',
        matched: brandMatch && brandMatch.matchedBrands && brandMatch.matchedBrands.length > 0,
        matchedValues: brandMatch && brandMatch.matchedBrands ? brandMatch.matchedBrands.map(b => b.label) : [],
        score: matchResult.details.brands.score
      },
      {
        field: '地点',
        lost: constants.getLabelByValue(constants.LOCATIONS, lostItem.location) || lostItem.location,
        found: constants.getLabelByValue(constants.LOCATIONS, foundItem.location) || foundItem.location,
        matched: matchResult.details.location.score > 0,
        score: matchResult.details.location.score
      },
      {
        field: '日期',
        lost: lostItem.date || '未填写',
        found: foundItem.date || '未填写',
        matched: matchResult.details.date.score > 0,
        score: matchResult.details.date.score
      }
    ]
  };
}

module.exports = {
  MATCH_WEIGHTS,
  calculateMatchScore,
  findMatchesForItem,
  findLostFoundMatches,
  getMatchLevelInfo,
  generateMatchComparison,
  calculateColorMatch,
  calculateBrandMatch,
  calculateItemTypeMatch,
  calculateLocationMatch,
  calculateDateMatch
};
