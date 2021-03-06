'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCursorBetweenLink = exports.addNewBlockAt = exports.updateDataOfBlock = exports.resetBlockWithType = exports.addNewBlock = exports.getCurrentBlock = exports.isMultiBlockSelection = exports.deleteBlockByKey = exports.updateBlock = exports.getDefaultBlockData = undefined;

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _constants = require('../util/constants');

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
var getDefaultBlockData = exports.getDefaultBlockData = function getDefaultBlockData(blockType) {
  var initialData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (blockType) {
    /* case Block.ACTIVITY: return Object.assign({}, {
      kind: 'memo',
    }, initialData); */
    default:
      return initialData;
  }
};

/*
Update block in state by own key and returns state
 */
var updateBlock = exports.updateBlock = function updateBlock(editorState, block) {
  var content = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  var newContentState = content.merge({
    blockMap: content.getBlockMap().set(block.getKey(), block),
    selectionAfter: selectionState
  });

  return _draftJs.EditorState.push(editorState, newContentState, 'insert-fragment');
};

/*
Delete block by key and returns state
 */
var deleteBlockByKey = exports.deleteBlockByKey = function deleteBlockByKey(editorState, key) {
  var content = editorState.getCurrentContent();

  var newContentState = content.merge({
    blockMap: content.getBlockMap().delete(key)
  });

  return _draftJs.EditorState.push(editorState, newContentState, 'remove-range');
};

/*
Returns true if multiple blocks selected
 */
var isMultiBlockSelection = exports.isMultiBlockSelection = function isMultiBlockSelection(editorState) {
  var selection = editorState.getSelection();
  return selection.getAnchorKey() !== selection.getFocusKey();
};

/*
Get currentBlock in the editorState.
*/
var getCurrentBlock = exports.getCurrentBlock = function getCurrentBlock(editorState) {
  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  return contentState.getBlockForKey(selectionState.getStartKey());
};

/*
Adds a new block (currently replaces an empty block) at the current cursor position
of the given `newType`.
*/
var addNewBlock = exports.addNewBlock = function addNewBlock(editorState) {
  var newType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.Block.UNSTYLED;
  var initialData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }
  var contentState = editorState.getCurrentContent();
  var key = selectionState.getStartKey();
  var blockMap = contentState.getBlockMap();
  var currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }
  if (currentBlock.getLength() === 0) {
    if (currentBlock.getType() === newType) {
      return editorState;
    }
    var newBlock = currentBlock.merge({
      type: newType,
      data: getDefaultBlockData(newType, initialData)
    });
    var newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState
    });
    return _draftJs.EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
};

/*
Changes the block type of the current block.
*/
var resetBlockWithType = exports.resetBlockWithType = function resetBlockWithType(editorState) {
  var newType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.Block.UNSTYLED;
  var overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var key = selectionState.getStartKey();
  var blockMap = contentState.getBlockMap();
  var block = blockMap.get(key);
  var newBlock = block.mergeDeep(overrides, {
    type: newType,
    data: getDefaultBlockData(newType)
  });
  var newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0
    })
  });
  return _draftJs.EditorState.push(editorState, newContentState, 'change-block-type');
};

/*
Update block-level metadata of the given `block` to the `newData`/
*/
var updateDataOfBlock = exports.updateDataOfBlock = function updateDataOfBlock(editorState, block, newData) {
  var contentState = editorState.getCurrentContent();
  var newBlock = block.merge({
    data: newData
  });
  var newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock)
  });
  return _draftJs.EditorState.push(editorState, newContentState, 'change-block-data');
};

// const BEFORE = -1;
// const AFTER = 1;

/*
Used from [react-rte](https://github.com/sstur/react-rte/blob/master/src/lib/insertBlockAfter.js)
by [sstur](https://github.com/sstur)
*/
var addNewBlockAt = exports.addNewBlockAt = function addNewBlockAt(editorState, pivotBlockKey) {
  var isBefore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var newBlockType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constants.Block.UNSTYLED;
  var initialData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var newKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  var content = editorState.getCurrentContent();
  var blockMap = content.getBlockMap();
  var block = blockMap.get(pivotBlockKey);
  if (!block) {
    throw new Error('The pivot key - ' + pivotBlockKey + ' is not present in blockMap.');
  }
  var blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === block;
  });
  var blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === block;
  }).rest();
  var newBlockKey = newKey || (0, _draftJs.genKey)();

  var newBlock = new _draftJs.ContentBlock({
    key: newBlockKey,
    type: newBlockType,
    text: '',
    characterList: (0, _immutable.List)(),
    depth: 0,
    data: (0, _immutable.Map)(getDefaultBlockData(newBlockType, initialData))
  });

  var newBlocks = isBefore ? [[newBlockKey, newBlock], [pivotBlockKey, block]] : [[pivotBlockKey, block], [newBlockKey, newBlock]];

  var newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap();

  var selection = editorState.getSelection();

  var newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false
    })
  });
  return _draftJs.EditorState.push(editorState, newContent, 'split-block');
};

/**
 * Check whether the cursor is between entity of type LINK
 */
var isCursorBetweenLink = exports.isCursorBetweenLink = function isCursorBetweenLink(editorState) {
  var ret = null;
  var selection = editorState.getSelection();
  var content = editorState.getCurrentContent();
  var currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return ret;
  }
  var entityKey = null;
  var blockKey = null;
  if (currentBlock.getType() !== _constants.Block.ATOMIC && selection.isCollapsed()) {
    if (currentBlock.getLength() > 0) {
      if (selection.getAnchorOffset() > 0) {
        entityKey = currentBlock.getEntityAt(selection.getAnchorOffset() - 1);
        blockKey = currentBlock.getKey();
        if (entityKey !== null) {
          var entity = content.getEntity(entityKey);
          if (entity.getType() === _constants.Entity.LINK) {
            ret = {
              entityKey: entityKey,
              blockKey: blockKey,
              url: entity.getData().url
            };
          }
        }
      }
    }
  }
  return ret;
};