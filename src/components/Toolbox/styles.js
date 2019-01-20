import {css} from 'glamor';

export const DOCK_TO_RIGHT = 'docked--right';
const borderColor = '#666';
export default {
  root: css({
    minHeight: '50%',
    padding: '1em',
    border: `solid 1px ${borderColor}`,
    borderRight: 'none',
    borderRadius: '0.5em 0em 0em 0.5em',
    background: '#eee',
    position: 'fixed',
    transition: 'transform 200ms',

    ' label': {
      margin: '0.5em',
      userSelect: 'none',

      ' > .label-text': {
        flex: 1,
      },

      ' > input': {
        marginLeft: '0.5em',
      },
    },

    ' [type="number"]': {
      maxWidth: '4em',
      textAlign: 'center',
    },

    ' .toolbox': {

      '&__toggle-btn': {
        padding: 0,
        overflow: 'hidden',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        position: 'absolute',
        outline: 'none',

        '::before': {
          content: `''`,
          width: '4em',
          height: '4em',
          border: `solid 1px ${borderColor}`,
          borderRadius: '100%',
          background: '#eee',
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: -1,
        },
      },
    },

    [`.${DOCK_TO_RIGHT}`]: {
      top: '50%',
      right: 0,
      transform: 'translate(100%, -50%)',

      ' .toolbox': {

        '&__toggle-btn': {
          width: '2.4em',
          height: '5em',
          top: '50%',
          right: '100%',
          transform: 'translateY(-50%)',

          '::before': {
            transform: 'translate(-30%, -50%)',
          },
        },

        '&__tools > *': {
          display: 'flex',
        },
      },

      '.is--open': {
        transform: 'translate(0%, -50%)',
      },
    }
  }),
};
