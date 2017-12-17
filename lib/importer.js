'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setImportOptions = exports.options = exports.htmlToBlock = exports.htmlToEntity = exports.htmlToStyle = undefined;

var _draftConvert = require('draft-convert');

var _constants = require('./util/constants');

var htmlToStyle = exports.htmlToStyle = function htmlToStyle(nodeName, node, currentStyle) {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(_constants.Inline.ITALIC);
    case 'strong':
      return currentStyle.add(_constants.Inline.BOLD);
    case 'mark':
      return currentStyle.add(_constants.Inline.REMINDER);
    default:
      break;
  }

  return currentStyle;
};

var htmlToEntity = exports.htmlToEntity = function htmlToEntity(nodeName, node, createEntity) {
  if (nodeName === 'a') {
    return createEntity(_constants.Entity.LINK, 'MUTABLE', { url: node.href });
  }
  return undefined;
};

var htmlToBlock = exports.htmlToBlock = function htmlToBlock(nodeName, node) {
  if (nodeName === 'div') {
    if (node.className === 'md-block-' + _constants.Block.ATOMIC.toLowerCase()) {
      return {
        type: _constants.Block.ATOMIC,
        data: {}
      };
    }
    return undefined;
  } else if (nodeName === 'p') {
    return {
      type: _constants.Block.UNSTYLED,
      data: {}
    };
  }

  return undefined;
};

var options = exports.options = {
  htmlToStyle: htmlToStyle,
  htmlToEntity: htmlToEntity,
  htmlToBlock: htmlToBlock
};

var setImportOptions = exports.setImportOptions = function setImportOptions() {
  var htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options;
  return (0, _draftConvert.convertFromHTML)(htmlOptions);
};

exports.default = function (rawHTML) {
  var htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options;
  return (0, _draftConvert.convertFromHTML)(htmlOptions)(rawHTML);
};