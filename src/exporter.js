import React from 'react';
import { convertToHTML } from 'draft-convert';

import { Inline, Block, Entity } from './util/constants';

export const styleToHTML = (style) => {
  switch (style) {
    case Inline.ITALIC:
      return <em className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.BOLD:
      return <strong className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.STRIKETHROUGH:
      return <strike className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.UNDERLINE:
      return <u className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.HIGHLIGHT:
      return <span className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.CODE:
      return <code className={`md-inline-${style.toLowerCase()}`} />;
    default:
      return null;
  }
};

export const blockToHTML = (block) => {
  const blockType = block.type;
  switch (blockType) {
    case Block.ATOMIC:
      return {
        start: `<figure className="md-block-${blockType.toLowerCase()}">`,
        end: '</figure>',
      };
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = '';
      let containerClass = '';
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
        containerClass = 'md-block-todo-checked';
      } else {
        inp = '<input type=checkbox disabled />';
        containerClass = 'md-block-todo-unchecked';
      }
      return {
        start: `<div class="md-block-${blockType.toLowerCase()} ${containerClass}">${inp}<p>`,
        end: '</p></div>',
      };
    }
    case Block.BREAK:
      return <hr className={`md-block-${blockType.toLowerCase()}`} />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol className={`md-block-${blockType.toLowerCase()}`} />,
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul className={`md-block-${blockType.toLowerCase()}`} />,
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return <p className={`md-block-${blockType.toLowerCase()}`}><br /></p>;
      }
      return <p className={`md-block-${blockType.toLowerCase()}`} />;
    default: return null;
  }
};


export const entityToHTML = (entity, originalText) => {
  if (entity.type === Entity.LINK) {
    return (
      <a
        className="md-inline-link"
        href={entity.data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export const setRenderOptions = (htmlOptions = options) => convertToHTML(htmlOptions);


export default (contentState, htmlOptions = options) => convertToHTML(htmlOptions)(contentState);
