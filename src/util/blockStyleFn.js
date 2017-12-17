import { Block } from './constants';

/*
Get custom classnames for each of the different block types supported.
*/

const BASE_BLOCK_CLASS = 'md-block';

export default (block) => {
  switch (block.getType()) {
    case Block.UNSTYLED:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;
    case Block.ATOMIC:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`;
    case Block.ACTIVITY:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-activity`;
    default: return BASE_BLOCK_CLASS;
  }
};
