import PropTypes from 'prop-types';
// import './atomic.scss';

import React from 'react';

const AtomicBlock = (props) => {
  const content = props.getEditorState().getCurrentContent();
  const entity = content.getEntity(props.block.getEntityAt(0));
  const type = entity.getType();
  return <p>No supported block for {type}</p>;
};

AtomicBlock.propTypes = {
  block: PropTypes.object,
  getEditorState: PropTypes.func,
};

export default AtomicBlock;
