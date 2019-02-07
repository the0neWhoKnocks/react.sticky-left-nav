/*
  eslint-disable
    default-case,
    no-mixed-operators
*/

import React, {
  Children,
  Component,
  cloneElement,
  createRef,
  Fragment,
} from 'react';

// NOTE - All the logging logic is only for demo purposes and can be removed.
const dummyLogger = {
  log: () => {},
};
const debugLogger = {
  log: window.console.log,
};

const navPositions = {
  SCROLL: 'scroll',
  LOCK_TO_BOUNDS_TOP: 'lockToBoundsTop',
  LOCK_TO_BOUNDS_BOTTOM: 'lockToBoundsBottom',
  LOCK_TO_WRAPPER_BOTTOM: 'lockToWrapperBottom',
};

class LeftNavPosition extends Component {
  constructor(props) {
    super();

    this.state = {
      clearBtnStyles: undefined,
      navStyles: undefined,
      // NOTE - The below props are only for demo purposes and can be removed.
      debug: props.debug,
    };
    
    
    
    this.leftNavRef = createRef();
    this.leftNavWrapperRef = createRef();
    
    this.handleClearBtnToggle = this.handleClearBtnToggle.bind(this);
    this.handleFilterGroupToggle = this.handleFilterGroupToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  
  componentDidMount() {
    this.init();
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {
      boundsBottom,
      boundsTop,
      debug,
    } = this.props;
    
    if(debug !== prevProps.debug) this.setLogger(debug);
    
    if(
      boundsBottom !== this.navBounds.bottom
      || boundsTop !== this.navBounds.top
    ){
      this.navBounds = {
        bottom: boundsBottom,
        top: boundsTop,
      };
      this.calcBounds();
    }
  }
  
  setLogger(debug) {
    this.logger = (debug) ? debugLogger : dummyLogger;
  }
  
  init() {
    const {
      boundsBottom,
      boundsTop,
    } = this.props;
    
    this.leftNavW = this.leftNavRef.current.offsetWidth;
    this.navBounds = {
      bottom: boundsBottom,
      top: boundsTop,
    };
    this.pointEls = document.querySelectorAll('.left-nav-wrapper [data-point-type]');
    this.points = {};

    window.addEventListener('scroll', this.handleScroll, false);
    
    this.setLogger(this.state.debug);

    this.setState({
      navStyles: {
        // width has to be set because when the nav switches to a `fixed` width,
        // the `flex` styling shrinks
        width: `${this.leftNavW}px`,
      }
    }, () => {
      this.handleScroll();
    });
  }
  
  handleClearBtnToggle() {
    this.controlNavPosition({ heightChanged: true });
  }

  /**
   * During a filter group's toggle animation, verify the nav has the correct
   * sticking point. If this isn't checked at an interval during the animation,
   * the nav could pop from bottom to top or visa versa. This makes the
   * transition less jarring.
   */
  handleFilterGroupToggle() {
    const { toggleSpeed } = this.props;
    const interval = 10; // check every X milliseconds
    let total = 0;

    const checkPos = () => {
      if(total < toggleSpeed){
        this.controlNavPosition({ heightChanged: true });
        window.requestAnimationFrame(checkPos);
      }
      total += interval;
    };

    window.requestAnimationFrame(checkPos);
  }
  
  /**
   * Recalculate the bottom bounds to account for the bottom of the wrapper
   * scrolling into view.
   */
  calcBounds() {
    const btmPoint = document.querySelector('.left-nav-wrapper [data-point-type="wrapperBtm"]');
    const rectY = btmPoint.getBoundingClientRect().top;
  
    this.navBounds.bottom = (rectY < window.innerHeight)
      ? rectY
      : window.innerHeight;
  }
  
  handleScroll() {
    this.scrollDirection = (this.prevScroll > window.pageYOffset) ? 'up' : 'down';
    this.scrollAmount = Math.abs(window.pageYOffset - this.prevScroll);
    this.prevScroll = window.pageYOffset;

    this.calcBounds();
    
    for (let i=0; i<this.pointEls.length; i++) {
      const point = this.pointEls[i];
      const type = point.dataset.pointType;
      const rect = point.getBoundingClientRect();

      if(!this.points[type]) this.points[type] = {};

      this.points[type].visible = rect.top >= this.navBounds.top && rect.top <= this.navBounds.bottom;
      this.points[type].y = rect.top;
    }

    this.controlNavPosition();
  }
  
  setClearBtnPosition(pos){
    if(pos === this.clearBtnPos) return;

    const clearBtnStyles = {
      position: 'fixed',
    };

    switch(pos){
      case navPositions.LOCK_TO_BOUNDS_BOTTOM:
        clearBtnStyles.position = 'fixed';
        break;

      case navPositions.LOCK_TO_WRAPPER_BOTTOM:
        clearBtnStyles.position = 'absolute';
        break;
    }

    this.clearBtnPos = pos;

    this.logger.log(`Clear button position = ${pos}`);

    this.setState({ clearBtnStyles });
  }

  setNavPosition(pos) {
    // Ensure the setting of DOM props doesn't happen more often then it has to.
    if(pos === this.navPos) return;

    const navStyles = { ...this.state.navStyles };

    switch(pos){
      case navPositions.SCROLL:
        const offsetY = this.leftNavRef.current.getBoundingClientRect().top - this.leftNavWrapperRef.current.getBoundingClientRect().top;
        navStyles.position = 'absolute';
        navStyles.top = `${offsetY}px`;
        navStyles.bottom = null;
        break;

      case navPositions.LOCK_TO_BOUNDS_TOP:
        navStyles.position = 'fixed';
        navStyles.top = `${this.navBounds.top}px`;
        navStyles.bottom = null;
        break;

      case navPositions.LOCK_TO_BOUNDS_BOTTOM:
        navStyles.position = 'fixed';
        navStyles.top = null;
        navStyles.bottom = 0;
        break;

      case navPositions.LOCK_TO_WRAPPER_BOTTOM:
        navStyles.position = 'absolute';
        navStyles.top = null;
        navStyles.bottom = 0;
        break;

      default: // LOCK_TO_WRAPPER_TOP
        navStyles.position = null;
        navStyles.top = null;
        navStyles.bottom = null;
    }

    this.navPos = pos;

    this.logger.log(`Nav position = ${pos || '_unbound_'}`);

    this.setState({ navStyles });
  }

  controlNavPosition({
    heightChanged,
  } = {}) {
    const { sibling } = this.props;
    
    // Don't do anything if the nav is taller than it's sibling
    if(sibling.offsetHeight < this.leftNavRef.current.offsetHeight) {
      this.setNavPosition();
      return;
    }

    if(heightChanged) this.logger.log('heightChanged');
    
    if(this.points){
      const {
        navBtm,
        navTop,
        wrapperBtm,
        wrapperTop,
      } = this.points;
      const navFitsInView = this.leftNavRef.current.offsetHeight < this.navBounds.bottom - this.navBounds.top;
      let navWithinBounds;
      
      // HEIGHT CHANGE =========================================================
      if(heightChanged){
        if(
          !wrapperTop.visible
          && navFitsInView
        ){
          this.setNavPosition(navPositions.LOCK_TO_BOUNDS_TOP);
        }
        else if(
          wrapperBtm.visible
          && !navFitsInView
          || wrapperBtm.visible
          && navBtm.y > wrapperBtm.y
        ){
          this.setNavPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
        }
        else if(
          navBtm.visible
          && !wrapperTop.visible
          || !navWithinBounds
          && !wrapperBtm.visible
        ){
          this.setNavPosition(navPositions.LOCK_TO_BOUNDS_BOTTOM);
        }
      }
      // DOWN ==================================================================
      else if(this.scrollDirection === 'down'){
        navWithinBounds = (navBtm.y - this.scrollAmount) > this.navBounds.top;
        
        // [lock - to wrapper top]
        if(
          // IF - Wrapper top is in view, stick to wrapper top. This case usually
          //      occurs on initial page load only.
          wrapperTop.visible
        ){
          this.setNavPosition();
        }
        // [lock - to header bottom]
        else if(
          // IF - The top of the wrapper is hidden, and the nav can fit within
          //      the viewing area.
          !wrapperTop.visible
          && navFitsInView
        ) {
          this.setNavPosition(navPositions.LOCK_TO_BOUNDS_TOP);
        }
        // [lock - to wrapper bottom]
        else if(
          // IF - Wrapper bottom is in view, AND the nav doesn't fit within the
          //      viewing area, stick it to the bottom of the wrapper.
          wrapperBtm.visible
          && !navFitsInView
        ){
          this.setNavPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
        }
        // [lock - to viewport bottom]
        else if(
          // IF - Wrapper bottom is not in view, AND nav bottom is in view, stick
          //      to bottom stickPoint.
          navBtm.visible
          && !wrapperTop.visible
          // OR - In some cases if a user was scrolling slowly, then yanks the
          //      scrollbar (when the nav was in SCROLL), the nav will leave
          //      the bounding box.
          || !navWithinBounds
          && !wrapperBtm.visible
        ){
          this.setNavPosition(navPositions.LOCK_TO_BOUNDS_BOTTOM);
        }
        // [scroll - with page]
        else if(
          // IF - The wrapper is visible, just scroll.
          wrapperTop.visible
          // OR - The top of the nav is visible, but the top of the wrapper is
          //      not (the nav was locked to the top of the Results), so unlock
          //      it, and allow it to scroll with the page again.
          || navTop.visible
          && !wrapperTop.visible
          // OR - The nav was stuck to the top and needs to transition from the
          //      top to bottom point.
          || !navTop.visible
          && !navBtm.visible
          && !wrapperBtm.visible
        ){
          this.setNavPosition(navPositions.SCROLL);
        }

        if(!wrapperBtm.visible){
          this.setClearBtnPosition(navPositions.LOCK_TO_BOUNDS_BOTTOM);
        }else {
          this.setClearBtnPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
        }
      }
      // UP ====================================================================
      else if(this.scrollDirection === 'up') {
        navWithinBounds = (navTop.y + this.scrollAmount) < this.navBounds.bottom;
        
        // [lock - to wrapper top]
        if(
          // IF - Wrapper top is in view, stick to wrapper top.
          wrapperTop.visible
        ){
          this.setNavPosition();
        }
        // [lock - to viewport top]
        else if(
          // IF - Wrapper bottom is not in view, AND nav bottom is in view, stick
          //      to bottom stickPoint.
          navTop.visible
          // OR - In some cases if a user was scrolling slowly, then yanks the
          //      scrollbar (when the nav was in SCROLL), the nav will leave
          //      the bounding box.
          || !navWithinBounds
          && !wrapperTop.visible
        ) {
          this.setNavPosition(navPositions.LOCK_TO_BOUNDS_TOP);
        }
        // [scroll - with page]
        else if(
          // IF - The bottom of the nav is in view and the bottom of the wrapper
          //      is not (the nav is locked to the bottom of the viewport), so
          //      pin the nav to it's current position relative to it's parent
          //      to allow for normal scrolling.
          navBtm.visible
          && !wrapperBtm.visible
        ){
          this.setNavPosition(navPositions.SCROLL);
        }

        if(
          !wrapperBtm.visible
        ){
          this.setClearBtnPosition(navPositions.LOCK_TO_BOUNDS_BOTTOM);
        }
      }
    }
  }

  render() {
    const { children } = this.props;
    const {
      clearBtnStyles,
      navStyles,
    } = this.state;
    const positionProps = {
      clearBtnStyles,
      navStyles,
      onClearBtnToggle: this.handleClearBtnToggle,
      onFilterGroupToggle: this.handleFilterGroupToggle,
      ref: {
        navRef: this.leftNavRef,
        wrapperRef: this.leftNavWrapperRef,
      },
    };
    
    // TODO - Might be more efficient to do this on `mount` and in `getDerivedStateFromProps`
    const childrenWithProps = Children.map(children,
      (child) => cloneElement(child, positionProps)
    );

    return <Fragment>{childrenWithProps}</Fragment>
  }
}

export default LeftNavPosition;
