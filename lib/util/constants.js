'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
Some of the constants which are used throughout this project instead of
directly using string.
*/

var Block = exports.Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  ATOMIC: 'atomic',
  ACTIVITY: 'atomic:activity'
};

var Inline = exports.Inline = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  REMINDER: 'REMINDER'
};

var Entity = exports.Entity = {
  LINK: 'LINK',
  REMINDER: 'REMINDER'
};

var HYPERLINK = exports.HYPERLINK = 'hyperlink';

var HANDLED = exports.HANDLED = 'handled';
var NOT_HANDLED = exports.NOT_HANDLED = 'not_handled';

var KEY_COMMANDS = exports.KEY_COMMANDS = {
  addNewBlock: function addNewBlock() {
    return 'add-new-block';
  },
  changeType: function changeType() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return 'changetype:' + type;
  },
  showLinkInput: function showLinkInput() {
    return 'showlinkinput';
  },
  unlink: function unlink() {
    return 'unlink';
  },
  toggleInline: function toggleInline() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return 'toggleinline:' + type;
  },
  deleteBlock: function deleteBlock() {
    return 'delete-block';
  }
};

exports.default = {
  Block: Block,
  Inline: Inline,
  Entity: Entity
};