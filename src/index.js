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
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleFilterCountChange = this.handleFilterCountChange.bind(this);
    this.handleNavIntersection = this.handleNavIntersection.bind(this);
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

    this.navObserver = new IntersectionObserver(
      this.handleNavIntersection,
      {
        rootMargin: `-${this.topNavH + this.headerH}px 0px 0px 0px`,
        threshold: 0,
      }
    );
    this.pointEls = {
      wrapperTop: document.querySelector('.left-nav__wrapper-top-point'),
      wrapperBtm: document.querySelector('.left-nav__wrapper-btm-point'),
      navTop: document.querySelector('.left-nav__top-point'),
      navBtm: document.querySelector('.left-nav__btm-point'),
    };
    this.navObserver.observe(this.pointEls.wrapperTop);
    this.navObserver.observe(this.pointEls.wrapperBtm);
    this.navObserver.observe(this.pointEls.navTop);
    this.navObserver.observe(this.pointEls.navBtm);

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
    }));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.navObserver.disconnect();
  }

  handleDebugToggle() {
    const debug = !this.state.debug;

    this.setState({
      debug,
    }, App.updateQuery({
      _default: false,
      name: 'debug',
      value: debug,
    }));
  }
  
  handleNavIntersection(entries) {
    if(!this.points) this.points = {};
    let pointsVisible = false;

    entries.forEach((entry) => {
      const type = entry.target.dataset.type;

      if(!this.points[type]) this.points[type] = {};
      
      this.points[type].visible = !!entry.intersectionRatio;
      this.points[type].bottom = entry.boundingClientRect.bottom;
      this.points[type].y = entry.boundingClientRect.y;
      
      if(this.points[type].visible) {
        pointsVisible = true;
      }
    });
    
    this.points.pointsVisible = pointsVisible;
    
    this.controlNavPosition();
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
  
  handleFilterClick() {
    this.controlNavPosition();
  }
  
  handleScroll() {
    this.scrollDirection = (this.prevScroll > window.pageYOffset) ? 'up' : 'down';
    this.prevScroll = window.pageYOffset;
    
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
    
    console.log(`Clear button position = ${pos}`);
    
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
    
    console.log(`Nav position = ${pos}`);
    
    this.setState({ navStyles });
  }
  
  controlNavPosition() {
    // don't do anything if the nav is taller than the Results
    if(this.resultsRef.current.offsetHeight < this.leftNavRef.current.offsetHeight) {
      this.setNavPosition();
      return;
    }
    
    if(this.points){
      const navFitsInView = this.leftNavRef.current.offsetHeight < window.innerHeight - this.maxNavY;
    
      // DOWN ==================================================================
      if(this.scrollDirection === 'down'){
    
        // [lock - to header bottom]
        if(
          // IF - The top of the wrapper is hidden, and the nav can fit within
          //      the viewing area.
          !this.points.wrapperTop.visible
          && navFitsInView
        ) {
          // [lock - to wrapper bottom]
          if(
            // IF - The bottom of the wrapper is in view, and the nav fits
            //      within the viewing area, track the bottom of the wrapper
            //      and lock the nav to it once they overlap.
            this.points.wrapperBtm.visible
          ){
            const navBtmY = this.pointEls.navBtm.getBoundingClientRect().y;
            const wrapperBtmY = this.pointEls.wrapperBtm.getBoundingClientRect().y;
    
            if(navBtmY >= wrapperBtmY){
              this.setNavPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
            }
            else {
              this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
            }
          }
          else {
            this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
          }
        }
        // [scroll - with page]
        else if(
          // IF - The wrapper is visible, just scroll.
          this.points.wrapperTop.visible
          // OR - The top of the nav is visible, but the top of the wrapper is
          //      not (the nav was locked to the top of the Results), so unlock
          //      it, and allow it to scroll with the page again.
          || this.points.navTop.visible
          && !this.points.wrapperTop.visible
          // OR - The nav was stuck to the top and needs to transition from the
          //      top to bottom point.
          || !this.points.navTop.visible
          && !this.points.navBtm.visible
        ){
          this.setNavPosition(navPositions.SCROLL);
        }
        // [lock - to viewport bottom]
        else if(
          // IF - Wrapper bottom is not in view, AND nav bottom is in view, stick
          //      to bottom stickPoint.
          this.points.navBtm.visible
          && !this.points.wrapperTop.visible
          // OR - None of the points are in view (which could happen on page load)
          //      stick to the bottom stickPoint.
          || !this.points.pointsVisible
        ){
          // [lock - to wrapper bottom]
          if(
            // IF - The bottom of the wrapper is in view, and the nav doesn't
            //      fit within the viewing area, track the bottom of the wrapper
            //      and lock the nav to it once they overlap.
            this.points.wrapperBtm.visible
          ){
            const navBtmY = this.pointEls.navBtm.getBoundingClientRect().y;
            const wrapperBtmY = this.pointEls.wrapperBtm.getBoundingClientRect().y;
    
            if(navBtmY >= wrapperBtmY){
              this.setNavPosition(navPositions.LOCK_TO_WRAPPER_BOTTOM);
            }
          }
          else {
            this.setNavPosition(navPositions.LOCK_TO_VIEWPORT_BOTTOM);
          }
        }
        
        
        if(!this.points.wrapperBtm.visible){
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
          this.points.wrapperTop.visible
        ){
          this.setNavPosition();
        }
        else if(
          this.points.navTop.visible
          && !this.points.wrapperTop.visible
          && navFitsInView
        ) {
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
        }
        // [lock - to top]
        else if(
          // IF - Wrapper top is not in view, AND nav top is in view, stick to
          //      top stickPoint.
          this.points.navTop.visible
        ) {
          this.setNavPosition(navPositions.LOCK_TO_HEADER_BOTTOM);
        }
        // [scroll - with page]
        else if(
          // IF - The bottom of the nav is in view and the bottom of the wrapper
          //      is not (the nav is locked to the bottom of the viewport), so
          //      pin the nav to it's current position relative to it's parent
          //      to allow for normal scrolling.
          this.points.navBtm.visible
          && !this.points.wrapperBtm.visible
        ){
          this.setNavPosition(navPositions.SCROLL);
        }
        
        if(
          !this.points.wrapperBtm.visible
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
                onFilterClick={this.handleFilterClick}
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
