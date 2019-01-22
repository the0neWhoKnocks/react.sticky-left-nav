import {css} from 'glamor';

export default {
  root: css({
    textAlign: 'center',
    padding: '1em',
    borderBottom: 'solid 1px #ccc',
    boxShadow: '0 0 1em 0.5em #00000020',
    background: '#eee',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,

    ' a': {
      color: '#333',
      textDecoration: 'none',
      textTransform: 'uppercase',
      padding: '1em',
      position: 'relative',

      ':hover::after': {
        content: `''`,
        width: '100%',
        height: '2px',
        background: '#333',
        position: 'absolute',
        bottom: 0,
        left: 0,
      },
    },
  }),
};
