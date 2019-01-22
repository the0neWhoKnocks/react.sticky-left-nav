import {css} from 'glamor';

const CROSSHAIR_COLOR = '#000';
const CROSSHAIR_POINT_RADIUS = 20;
const CROSSHAIR_RADIUS = Math.round(CROSSHAIR_POINT_RADIUS/2) + 3;
let crosshair = [];

for(let i=0; i<4; i++){
  for(let j=0; j<CROSSHAIR_RADIUS; j++){
    if(i === 0) crosshair.push(`0px -${j+1}px 0px 0px ${CROSSHAIR_COLOR}`);
    else if(i === 1) crosshair.push(`${j+1}px 0px 0px 0px ${CROSSHAIR_COLOR}`);
    else if(i === 2) crosshair.push(`0px ${j+1}px 0px 0px ${CROSSHAIR_COLOR}`);
    else if(i === 3) crosshair.push(`-${j+1}px 0px 0px 0px ${CROSSHAIR_COLOR}`);
  }
}
crosshair = crosshair.join(',');

const diagonalLineThickness = 3;
const LAYER1_INDEX = 9;
const LAYER2_INDEX = 10;
export default {
  app: css({
    font: '16px Helvetica, Arial, sans-serif',
    position: 'relative',
    
    ' .top-nav': {
      zIndex: LAYER2_INDEX,
    },
    
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
      position: 'sticky',
      left: 0,
      zIndex: LAYER1_INDEX,

      '&__title': {
        transform: 'scale(1)',
        transformOrigin: 'left center',
        transition: 'transform 200ms',
      },

      '.is--sticky': {

        ' .results-header__title': {
          transform: 'scale(0.75)',
        }
      },
    },

    ' .left-nav-wrapper': {
      minWidth: '200px',
      padding: '0.3em 0 1em 1em',
    },

    ' .left-nav': {
      background: '#fff',

      '&__wrapper-top-point,&__top-point,&__wrapper-btm-point,&__btm-point': {
        position: 'absolute',
        left: '50%',
        transform: 'translateY(-50%)',
      },

      '&__wrapper-top-point,&__top-point': {
        top: 0,
      },

      '&__wrapper-btm-point,&__btm-point': {
        bottom: 0,
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

      ' .left-nav': {

        '&__wrapper-top-point,&__top-point,&__wrapper-btm-point,&__btm-point': {
          background: CROSSHAIR_COLOR,
          boxShadow: crosshair,

          '::after': {
            content: `''`,
            width: `${CROSSHAIR_POINT_RADIUS}px`,
            height: `${CROSSHAIR_POINT_RADIUS}px`,
            border: 'solid 1px',
            borderRadius: '100%',
            display: 'block',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
          },
        },

        '&__wrapper-top-point,&__wrapper-btm-point': {
          '::after': {
            background: '#00ff0020',
          },
        },

        '&__top-point,&__btm-point': {
          '::after': {
            background: '#ff000020',
          },
        },
      },
    },
  }),
  
  toolbox: css({
    zIndex: LAYER2_INDEX,
  }),
};
