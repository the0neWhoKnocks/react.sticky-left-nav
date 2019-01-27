/*
  eslint-disable
    default-case,
    no-mixed-operators
*/

import React, {
  createRef,
  Component,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './styles';
import Banner from './components/Banner';
import Footer from './components/Footer';
import LeftNav from './components/LeftNav';
import Results from './components/Results';
import ResultsHeader from './components/ResultsHeader';
import Toolbox, { DOCK_TO_RIGHT, Tools } from './components/Toolbox';
import TopNav from './components/TopNav';
import {
  categories as genCategories,
  filters as genFilters,
} from './data/leftNav';
import genProducts from './data/products';
import topNavData from './data/topNav';

const CATEGORY_COUNT = 10;
const FILTER_COUNT = 3;
const FILTER_CHILD_COUNT = 5;
const PRODUCT_COUNT = 24;

const navPositions = {
  SCROLL: 'scroll',
  LOCK_TO_HEADER_BOTTOM: 'lockToHeaderBottom',
  LOCK_TO_VIEWPORT_BOTTOM: 'lockToViewportBottom',
  LOCK_TO_WRAPPER_BOTTOM: 'lockToWrapperBottom',
};

const dummyLogger = {
  log: () => {},
};
const debugLogger = {
  log: window.console.log,
};
let logger = dummyLogger;

const stickySupported = () => {
  const el = document.createElement('a');
  const mStyle = el.style;
  mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
  return mStyle.position.indexOf('sticky') !== -1;
};

class App extends Component {
  static parseQueryParams(params) {
    const ret = {};

    params.replace(/^\?/, '').split('&').forEach((param) => {
      const data = param.split('=');
      ret[data[0]] = data[1];
    });

    return ret;
  }

  static updateQuery({ _default, name, value }) {
    return () => {
      const rawParams = window.location.search;
      const updatedParams = [];

      // If there current params, determine if they need to be updated or removed
      if(rawParams){
        const params = App.parseQueryParams(rawParams);

        if(
          // doesn't exist, add it
          !params[name]
          // exists, and value doesn't equal default
          || value !== _default
        ){
          params[name] = value;
        }
        // exists, but it's the default, so kill it
        else if(params[name]){
          delete params[name];
        }

        Object.keys(params).forEach((name) => {
          updatedParams.push(`${name}=${params[name]}`);
        });
      }
      // If there are no params, just add
      else {
        updatedParams.push(`${name}=${value}`);
      }

      const paramsString = (updatedParams.length)
        ? `?${updatedParams.join('&')}`
        : '';
      window.history.replaceState({}, '', `${window.location.pathname}${paramsString}`);
    };
  }

  static getStateFromQueryString(state) {
    const _state = { ...state };
    const params = App.parseQueryParams(window.location.search);

    Object.keys(params).forEach((name) => {
      if(_state[name] !== undefined) {
        // ensure params are typecast back to their original types
        const prevVal = _state[name];
        let newVal = params[name];

        switch(typeof prevVal){
          case 'boolean':
            newVal = Boolean(newVal);
            break;
          case 'number':
            newVal = +newVal;
            break;
        }

        _state[name] = newVal;
      }
    });

    return _state;
  }

  static generateData(state) {
    const _state = { ...state };

    if(_state.categoryCount) _state.categories = genCategories(_state.categoryCount);
    if(_state.filterCount && _state.filterChildCount) _state.filters = genFilters(
      _state.filterCount,
      _state.filterChildCount,
    );
    if(_state.productCount) _state.products = genProducts(_state.productCount);

    return _state;
  }

  constructor() {
    super();

    this.state = App.generateData({
      categoryCount: CATEGORY_COUNT,
      clearBtnStyles: undefined,
      debug: false,
      filterCount: FILTER_COUNT,
      filterChildCount: FILTER_CHILD_COUNT,
      navStyles: undefined,
      productCount: PRODUCT_COUNT,
      shelfOpened: false,
    });

    this.topNavRef = createRef();
    this.headerRef = createRef();
    this.leftNavRef = createRef();
    this.leftNavWrapperRef = createRef();
    this.resultsRef = createRef();

    this.controlHeaderPosition = this.controlHeaderPosition.bind(this);
    this.handleCategoryCountChange = this.handleCategoryCountChange.bind(this);
    this.handleDebugToggle = this.handleDebugToggle.bind(this);
    this.handleFilterChildCountChange = this.handleFilterChildCountChange.bind(this);
    this.handleClearBtnToggle = this.handleClearBtnToggle.bind(this);
    this.handleFilterCountChange = this.handleFilterCountChange.bind(this);
    this.handleFilterGroupToggle = this.handleFilterGroupToggle.bind(this);
    this.handleProductCountChange = this.handleProductCountChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.headerH = this.headerRef.current.offsetHeight;
    this.topNavH = this.topNavRef.current.offsetHeight;
    this.leftNavW = this.leftNavRef.current.offsetWidth;
    this.maxHeaderY = this.topNavH;
    this.maxNavY = this.maxHeaderY + this.headerH;

    this.scrollDirection = 'down';

    this.headerRef.current.style.top = `${this.maxHeaderY}px`;
    this.headerRef.current.classList.add('sticky');

    this.pointEls = document.querySelectorAll('[data-point-type]');
    this.points = {};
    this.navBounds = {
      top: this.maxNavY,
      bottom: window.innerHeight,
    };

    window.addEventListener('scroll', this.handleScroll, false);

    if(!stickySupported()){
      window.Stickyfill.add(document.querySelectorAll('.sticky'));
    }

    this.setState(App.generateData({
      ...App.getStateFromQueryString(this.state),
      navStyles: {
        // width has to be set because when the nav switches to a `fixed` width,
        // the `flex` styling shrinks
        width: `${this.leftNavW}px`
      }
    }), () => {
      if(this.state.debug) logger = debugLogger;
      this.handleScroll();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.navObserver.disconnect();
  }

  handleDebugToggle() {
    const debug = !this.state.debug;

    logger = (debug) ? debugLogger : dummyLogger;

    this.setState({
      debug,
    }, App.updateQuery({
      _default: false,
      name: 'debug',
      value: debug,
    }));
  }

  handleProductCountChange(productCount) {
    this.setState(App.generateData({
      productCount,
    }), App.updateQuery({
      _default: PRODUCT_COUNT,
      name: 'productCount',
      value: productCount,
    }));
  }

  handleCategoryCountChange(categoryCount) {
    this.setState(App.generateData({
      categoryCount,
    }), App.updateQuery({
      _default: CATEGORY_COUNT,
      name: 'categoryCount',
      value: categoryCount,
    }));
  }

  handleFilterCountChange(filterCount) {
    this.setState(App.generateData({
      filterCount,
      filterChildCount: this.state.filterChildCount,
    }), App.updateQuery({
      _default: FILTER_COUNT,
      name: 'filterCount',
      value: filterCount,
    }));
  }

  handleFilterChildCountChange(filterChildCount) {
    this.setState(App.generateData({
      filterCount: this.state.filterCount,
      filterChildCount,
    }), App.updateQuery({
      _default: FILTER_CHILD_COUNT,
      name: 'filterChildCount',
      value: filterChildCount,
    }));
  }

  handleClearBtnToggle() {
    this.controlNavPosition({ heightChanged: true });
  }

  handleFilterGroupToggle() {
    // TODO - On start of the toggle animation, start a timer that runs at 10ms
    // intervals and runs `controlNavPosition`, use the `TOGGLE_SPEED` from
    // the LeftNav styles to determine how long to run the interval for. This
    // should mitigate the pop in the nav's position when a toggle is opened/closed
    // and the nav has to stick to the bottom or top.
    this.controlNavPosition({ heightChanged: true });
  }

  /**
   * Recalculate the bottom bounds to account for the bottom of the wrapper
   * scrolling into view.
   */
  calcBounds() {
    const btmPoint = document.querySelector('[data-point-type="wrapperBtm"]');
    const rectY = btmPoint.getBoundingClientRect().y

    this.navBounds.bottom = (rectY < window.innerHeight)
      ? rectY
      : window.innerHeight;
  }

  handleScroll() {
    this.scrollDirection = (this.prevScroll > window.pageYOffset) ? 'up' : 'down';
    this.prevScroll = window.pageYOffset;

    this.calcBounds();

    for (let i=0; i<this.pointEls.length; i++) {
      const point = this.pointEls[i];
      const type = point.dataset.pointType;
      const rect = point.getBoundingClientRect();

      if(!this.points[type]) this.points[type] = {};

      this.points[type].visible = rect.y >= this.navBounds.top && rect.y <= this.navBounds.bottom;
      this.points[type].y = rect.y;
    }

    this.controlHeaderPosition();
    this.controlNavPosition();
  }

  controlHeaderPosition() {
    // NOTE - setting attributes directly on element since React doesn't
    // update the DOM fast enough, which results in choppy paint when the header
    // becomes (un)locked.

    // TODO - Update `maxHeaderY` if that value is based off responsive elements
    // that could change height after a `resize`.

    if(window.pageYOffset >= this.maxHeaderY){
      this.headerRef.current.classList.add('is--sticky');
    }
    else {
      this.headerRef.current.classList.remove('is--sticky');
    }
  }

  setClearBtnPosition(pos){
    if(pos === this.clearBtnPos) return;

    const clearBtnStyles = {
      position: 'fixed',
    };

    switch(pos){
      case navPositions.LOCK_TO_VIEWPORT_BOTTOM:
        clearBtnStyles.position = 'fixed';
        break;

      case navPositions.LOCK_TO_WRAPPER_BOTTOM:
        clearBtnStyles.position = 'absolute';
        break;
    }

    this.clearBtnPos = pos;

    logger.log(`Clear button position = ${pos}`);

    this.setState({ clearBtnStyles });
  }

  setNavPosition(pos) {
    // Ensure the setting of DOM props doesn't happen more often then it has to.
    if(pos === this.navPos) return;

    const navStyles = { ...this.state.navStyles };

    switch(pos){
      case navPositions.SCROLL:
        const offsetY = this.leftNavRef.current.getBoundingClientRect().y - this.leftNavWrapperRef.current.getBoundingClientRect().y;
        navStyles.position = 'absolute';
        navStyles.top = `${offsetY}px`;
        navStyles.bottom = null;
        break;

      case navPositions.LOCK_TO_HEADER_BOTTOM:
        navStyles.position = 'fixed';
        navStyles.top = `${this.maxNavY}px`;
        navStyles.bottom = null;
        break;

      case navPositions.LOCK_TO_VIEWPORT_BOTTOM:
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

    logger.log(`Nav position = ${pos}`);

    this.setState({ navStyles });
  }

  controlNavPosition({
    heightChanged,
  } = {}) {
    // don't do anything if the nav is taller than the Results
    if(this.resultsRef.current.offsetHeight < this.leftNavRef.current.offsetHeight) {
      this.setNavPosition();
      return;
    }

    if(heightChanged) logger.log('heightChanged');

    if(this.points){
      const {
        navBtm,
        navTop,
        wrapperBtm,
        wrapperTop,
      } = this.points;
      const navFitsInView = this.leftNavRef.current.offsetHeight < this.navBounds.bottom - this.navBounds.top;

      // HEIGHT CHANGE =========================================================
      if(heightChanged){
        if(
          !wrapperTop.visible
          && navFitsInView
        ){
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
        }
        else if(
          wrapperBtm.visible
          && !navFitsInView
          || wrapperBtm.visible
          && navBtm.y > wrapperBtm.y
        ){
          this.setNavPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
        }
      }
      // DOWN ==================================================================
      else if(this.scrollDirection === 'down'){

        // [lock - to header bottom]
        if(
          // IF - The top of the wrapper is hidden, and the nav can fit within
          //      the viewing area.
          !wrapperTop.visible
          && navFitsInView
        ) {
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
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
        // [lock - to viewport bottom]
        else if(
          // IF - Wrapper bottom is not in view, AND nav bottom is in view, stick
          //      to bottom stickPoint.
          navBtm.visible
          && !wrapperTop.visible
        ){
          this.setNavPosition(navPositions.LOCK_TO_VIEWPORT_BOTTOM);
        }

        if(!wrapperBtm.visible){
          this.setClearBtnPosition(navPositions.LOCK_TO_VIEWPORT_BOTTOM);
        }else {
          this.setClearBtnPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
        }
      }
      // UP ====================================================================
      else if(this.scrollDirection === 'up') {

        // [lock - to wrapper top]
        if(
          // IF - Wrapper top is in view, stick to wrapper top.
          wrapperTop.visible
        ){
          this.setNavPosition();
        }
        else if(
          navTop.visible
          && !wrapperTop.visible
          && navFitsInView
        ) {
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
        }
        // [lock - to top]
        else if(
          // IF - Wrapper top is not in view, AND nav top is in view, stick to
          //      top stickPoint.
          navTop.visible
        ) {
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
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
          this.setClearBtnPosition(navPositions.LOCK_TO_VIEWPORT_BOTTOM);
        }
      }
    }
  }

  render() {
    const {
      categories,
      categoryCount,
      clearBtnStyles,
      debug,
      filters,
      filterCount,
      filterChildCount,
      navStyles,
      productCount,
      products,
    } = this.state;
    let appModifier = '';

    if(debug){
      appModifier += ' debug';
    }

    return (
      <Fragment>
        <div className={`${styles.app} ${appModifier}`}>
          <TopNav
            items={topNavData}
            ref={this.topNavRef}
          />
          <div className="body">
            <Banner />
            <ResultsHeader
              ref={this.headerRef}
              title="Results Title"
            />
            <div className="results-interface">
              <LeftNav
                categories={categories}
                clearBtnStyles={clearBtnStyles}
                filters={filters}
                navStyles={navStyles}
                onClearBtnToggle={this.handleClearBtnToggle}
                onFilterGroupToggle={this.handleFilterGroupToggle}
                ref={{
                  navRef: this.leftNavRef,
                  wrapperRef: this.leftNavWrapperRef,
                }}
              />
              <div className="results__wrapper">
                <Results items={products} ref={this.resultsRef} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <Toolbox
          className={`${styles.toolbox}`}
          position={DOCK_TO_RIGHT}
        >
          <Tools.Toggle
            label="Debug"
            onChange={this.handleDebugToggle}
            toggled={debug}
          />
          <Tools.Number
            label="Product Count"
            min={1}
            onChange={this.handleProductCountChange}
            value={productCount}
          />
          <Tools.Number
            label="Category Count"
            min={1}
            onChange={this.handleCategoryCountChange}
            value={categoryCount}
          />
          <Tools.Number
            label="Filters Count"
            min={1}
            onChange={this.handleFilterCountChange}
            value={filterCount}
          />
          <Tools.Number
            label="Filters Child Count"
            min={1}
            onChange={this.handleFilterChildCountChange}
            value={filterChildCount}
          />
        </Toolbox>
      </Fragment>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
