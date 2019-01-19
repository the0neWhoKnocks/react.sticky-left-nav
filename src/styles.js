import {css} from 'glamor';

export default {
  root: css({
    font: '16px Helvetica, Arial, sans-serif',

    ' .body': {
      paddingTop: '3.3em',
      position: 'relative',
    },

    ' .title-font': {
      fontFamily: 'impact',
      color: '#444',
      letterSpacing: '1px',
    },

    ' .results-interface': {
      display: 'flex',
    },

    ' .results-header': {

      '&__title': {
        transform: 'scale(1)',
        transformOrigin: 'left center',
        transition: 'transform 200ms',
      },

      '.is--sticky': {
        position: 'fixed',
        left: 0,
        right: 0,

        ' .results-header__title': {
          transform: 'scale(0.75)',
        }
      },
    },

    ' .left-nav': {
      minWidth: '200px',
      padding: '0.3em 0 1em 1em',
    },

    ' .results': {
      paddingLeft: '1em',
    },

    ' .footer': {
      marginTop: '2em',
    }
  }),
};
