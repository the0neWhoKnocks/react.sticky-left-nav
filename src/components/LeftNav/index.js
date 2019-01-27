import React, { forwardRef, Component } from "react";
import Collapsible from 'react-collapsible';
import extend from 'extend';
import Point from '../Point';
import styles, { TOGGLE_SPEED } from "./styles";

class LeftNav extends Component {
  constructor(props) {
    super();

    this.state = {
      showClearFilters: false,
    };
    this.filters = extend(true, {}, props.filters);

    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleFilterGroupToggle = this.handleFilterGroupToggle.bind(this);
  }
  
  handleClearClick() {
    const { onClearBtnToggle } = this.props;
    this.filters = extend(true, {}, this.props.filters);
    
    this.setState({
      showClearFilters: false,
    }, () => {
      this.clearBtnTimer = setTimeout(() => {
        onClearBtnToggle();
      }, TOGGLE_SPEED);
    });
  }
  
  handleFilterClick(ev) {
    ev.preventDefault();
    
    const { onClearBtnToggle } = this.props;
    const data = ev.currentTarget.dataset;
    const filter = this.filters[data.filter][data.filterNdx];
    const selected = !filter.selected;
    let showClearFilters = this.state.showClearFilters;

    if(selected){
      showClearFilters = true;
    } else if(!selected && this.selectedFiltersCount - 1 === 0) {
      showClearFilters = false;
    }
    
    this.filters[data.filter][data.filterNdx].selected = selected;

    this.setState({
      showClearFilters,
    }, () => {
      clearTimeout(this.clearBtnTimer);
      this.clearBtnTimer = setTimeout(() => {
        onClearBtnToggle();
      }, TOGGLE_SPEED);
    });
  }
  
  handleFilterGroupToggle() {
    const { onFilterGroupToggle } = this.props;
    
    onFilterGroupToggle();
  }

  noOp(ev) {
    ev.preventDefault();
  }

  render() {
    const {
      categories,
      clearBtnStyles,
      filters,
      navRef,
      navStyles,
      wrapperRef,
    } = this.props;
    const {
      showClearFilters,
    } = this.state;
    const navModifier = (showClearFilters) ? 'show--clear' : '';

    return (
      <div
        className={`left-nav-wrapper ${styles.root} ${navModifier}`}
        ref={wrapperRef}
      >
        <Point className="left-nav__wrapper-top-point" type="wrapperTop" />
        <nav
          className="left-nav"
          ref={navRef}
          style={navStyles}
        >
          <Point className="left-nav__top-point" type="navTop" />
          {categories.map((item, ndx) => (
            <a
              key={ndx}
              className="left-nav__category-link"
              href={item.url}
              onClick={this.noOp}
            >
              {item.label}
            </a>
          ))}
          {Object.keys(filters).map((filterGroup, groupNdx) => {
            const group = filters[filterGroup];

            if(groupNdx === 0) this.selectedFiltersCount = 0;

            return (
              <Collapsible
                key={groupNdx}
                className="left-nav__filter-group"
                contentInnerClassName="left-nav__filter-group-content"
                onOpening={this.handleFilterGroupToggle}
                onClosing={this.handleFilterGroupToggle}
                openedClassName="left-nav__filter-group"
                tabIndex={0}
                transitionTime={TOGGLE_SPEED}
                trigger={filterGroup}
                triggerClassName="left-nav__filter-group-btn title-font"
                triggerOpenedClassName="left-nav__filter-group-btn title-font is--open"
              >
                {group.map((filter, filterNdx) => {
                  const selected = this.filters[filterGroup][filterNdx].selected;
                  const modifier = (selected) ? 'is--selected' : '';
                  
                  if(selected) this.selectedFiltersCount += 1;

                  return (
                    <a
                      key={filterNdx}
                      className={`left-nav__filter-link ${modifier}`}
                      href={filter.url}
                      data-filter={filterGroup}
                      data-filter-ndx={filterNdx}
                      onClick={this.handleFilterClick}
                    >
                      {filter.label}
                    </a>
                  );
                })}
              </Collapsible>
            );
          })}
          <Point className="left-nav__btm-point" type="navBtm" />
        </nav>
        <button
          className="left-nav__clear-btn"
          disabled={!showClearFilters}
          onClick={this.handleClearClick}
          style={clearBtnStyles}
        >
          {`Clear (${this.selectedFiltersCount}) Filter${(this.selectedFiltersCount > 1) ? 's' : ''}`}
        </button>
        <Point className="left-nav__wrapper-btm-point" type="wrapperBtm" />
      </div>
    );
  }
}

export default forwardRef((props, { navRef, wrapperRef }) => (
  <LeftNav {...props} navRef={navRef} wrapperRef={wrapperRef} />
));
export {
  TOGGLE_SPEED,
};
