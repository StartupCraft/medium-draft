/*
Some of the constants which are used throughout this project instead of
directly using string.
*/

export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  ATOMIC: 'atomic',
  ACTIVITY: 'activity',
  OPINION: 'opinion',
};

export const Inline = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  REMINDER: 'REMINDER',
};

export const Entity = {
  LINK: 'LINK',
  REMINDER: 'REMINDER',
};

export const HYPERLINK = 'hyperlink';

export const HANDLED = 'handled';
export const NOT_HANDLED = 'not_handled';

export const KEY_COMMANDS = {
  addNewBlock: () => 'add-new-block',
  changeType: (type = '') => `changetype:${type}`,
  showLinkInput: () => 'showlinkinput',
  unlink: () => 'unlink',
  toggleInline: (type = '') => `toggleinline:${type}`,
  deleteBlock: () => 'delete-block',
};

export default {
  Block,
  Inline,
  Entity,
};
