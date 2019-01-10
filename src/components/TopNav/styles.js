import {css} from 'glamor';

export default {
  root: css({
    textAlign: 'center',
    padding: '1em',
    border: 'solid 1px #ccc',
    background: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,

    ' a': {
      color: '#333',
      fontWeight: 'bold',
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
