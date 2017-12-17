import AtomicBlock from './blocks/atomic';
import TodoBlock from './blocks/todo';
import ImageBlock from './blocks/image';
import BreakBlock from './blocks/break';

import GoalBlock from './blocks/Goal';

import { Block } from '../util/constants';

export default (setEditorState, getEditorState) => (contentBlock) => {
  // console.log(editorState, onChange);
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
    case Block.IMAGE: return {
      component: ImageBlock,
      props: {
        setEditorState,
        getEditorState,
      },
    };
    case Block.BREAK: return {
      component: BreakBlock,
      editable: false,
    };
    case Block.GOAL: return {
      component: GoalBlock,
      props: {
        setEditorState,
        getEditorState,
      },
    };
    default: return null;
  }
};
