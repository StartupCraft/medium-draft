import AtomicBlock from './blocks/atomic';

import { Block } from '../util/constants';

export default (setEditorState, getEditorState) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.ATOMIC: return {
      component: AtomicBlock,
      editable: false,
      props: {
        getEditorState,
      },
    };
    default: return null;
  }
};
