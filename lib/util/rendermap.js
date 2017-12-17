'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Mapping that returns containers for the various block types.
*/
var RenderMap = (0, _immutable.Map)(_defineProperty({}, _constants.Block.ACTIVITY, {
  element: 'div'
})).merge(_draftJs.DefaultDraftBlockRenderMap);

exports.default = RenderMap;