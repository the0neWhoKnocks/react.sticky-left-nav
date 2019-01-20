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

class App extends Component {
  constructor() {
    super();

    this.state = {
      categoryCount: 10,
      debug: false,
      filterCount: 3,
      filterChildCount: 5,
      headerH: 0,
      productCount: 24,
      shelfOpened: false,
      topNavH: 0,
      topNavIsSticky: false,
    };
    this.state.categories = genCategories(this.state.categoryCount);
    this.state.filters = genFilters(
      this.state.filterCount,
      this.state.filterChildCount,
    );
    this.state.products = genProducts(this.state.productCount);

    this.headerRef = createRef();
    this.topNavRef = createRef();

    this.handleCategoryCountChange = this.handleCategoryCountChange.bind(this);
    this.handleDebugToggle = this.handleDebugToggle.bind(this);
    this.handleFilterCountChange = this.handleFilterCountChange.bind(this);
    this.handleFilterChildCountChange = this.handleFilterChildCountChange.bind(this);
    this.handleHeaderIntersection = this.handleHeaderIntersection.bind(this);
    this.handleProductCountChange = this.handleProductCountChange.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.headerH = this.headerRef.current.offsetHeight;
    this.topNavH = this.topNavRef.current.offsetHeight;
    this.headerObserver = new IntersectionObserver(
      this.handleHeaderIntersection,
      {
        rootMargin: `-${this.topNavH}px 0px 0px 0px`,
        threshold: 1,
      }
    );

    this.headerObserver.observe(document.querySelector('.results-header-placeholder'));

    this.setState({
      headerH: this.headerH,
      topNavH: this.topNavH,
    });
  }

  componentWillUnmount() {
    this.headerObserver.disconnect();
  }

  handleDebugToggle() {
    this.setState({
      debug: !this.state.debug,
    });
  }

  handleHeaderIntersection(entries) {
    const header = entries[0];

    if(header.intersectionRatio < 1){
      this.setState({
        topNavIsSticky: true,
      });
    }
    else {
      this.setState({
        topNavIsSticky: false,
      });
    }
  }

  handleProductCountChange(productCount) {
    this.setState({
      productCount,
      products: genProducts(productCount),
    });
  }

  handleCategoryCountChange(categoryCount) {
    this.setState({
      categoryCount,
      categories: genCategories(categoryCount),
    });
  }

  handleFilterCountChange(filterCount) {
    this.setState({
      filterCount,
      filters: genFilters(
        filterCount,
        this.state.filterChildCount,
      ),
    });
  }

  handleFilterChildCountChange(filterChildCount) {
    this.setState({
      filterChildCount,
      filters: genFilters(
        this.state.filterCount,
        filterChildCount,
      ),
    });
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
      topNavH,
      topNavIsSticky,
    } = this.state;
    const placeholderStyles = {
      height: `${headerH}px`,
    };
    let appModifier = '';
    let headerClass, headerStyles;

    if(topNavIsSticky){
      headerClass = 'is--sticky';
      headerStyles = {
        top: `${topNavH}px`,
      };
    }

    if(debug){
      appModifier += ' debug';
    }

    return (
      <Fragment>
        <div className={`${styles.root} ${appModifier}`}>
          <TopNav
            items={topNavData}
            ref={this.topNavRef}
          />
          <div className="body">
            <Banner />
            <ResultsHeader
              headerClass={headerClass}
              headerStyles={headerStyles}
              placeholderStyles={placeholderStyles}
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
        <Toolbox position={DOCK_TO_RIGHT}>
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
