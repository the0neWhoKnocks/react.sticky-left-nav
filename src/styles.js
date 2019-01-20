import {css} from 'glamor';

const diagonalLineThickness = 3;
export default {
  root: css({
    font: '16px Helvetica, Arial, sans-serif',
    position: 'relative',

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

    ' .left-nav-wrapper': {
      minWidth: '200px',
      padding: '0.3em 0 1em 1em',

      ' .left-nav': {
        background: '#fff',
      },
    },

    ' .results': {
      flex: 1,
      paddingLeft: '1em',
    },

    ' .footer': {
      marginTop: '2em',
    },

    '.debug': {
      ' .left-nav-wrapper': {
        backgroundColor: 'gray',
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          #ddd,
          #ddd ${diagonalLineThickness}px,
          #fff ${diagonalLineThickness}px,
          #fff ${diagonalLineThickness * 3}px
        )`,
      },
    },
  }),
};
