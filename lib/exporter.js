'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRenderOptions = exports.options = exports.entityToHTML = exports.blockToHTML = exports.styleToHTML = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftConvert = require('draft-convert');

var _constants = require('./util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleToHTML = exports.styleToHTML = function styleToHTML(style) {
  switch (style) {
    case _constants.Inline.ITALIC:
      return _react2.default.createElement('i', null);
    case _constants.Inline.BOLD:
      return _react2.default.createElement('strong', null);
    case _constants.Inline.REMINDER:
      return _react2.default.createElement('mark', null);
    default:
      return null;
  }
};

var blockToHTML = exports.blockToHTML = function blockToHTML(block) {
  var blockType = block.type;
  switch (blockType) {
    case _constants.Block.ATOMIC:
      return {
        start: '<figure className="guided-block-' + blockType.toLowerCase() + '">',
        end: '</figure>'
      };
    case _constants.Block.UL:
      return {
        element: _react2.default.createElement('li', null),
        nest: _react2.default.createElement('ul', { className: 'guided-block-' + blockType.toLowerCase() })
      };
    case _constants.Block.UNSTYLED:
      if (block.text.length < 1) {
        return _react2.default.createElement(
          'p',
          { className: 'guided-block-' + blockType.toLowerCase() },
          _react2.default.createElement('br', null)
        );
      }
      return _react2.default.createElement('p', { className: 'guided-block-' + blockType.toLowerCase() });
    default:
      return null;
  }
};

var entityToHTML = exports.entityToHTML = function entityToHTML(entity, originalText) {
  if (entity.type === _constants.Entity.LINK) {
    return _react2.default.createElement(
      'a',
      {
        className: 'guided-inline-link',
        href: entity.data.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      },
      originalText
    );
  }
  return originalText;
};

var options = exports.options = {
  styleToHTML: styleToHTML,
  blockToHTML: blockToHTML,
  entityToHTML: entityToHTML
};

var setRenderOptions = exports.setRenderOptions = function setRenderOptions() {
  var htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options;
  return (0, _draftConvert.convertToHTML)(htmlOptions);
};

exports.default = function (contentState) {
  var htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options;
  return (0, _draftConvert.convertToHTML)(htmlOptions)(contentState);
};