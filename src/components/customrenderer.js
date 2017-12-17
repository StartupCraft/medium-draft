import AtomicBlock from './blocks/atomic';
import TodoBlock from './blocks/todo';
import BreakBlock from './blocks/break';

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
    case Block.TODO: return {
      component: TodoBlock,
      props: {
        setEditorState,
        getEditorState,
      },
    };
    case Block.BREAK: return {
      component: BreakBlock,
      editable: false,
    };
    default: return null;
  }
};
