import React, { Component } from "react";
import Collapsible from 'react-collapsible';
import Point from '../Point';
import styles from "./styles";

class LeftNav extends Component {
  static getDerivedStateFromProps(props, state){
    const currentFilters = JSON.stringify(state.filters);
    const newFilters = JSON.stringify(props.filters);
    const newState = {};

    if(currentFilters !== newFilters){
      newState.filters = props.filters;
    }

    return (Object.keys(newState).length > 0) ? newState : null;
  }

  constructor(props) {
    super();

    this.state = {
      filters: { ...props.filters },
      showClearFilters: false,
    };

    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleFilterClick(ev) {
    ev.preventDefault();

    const data = ev.currentTarget.dataset;
    const state = { ...this.state };
    const filter = state.filters[data.filter][data.filterNdx];
    const selected = !filter.selected;

    if(selected){
      state.showClearFilters = true;
    } else if(!selected && this.selectedFiltersCount - 1 === 0) {
      state.showClearFilters = false;
    }

    state.filters[data.filter][data.filterNdx].selected = selected;

    this.setState(state);
  }

  noOp(ev) {
    ev.preventDefault();
  }

  render() {
    const { categories } = this.props;
    const {
      filters,
      showClearFilters,
    } = this.state;
    const navModifier = (showClearFilters) ? 'show--clear' : '';

    return (
      <div className={`left-nav-wrapper ${styles.root}`}>
        <Point className="left-nav__wrapper-top-point" type="wrapperTop" />
        <nav className={`left-nav ${navModifier}`}>
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
                openedClassName="left-nav__filter-group"
                tabIndex={0}
                transitionTime={200}
                trigger={filterGroup}
                triggerClassName="left-nav__filter-group-btn title-font"
                triggerOpenedClassName="left-nav__filter-group-btn title-font is--open"
              >
                {group.map((filter, filterNdx) => {
                  const modifier = (filter.selected) ? 'is--selected' : '';

                  if(filter.selected) this.selectedFiltersCount += 1;

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
          <button
            className="left-nav__clear-btn"
            disabled={!showClearFilters}
          >
            Clear Filters
          </button>
          <Point className="left-nav__btm-point" type="navBtm" />
        </nav>

        <Point className="left-nav__wrapper-btm-point" type="wrapperBtm" />
      </div>
    );
  }
}

export default LeftNav;
