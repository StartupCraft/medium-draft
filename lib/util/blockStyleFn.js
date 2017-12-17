'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

/*
Get custom classnames for each of the different block types supported.
*/

var BASE_BLOCK_CLASS = 'md-block';

exports.default = function (block) {
  switch (block.getType()) {
    case _constants.Block.UNSTYLED:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-paragraph';
    case _constants.Block.ATOMIC:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-atomic';
    case _constants.Block.ACTIVITY:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-activity';
    default:
      return BASE_BLOCK_CLASS;
  }
};