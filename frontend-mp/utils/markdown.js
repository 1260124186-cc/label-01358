function parseInline(text) {
  var nodes = [];
  var remaining = text;
  while (remaining.length > 0) {
    var boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    var italicMatch = remaining.match(/\*(.+?)\*/);
    var codeMatch = remaining.match(/`(.+?)`/);
    var matches = [];
    if (boldMatch && boldMatch.index !== undefined) matches.push({ type: 'bold', match: boldMatch, index: boldMatch.index });
    if (italicMatch && italicMatch.index !== undefined && !(boldMatch && boldMatch.index !== undefined && boldMatch.index <= italicMatch.index && boldMatch.index + boldMatch[0].length > italicMatch.index)) matches.push({ type: 'italic', match: italicMatch, index: italicMatch.index });
    if (codeMatch && codeMatch.index !== undefined) matches.push({ type: 'code', match: codeMatch, index: codeMatch.index });
    if (matches.length === 0) {
      nodes.push({ type: 'text', text: remaining });
      break;
    }
    matches.sort(function(a, b) { return a.index - b.index; });
    var first = matches[0];
    if (first.index > 0) {
      nodes.push({ type: 'text', text: remaining.substring(0, first.index) });
    }
    if (first.type === 'bold') {
      nodes.push({ type: 'strong', children: parseInline(first.match[1]) });
    } else if (first.type === 'italic') {
      nodes.push({ type: 'em', children: parseInline(first.match[1]) });
    } else if (first.type === 'code') {
      nodes.push({ type: 'code', text: first.match[1] });
    }
    remaining = remaining.substring(first.index + first.match[0].length);
  }
  return nodes;
}

function inlineNodesToWxml(nodes) {
  return nodes.map(function(node) {
    if (node.type === 'text') return node.text;
    if (node.type === 'strong') return '<strong>' + inlineNodesToWxml(node.children) + '</strong>';
    if (node.type === 'em') return '<em>' + inlineNodesToWxml(node.children) + '</em>';
    if (node.type === 'code') return '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-size:0.9em;">' + escapeHtml(node.text) + '</code>';
    return '';
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseMarkdown(markdown) {
  if (!markdown) return [];
  var lines = markdown.split('\n');
  var blocks = [];
  var currentList = [];
  var listType = '';

  function flushList() {
    if (currentList.length > 0) {
      var items = currentList.map(function(item) {
        return '<li>' + inlineNodesToWxml(parseInline(item)) + '</li>';
      }).join('');
      if (listType === 'ul') {
        blocks.push('<ul style="padding-left:1.5em;margin:8rpx 0;">' + items + '</ul>');
      } else {
        blocks.push('<ol style="padding-left:1.5em;margin:8rpx 0;">' + items + '</ol>');
      }
      currentList = [];
      listType = '';
    }
  }

  lines.forEach(function(line) {
    var trimmed = line.trim();
    if (trimmed === '') {
      flushList();
      return;
    }

    var h2Match = trimmed.match(/^##\s+(.+)/);
    var h3Match = trimmed.match(/^###\s+(.+)/);
    var h4Match = trimmed.match(/^####\s+(.+)/);
    var ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    var olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    var blockquoteMatch = trimmed.match(/^>\s+(.+)/);
    var hrMatch = trimmed.match(/^---+$/);
    var tableRowMatch = trimmed.match(/^\|(.+)\|$/);

    if (h2Match) {
      flushList();
      blocks.push('<h2 style="font-size:32rpx;font-weight:700;margin:24rpx 0 12rpx;color:var(--color-text-primary);">' + inlineNodesToWxml(parseInline(h2Match[1])) + '</h2>');
    } else if (h3Match) {
      flushList();
      blocks.push('<h3 style="font-size:30rpx;font-weight:600;margin:20rpx 0 10rpx;color:var(--color-text-primary);">' + inlineNodesToWxml(parseInline(h3Match[1])) + '</h3>');
    } else if (h4Match) {
      flushList();
      blocks.push('<h4 style="font-size:28rpx;font-weight:600;margin:16rpx 0 8rpx;color:var(--color-text-primary);">' + inlineNodesToWxml(parseInline(h4Match[1])) + '</h4>');
    } else if (ulMatch) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      currentList.push(ulMatch[1]);
    } else if (olMatch) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      currentList.push(olMatch[1]);
    } else if (blockquoteMatch) {
      flushList();
      blocks.push('<blockquote style="border-left:6rpx solid var(--color-primary);padding:12rpx 20rpx;margin:12rpx 0;background:var(--color-primary-light);border-radius:8rpx;color:var(--color-text-secondary);">' + inlineNodesToWxml(parseInline(blockquoteMatch[1])) + '</blockquote>');
    } else if (hrMatch) {
      flushList();
      blocks.push('<hr style="border:none;border-top:1rpx solid var(--color-border);margin:20rpx 0;"/>');
    } else if (tableRowMatch) {
      flushList();
      blocks.push('<p style="margin:8rpx 0;line-height:1.8;color:var(--color-text-secondary);">' + inlineNodesToWxml(parseInline(trimmed)) + '</p>');
    } else {
      flushList();
      blocks.push('<p style="margin:8rpx 0;line-height:1.8;color:var(--color-text-secondary);">' + inlineNodesToWxml(parseInline(trimmed)) + '</p>');
    }
  });

  flushList();
  return blocks.join('');
}

module.exports = { parseMarkdown };
