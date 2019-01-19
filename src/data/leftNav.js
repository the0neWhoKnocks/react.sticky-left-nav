export const categories = (count) => Array(count).fill().map((item, ndx) => ({
  label: `Category ${ndx+1}`,
  url: `/category-${ndx+1}`,
}));

export const filters = (count, childCount) => {
  const _filters = {};

  for(let i=0; i<count; i++){
    _filters[`Filter ${i+1}`] = Array(childCount).fill().map((item, ndx) => ({
      label: `Filter ${ndx+1}`,
      url: `/filter-${ndx+1}`,
    }));
  }

  return _filters;
};
