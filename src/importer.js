import { convertFromHTML } from 'draft-convert';
import { Inline, Block, Entity as EntityType } from './util/constants';

export const htmlToStyle = (nodeName, node, currentStyle) => {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(Inline.ITALIC);
    case 'strong':
      return currentStyle.add(Inline.BOLD);
    case 'mark':
      return currentStyle.add(Inline.REMINDER);
    default:
      break;
  }

  return currentStyle;
};

export const htmlToEntity = (nodeName, node, createEntity) => {
  if (nodeName === 'a') {
    return createEntity(EntityType.LINK, 'MUTABLE', { url: node.href });
  }
  return undefined;
};

export const htmlToBlock = (nodeName, node) => {
  if (nodeName === 'figure') {
    if (node.className === `md-block-${Block.ATOMIC.toLowerCase()}`) {
      return {
        type: Block.ATOMIC,
        data: {},
      };
    }
    return undefined;
  } else if (nodeName === 'div' && node.className && node.className.match(/^md-block-todo/)) {
    const inputNode = node.querySelector('input');
    return {
      type: Block.TODO,
      data: {
        checked: inputNode && inputNode.checked,
      },
    };
  } else if (nodeName === 'hr') {
    return {
      type: Block.BREAK,
      data: {},
    };
  } else if (nodeName === 'p') {
    return {
      type: Block.UNSTYLED,
      data: {},
    };
  }

  return undefined;
};

export const options = {
  htmlToStyle,
  htmlToEntity,
  htmlToBlock,
};

export const setImportOptions = (htmlOptions = options) => convertFromHTML(htmlOptions);

export default (rawHTML, htmlOptions = options) => convertFromHTML(htmlOptions)(rawHTML);
