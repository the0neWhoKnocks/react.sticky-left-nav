export default () => new Promise((resolve) => {
  const el = document.createElement('a');
  const style = el.style;
  style.cssText = 'position:sticky;position:-webkit-sticky;position:-ms-sticky;';

  if (
    // it's supported
    style.position.includes('sticky')
    // or the polyfill's already been loaded
    || window.Stickyfill
  ) {
    resolve();
  } else {
    import(
      /* webpackChunkName: "polyfill.sticky" */
      'stickyfilljs'
    )
    .then((polyfill) => {
      window.Stickyfill = polyfill;
      resolve();
    });
  }
});
