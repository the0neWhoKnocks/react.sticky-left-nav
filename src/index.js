/* eslint-disable default-case */

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
      debug: false,
      filterCount: FILTER_COUNT,
      filterChildCount: FILTER_CHILD_COUNT,
      headerH: 0,
      productCount: PRODUCT_COUNT,
      shelfOpened: false,
    });

    this.headerRef = createRef();
    this.topNavRef = createRef();

    this.controlHeaderPosition = this.controlHeaderPosition.bind(this);
    this.handleCategoryCountChange = this.handleCategoryCountChange.bind(this);
    this.handleDebugToggle = this.handleDebugToggle.bind(this);
    this.handleFilterCountChange = this.handleFilterCountChange.bind(this);
    this.handleFilterChildCountChange = this.handleFilterChildCountChange.bind(this);
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
    this.maxHeaderY = this.topNavH;
    
    this.headerRef.current.style.top = `${this.maxHeaderY}px`;
    this.headerRef.current.classList.add('sticky');

    this.navObserver = new IntersectionObserver(
      this.handleNavIntersection,
      {
        rootMargin: `-${this.topNavH + this.headerH}px 0px 0px 0px`,
        threshold: 0,
      }
    );
    this.navObserver.observe(document.querySelector('.left-nav__wrapper-top-point'));
    this.navObserver.observe(document.querySelector('.left-nav__wrapper-btm-point'));
    this.navObserver.observe(document.querySelector('.left-nav__top-point'));
    this.navObserver.observe(document.querySelector('.left-nav__btm-point'));

    window.addEventListener('scroll', this.handleScroll, false);
    
    if(!stickySupported()){
      window.Stickyfill.add(document.querySelectorAll('.sticky'));
    }
    
    this.setState(App.generateData({
      ...App.getStateFromQueryString(this.state),
      headerH: this.headerH,
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

    entries.forEach((entry) => {
      const type = entry.target.dataset.type;

      if(!this.points[type]) this.points[type] = {};
      this.points[type].visible = !!entry.intersectionRatio;
    });
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

  handleScroll() {
    const scrollDirection = (this.prevScroll > window.pageYOffset) ? 'up' : 'down';
    this.prevScroll = window.pageYOffset;
    
    this.controlHeaderPosition();
    
    // NOTE - Use `fixed` position when stuck, use transform when
    //        transitioning between stick points.
    // NOTE - Top stickPoint will be an element's Y position plus it's height.
    // NOTE - Bottom stickPoint will be the viewport height, unless the
    //        wrapper's bottom is in view, the it'll be the wrapper's bottom.
    // TODO - Might be able to calculate everything based off of page scrollY
    //        offset and wrapper's Y offset and height.

    // Below, is in order of operation.

    // DOWN ==================================================================
      // [transition]
      // IF - Wrapper bottom is not in view, AND nav bottom is not in view,
      //      increment the Y offset based on scroll distance.

      // [lock]
      // IF - Wrapper bottom is not in view, AND nav bottom is in view, stick to
      //      bottom stickPoint.

      // [lock]
      // IF - Wrapper bottom is in view, stick to wrapper bottom.

    // UP ====================================================================
      // [transition]
      // IF - Wrapper top is not in view, AND nav top is not in view,
      //      increment the Y offset based on scroll distance.

      // [lock]
      // IF - Wrapper top is not in view, AND nav top is in view, stick to
      //      top stickPoint.

      // [lock]
      // IF - Wrapper top is in view, stick to wrapper top.
  }
  
  controlHeaderPosition() {
    // NOTE - setting attributes directly on element since React doesn't
    // update the DOM fast enough, which results in choppy paint when the header
    // becomes (un)locked.
    
    // TODO - Update `maxHeaderY` if that value is based of responsive elements
    // that could change height after a `resize`.
    
    if(window.pageYOffset >= this.maxHeaderY){
      this.headerRef.current.classList.add('is--sticky');
      this.headerIsLocked = true;
    }
    else if(this.headerIsLocked) {
      this.headerRef.current.classList.remove('is--sticky');
      this.headerIsLocked = false;
    }
  }

  render() {
    const {
      categories,
      categoryCount,
      debug,
      filters,
      filterCount,
      filterChildCount,
      headerH,
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
                filters={filters}
              />
              <Results items={products} />
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
