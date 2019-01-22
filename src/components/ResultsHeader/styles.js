import {css} from 'glamor';

const fontSize = '1.5em';
export default {
  root: css({
    padding: '1em',
    display: 'flex',
    background: '#fff',

    ' .results-header': {

      '&__title': {
        fontSize,
        lineHeight: fontSize,
        flex: 1,
      },

      '&__nav': {
        lineHeight: fontSize,
      },

      '&__sort': {
        marginTop: '0.6em',
      },
    },
  }),
};
