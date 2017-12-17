import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

import { Block } from './constants';

/*
Mapping that returns containers for the various block types.
*/
const RenderMap = Map({
  [Block.ACTIVITY]: {
    element: 'div',
  },
}).merge(DefaultDraftBlockRenderMap);


export default RenderMap;
