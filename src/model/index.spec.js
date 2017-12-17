import { Map } from 'immutable';
import { EditorState, SelectionState } from 'draft-js';
import createEditorState from './content';
import {
  getDefaultBlockData,
  getCurrentBlock,
  resetBlockWithType,
  updateDataOfBlock,
  addNewBlockAt,
} from './';
import { Block } from '../util/constants';

describe('model/index', () => {
  describe('getDefaultBlockData()', () => {
    it('returns passed data for any other block', () => {
      expect(getDefaultBlockData(Block.ACTIVITY, {
        kind: 'memo',
      })).to.deep.equal({
        kind: 'memo',
      });
    });
  });

  const block1 = {
    key: '2vr7c',
    text: 'medium-draft',
    type: 'atomic:activity',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  };
  const block2 = {
    key: 'fksil',
    text: 'This page is fully editable.',
    type: 'atomic:activity',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  };
  const es = createEditorState({
    entityMap: {},
    blocks: [block1, block2],
  });

  describe('getCurrentBlock()', () => {
    it('always returns currently focused/selected block', () => {
      expect(getCurrentBlock(es).getKey()).to.equal(block1.key);

      const selection = SelectionState.createEmpty(block2.key);
      const es2 = EditorState.acceptSelection(es, selection);
      expect(getCurrentBlock(es2).getKey()).to.equal(block2.key);
    });
  });

  describe('resetBlockWithType()', () => {
    it('change selected block type to provided type', () => {
      const es3 = resetBlockWithType(es, Block.UNSTYLED, { text: 'hola' });
      let currentBlock = getCurrentBlock(es3);
      expect(currentBlock.getType()).to.equal(Block.UNSTYLED);
      expect(currentBlock.getText()).to.equal('hola');
      const es4 = resetBlockWithType(es, Block.ACTIVITY);
      currentBlock = getCurrentBlock(es4);
      expect(currentBlock.getType()).to.equal(Block.ACTIVITY);
      expect(currentBlock.getData().toJS()).to.deep.equal({});
      expect(currentBlock.getText()).to.equal(block1.text);
      expect(es4.getLastChangeType()).to.equal('change-block-type');
    });
  });

  describe('updateDataOfBlock()', () => {
    it('should update data of provided block', () => {
      const es3 = resetBlockWithType(es, Block.ACTIVITY);
      const es4 = updateDataOfBlock(es3, getCurrentBlock(es), Map({
        kind: 'memo',
      }));
      expect(getCurrentBlock(es4).getData().toJS()).to.deep.equal({
        kind: 'memo',
      });
      expect(es4.getLastChangeType()).to.equal('change-block-data');
    });
  });

  describe('addNewBlockAt()', () => {
    it('should add new block after pivot block', () => {
      const es3 = addNewBlockAt(es, block1.key);
      expect(es3.getCurrentContent().getBlockMap().count()).to.equal(3);
      let currentBlock = getCurrentBlock(es3);
      expect(currentBlock.toJS()).to.deep.equal(
        es3.getCurrentContent().getBlockMap().get(currentBlock.getKey()).toJS());
      expect(currentBlock.getData().toJS()).to.deep.equal({});

      const es4 = addNewBlockAt(es3, currentBlock.getKey(), Block.ACTIVITY, {
        kind: 'memo',
      });
      currentBlock = getCurrentBlock(es4);
      expect(es4.getCurrentContent().getBlockMap().count()).to.equal(4);

      expect(() => addNewBlockAt(es, 'random-key')).to.throw(Error);
    });
  });
});
