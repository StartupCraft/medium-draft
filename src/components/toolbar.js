import PropTypes from 'prop-types';
// import './toolbar.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

import { getSelection, getSelectionRect } from '../util/index';
import { getCurrentBlock, isMultiBlockSelection } from '../model';
import { Inline, Entity, HYPERLINK } from '../util/constants';

export default class Toolbar extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    toggleBlockType: PropTypes.func,
    toggleInlineStyle: PropTypes.func,
    inlineButtons: PropTypes.arrayOf(PropTypes.object),
    blockButtons: PropTypes.arrayOf(PropTypes.object),
    editorNode: PropTypes.object,
    setLink: PropTypes.func,
    focus: PropTypes.func,
  };

  static defaultProps = {
    blockButtons: BLOCK_BUTTONS,
    inlineButtons: INLINE_BUTTONS,
  };

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      urlInputValue: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleLinkInput = this.handleLinkInput.bind(this);
    this.hideLinkInput = this.hideLinkInput.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (!newProps.editorEnabled) {
      return;
    }
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
      if (this.state.showURLInput) {
        this.setState({
          showURLInput: false,
          urlInputValue: '',
        });
      }
      return;
    }
  }

  // shouldComponentUpdate(newProps, newState) {
  //   console.log(newState, this.state);
  //   if (newState.showURLInput !== this.state.showURLInput && newState.urlInputValue !== this.state.urlInputValue) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate() {
    if (!this.props.editorEnabled || this.state.showURLInput) {
      return;
    }
    const { editorState } = this.props;
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
      return;
    }
    // eslint-disable-next-line no-undef
    const nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }
    const selectionBoundary = getSelectionRect(nativeSelection);

    // eslint-disable-next-line react/no-find-dom-node
    const toolbarNode = ReactDOM.findDOMNode(this);
    const toolbarBoundary = toolbarNode.getBoundingClientRect();

    // eslint-disable-next-line react/no-find-dom-node
    const parent = ReactDOM.findDOMNode(this.props.editorNode);
    const parentBoundary = parent.getBoundingClientRect();

    /*
    * Main logic for setting the toolbar position.
    */
    toolbarNode.style.top =
      `${((selectionBoundary.top - parentBoundary.top - toolbarBoundary.height) + 10)}px`;
    toolbarNode.style.width = `${toolbarBoundary.width}px`;
    const widthDiff = selectionBoundary.width - toolbarBoundary.width;

    const left = (selectionBoundary.left - parentBoundary.left);
    toolbarNode.style.left = `${left + 94 + (widthDiff / 2)}px`;
  }

  onKeyDown(e) {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue);
      this.hideLinkInput();
    } else if (e.which === 27) {
      this.hideLinkInput();
    }
  }

  onChange(e) {
    this.setState({
      urlInputValue: e.target.value,
    });
  }

  handleLinkInput(e, direct = false) {
    if (direct !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && editorState.getCurrentContent().getEntity(entityKey).getType() === Entity.LINK;
    }, (start, end) => {
      let selStart = selection.getAnchorOffset();
      let selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }
      if (start === selStart && end === selEnd) {
        linkFound = true;
        const { url } = editorState.getCurrentContent().getEntity(selectedEntity).getData();
        this.setState({
          showURLInput: true,
          urlInputValue: url,
        }, () => {
          setTimeout(() => {
            this.urlinput.focus();
            this.urlinput.select();
          }, 0);
        });
      }
    });
    if (!linkFound) {
      this.setState({
        showURLInput: true,
      }, () => {
        setTimeout(() => {
          this.urlinput.focus();
        }, 0);
      });
    }
  }

  hideLinkInput(e = null) {
    if (e !== null) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      showURLInput: false,
      urlInputValue: '',
    }, this.props.focus
    );
  }

  render() {
    const { editorState, editorEnabled, inlineButtons } = this.props;
    const { showURLInput, urlInputValue } = this.state;
    let isOpen = true;
    if (!editorEnabled || editorState.getSelection().isCollapsed() || isMultiBlockSelection(editorState)) {
      isOpen = false;
    }
    if (showURLInput) {
      let className = `guided-editor-toolbar${(isOpen ? ' guided-editor-toolbar--isopen' : '')}`;
      className += ' guided-editor-toolbar--linkinput';
      return (
        <div
          className={className}
        >
          <div
            className="guided-controls guided-show-link-input"
            style={{ display: 'block' }}
          >
            <span className="guided-url-input-close" onClick={this.hideLinkInput}>&times;</span>
            <input
              ref={node => { this.urlinput = node; }}
              type="text"
              className="guided-url-input"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              placeholder="Press ENTER or ESC"
              value={urlInputValue}
            />
          </div>
        </div>
      );
    }
    let hasHyperLink = false;
    let hyperlinkLabel = '#';
    let hyperlinkDescription = 'Add a link';
    for (let cnt = 0; cnt < inlineButtons.length; cnt++) {
      if (inlineButtons[cnt].style === HYPERLINK) {
        hasHyperLink = true;
        if (inlineButtons[cnt].label) {
          hyperlinkLabel = inlineButtons[cnt].label;
        }
        if (inlineButtons[cnt].description) {
          hyperlinkDescription = inlineButtons[cnt].description;
        }
        break;
      }
    }
    return (
      <div
        className={`guided-editor-toolbar${(isOpen ? ' guided-editor-toolbar--isopen' : '')}`}
      >
        {this.props.blockButtons.length > 0 ? (
          <BlockToolbar
            editorState={editorState}
            onToggle={this.props.toggleBlockType}
            buttons={this.props.blockButtons}
          />
        ) : null}
        {this.props.inlineButtons.length > 0 ? (
          <InlineToolbar
            editorState={editorState}
            onToggle={this.props.toggleInlineStyle}
            buttons={this.props.inlineButtons}
          />
        ) : null}
        {hasHyperLink && (
          <div className="guided-controls">
            <span
              className="guided-styleButton guided-linkButton hint--top"
              onClick={this.handleLinkInput}
              aria-label={hyperlinkDescription}
            >
              {hyperlinkLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export const BLOCK_BUTTONS = [
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: 'list-ul',
    description: 'Unordered List',
  },
];

export const INLINE_BUTTONS = [
  {
    label: 'B',
    style: Inline.BOLD,
    icon: 'bold',
    description: 'Bold',
  },
  {
    label: 'I',
    style: Inline.ITALIC,
    icon: 'italic',
    description: 'Italic',
  },
  {
    label: (
      <svg width="20" height="15" viewBox="0 0 14 14">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-468.000000, -254.000000)" stroke="#5c68e0">
            <g transform="translate(260.000000, 165.000000)">
              <g transform="translate(0.000000, 75.000000)">
                <g transform="translate(19.000000, 0.000000)">
                  <g transform="translate(196.424621, 21.424621) rotate(45.000000) translate(-196.424621, -21.424621) translate(193.424621, 13.924621)">
                    <path d="M0.5,5.69098301 L0.5,2 C0.5,1.82069363 0.550664909,1.51670417 0.697213595,1.2236068 C0.927818928,0.762396132 1.32141313,0.5 2,0.5 L4,0.5 C4.67858687,0.5 5.07218107,0.762396132 5.3027864,1.2236068 C5.44933509,1.51670417 5.5,1.82069363 5.5,2 L5.5,6 C5.5,6.67858687 5.23760387,7.07218107 4.7763932,7.3027864 C4.53586606,7.42304998 4.28800365,7.47874077 4.1077327,7.49484936 L0.5,5.69098301 Z" />
                    <path d="M0.5,12.690983 L0.5,9 C0.5,8.82069363 0.550664909,8.51670417 0.697213595,8.2236068 C0.927818928,7.76239613 1.32141313,7.5 2,7.5 L4,7.5 C4.67858687,7.5 5.07218107,7.76239613 5.3027864,8.2236068 C5.44933509,8.51670417 5.5,8.82069363 5.5,9 L5.5,13 C5.5,13.6785869 5.23760387,14.0721811 4.7763932,14.3027864 C4.53586606,14.42305 4.28800365,14.4787408 4.1077327,14.4948494 L0.5,12.690983 Z" transform="translate(3.000000, 11.000000) scale(-1, -1) translate(-3.000000, -11.000000) " />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ),
    style: HYPERLINK,
    icon: 'link',
    description: 'Add a link',
  },
  {
    label: (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 2.95L8.7 1l-.65.75 2.3 1.95.65-.75zM3.95 1.8l-.65-.75L1 2.95l.65.75 2.3-1.9zm2.3 2.3H5.5v3l2.35 1.45.4-.6-2-1.2V4.1zM6 2.1c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 8c-1.95 0-3.5-1.55-3.5-3.5S4.05 3.1 6 3.1s3.5 1.55 3.5 3.5-1.55 3.5-3.5 3.5z" />
      </svg>
    ),
    style: Inline.REMINDER,
    icon: 'reminder',
    description: 'Add a reminder',
  },
];

