/*
  eslint-disable
    default-case,
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
import LeftNav, { TOGGLE_SPEED } from './components/LeftNav';
import LeftNavPosition from './components/LeftNavPosition';
import Products from './components/Products';
import ResultsHeader from './components/ResultsHeader';
import ResultsHeaderPosition from './components/ResultsHeaderPosition';
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
      headerTopBounds: undefined,
      navTopBounds: undefined,
      navBtmBounds: undefined,
      productCount: PRODUCT_COUNT,
      shelfOpened: false,
    });

    this.topNavRef = createRef();
    this.headerRef = createRef();
    this.productsRef = createRef();

    this.handleCategoryCountChange = this.handleCategoryCountChange.bind(this);
    this.handleDebugToggle = this.handleDebugToggle.bind(this);
    this.handleFilterChildCountChange = this.handleFilterChildCountChange.bind(this);
    this.handleFilterCountChange = this.handleFilterCountChange.bind(this);
    this.handleProductCountChange = this.handleProductCountChange.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const headerHeight = this.headerRef.current.offsetHeight;
    const topNavHeight = this.topNavRef.current.offsetHeight;
    
    this.setState(App.generateData({
      ...App.getStateFromQueryString(this.state),
      // TODO - Update `headerTopBounds` if that value is based off responsive elements
      // that could change height after a `resize`.
      headerTopBounds: topNavHeight,
      navTopBounds: topNavHeight + headerHeight,
      navBtmBounds: window.innerHeight,
    }));
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

  render() {
    const {
      categories,
      categoryCount,
      debug,
      filters,
      filterCount,
      filterChildCount,
      headerTopBounds,
      navBtmBounds,
      navTopBounds,
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
            <ResultsHeaderPosition
              boundsTop={headerTopBounds}
              headerRef={this.headerRef}
            >
              <ResultsHeader
                ref={this.headerRef}
                title="Results Title"
              />
            </ResultsHeaderPosition>
            <div className="results-interface">
              <LeftNavPosition
                boundsBottom={navBtmBounds}
                boundsTop={navTopBounds}
                debug={debug}
                sibling={this.productsRef.current}
                toggleSpeed={TOGGLE_SPEED}
              >
                <LeftNav
                  categories={categories}
                  filters={filters}
                />
              </LeftNavPosition>
              <div className="products__wrapper">
                <Products items={products} ref={this.productsRef} />
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
