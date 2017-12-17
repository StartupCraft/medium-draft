'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _atomic = require('./blocks/atomic');

var _atomic2 = _interopRequireDefault(_atomic);

var _constants = require('../util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (setEditorState, getEditorState) {
  return function (contentBlock) {
    var type = contentBlock.getType();
    switch (type) {
      case _constants.Block.ATOMIC:
        return {
          component: _atomic2.default,
          editable: false,
          props: {
            getEditorState: getEditorState
          }
        };
      default:
        return null;
    }
  };
};