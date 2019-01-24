import {css} from 'glamor';

const link = {
  color: '#333',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  padding: '0 0 0.4em',
  display: 'block',
};
const filterFocusIndicatorWidth = 4;
const filterFocusIndicatorOffset = 8;
export default {
  root: css({
    position: 'relative',

    ' .left-nav': {
      paddingBottom: '3em',
      paddingLeft: `${filterFocusIndicatorWidth + filterFocusIndicatorOffset}px`,
      marginLeft: `-${filterFocusIndicatorWidth + filterFocusIndicatorOffset}px`,
      position: 'relative',

      '&__category-link': {
        ...link,
      },

      '&__filter-group': {
        borderBottom: 'solid 1px #666',
        margin: '0.75em 0',
      },

      '&__filter-group-btn': {
        padding: '0.5em 0',
        display: 'block',
        cursor: 'pointer',
        outline: 'none',
        position: 'relative',
        userSelect: 'none',

        '::after': {
          content: '\\002B',
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
        },

        ':focus::before': {
          content: `''`,
          width: `${filterFocusIndicatorWidth}px`,
          background: '#333',
          position: 'absolute',
          top: '25%',
          bottom: '25%',
          left: `-${filterFocusIndicatorOffset}px`,
        },

        '.is--open::after': {
          content: '\\2212',
        },
      },

      '&__filter-group-content': {
        padding: '0.5em 0',
      },

      '&__filter-link': {
        ...link,

        '::before': {
          content: `''`,
          width: '1em',
          height: '1em',
          border: 'solid 1px',
          marginRight: '0.5em',
          display: 'inline-block',
          verticalAlign: 'top',
        },

        '.is--selected::before': {
          background: '#333',
        },
      },

      '&__clear-btn': {
        width: 'calc(100% - 1em)',
        color: '#eee',
        padding: '0.5em 1em',
        border: 'none',
        background: '#333',
        cursor: 'pointer',
        position: 'absolute',
        top: '100%',
        left: '1em',
        transform: 'translateY(0%)',
        transition: 'transform 200ms',
      },

      '.show--clear': {

        ' .left-nav': {
          '&__clear-btn': {
            transform: 'translateY(-134%)',
          },
        },
      },
    }
  }),
};
