'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Custom style map for custom entities like Hihglight.
*/
var customStyleMap = _defineProperty({}, _constants.Inline.REMINDER, {
  backgroundColor: 'yellow'
});

exports.default = customStyleMap;