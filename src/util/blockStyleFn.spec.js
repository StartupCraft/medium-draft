import { ContentBlock } from 'draft-js';
import blockStyleFn from './blockStyleFn';
import { Block } from './constants';

const BASE_BLOCK_CLASS = 'md-block';

describe('blockStyleFn()', () => {
  it('should return block class for UNKNOWN', () => {
    const normalBlock = new ContentBlock({
      type: 'some-unknown-type',
    });
    expect(blockStyleFn(normalBlock)).to.equal(BASE_BLOCK_CLASS);
  });

  it('should return block class for UNSTYLED', () => {
    const normalBlock = new ContentBlock({
      type: Block.UNSTYLED,
    });
    expect(blockStyleFn(normalBlock)).to.equal(`${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`);
  });

  it('should return block class for ATOMIC', () => {
    const normalBlock = new ContentBlock({
      type: Block.ATOMIC,
    });
    expect(blockStyleFn(normalBlock)).to.equal(
      `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`);
  });

  it('should return block class for ACTIVITY', () => {
    const normalBlock = new ContentBlock({
      type: Block.ACTIVITY,
    });
    expect(blockStyleFn(normalBlock)).to.equal(
      `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-activity`);
  });
});
