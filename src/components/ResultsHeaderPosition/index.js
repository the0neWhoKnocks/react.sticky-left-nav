import React, {
  Component,
  Fragment,
} from 'react';
import loadStickyPolyfill from 'utils/loadStickyPolyfill';

class ResultsHeaderPosition extends Component {
  constructor(props) {
    super();

    this.handleScroll = this.handleScroll.bind(this);
  }
  
  componentDidMount() {
    loadStickyPolyfill().then(() => this.init());
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { boundsTop } = this.props;
    
    if(boundsTop !== prevProps.boundsTop) this.setHeaderPosition();
  }
  
  init() {
    window.addEventListener('scroll', this.handleScroll, false);
    this.setHeaderPosition();
    this.handleScroll();
  }
  
  setHeaderPosition() {
    const {
      boundsTop,
      headerRef,
    } = this.props;
    
    if(boundsTop !== undefined){
      if (this.sticky) {
        this.sticky.remove();
        this.sticky = null;
      }

      headerRef.current.style.top = `${boundsTop}px`;

      if (window.Stickyfill) {
        if (!this.sticky) {
          this.sticky = new window.Stickyfill.Sticky(headerRef.current);
        }
      }
    }
  }
  
  handleScroll() {
    this.controlHeaderPosition();
  }
  
  controlHeaderPosition() {
    const {
      boundsTop,
      headerRef,
    } = this.props;
    
    // NOTE - setting attributes directly on element since React doesn't
    // update the DOM fast enough, which results in choppy paint when the header
    // becomes (un)locked.    
    if(window.pageYOffset >= boundsTop){
      headerRef.current.classList.add('is--sticky');
    }
    else {
      headerRef.current.classList.remove('is--sticky');
    }
  }

  render() {
    const { children } = this.props;
    
    return <Fragment>{children}</Fragment>
  }
}

export default ResultsHeaderPosition;
