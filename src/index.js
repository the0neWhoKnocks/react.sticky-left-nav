import React, { createRef, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles';
import Banner from './components/Banner';
import Footer from './components/Footer';
import LeftNav from './components/LeftNav';
import Results from './components/Results';
import ResultsHeader from './components/ResultsHeader';
import TopNav from './components/TopNav';
import {
  categories as genCategories,
  filters as genFilters,
} from './data/leftNav';
import productData from './data/products';
import topNavData from './data/topNav';

class App extends Component {
  constructor() {
    super();

    this.state = {
      categoryCount: 10,
      filterCount: 3,
      filterChildCount: 5,
      headerH: 0,
      topNavH: 0,
      topNavIsSticky: false,
    };
    this.state.categories = genCategories(10);
    this.state.filters = genFilters(
      this.state.filterCount,
      this.state.filterChildCount,
    );

    this.headerRef = createRef();
    this.topNavRef = createRef();

    this.handleHeaderIntersection = this.handleHeaderIntersection.bind(this);
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

  render() {
    const {
      categories,
      filters,
      headerH,
      topNavH,
      topNavIsSticky,
    } = this.state;
    const placeholderStyles = {
      height: `${headerH}px`,
    };
    let headerClass, headerStyles;

    if(topNavIsSticky){
      headerClass = 'is--sticky';
      headerStyles = {
        top: `${topNavH}px`,
      };
    }

    return (
      <div className={`${styles.root}`}>
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
            <Results items={productData} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
