import renderMap from './rendermap';
import { Block } from './constants';

describe('rendermap', () => {
  it('returns div for TODO', () => {
    expect(renderMap.get(Block.TODO)).to.deep.equal({
      element: 'div',
    });
  });

  it('returns div for ACTIVITY', () => {
    expect(renderMap.get(Block.ACTIVITY)).to.deep.equal({
      element: 'div',
    });
  });
});
