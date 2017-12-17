import React from 'react';
import { convertToHTML } from 'draft-convert';

import { Inline, Block, Entity } from './util/constants';

export const styleToHTML = (style) => {
  switch (style) {
    case Inline.ITALIC:
      return <em className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.BOLD:
      return <strong className={`md-inline-${style.toLowerCase()}`} />;
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
