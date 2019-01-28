import React, {
  Component,
  Fragment,
} from 'react';

const stickySupported = () => {
  const el = document.createElement('a');
  const mStyle = el.style;
  mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
  return mStyle.position.indexOf('sticky') !== -1;
};

class ResultsHeaderPosition extends Component {
  constructor(props) {
    super();

    this.handleScroll = this.handleScroll.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
    
    this.setHeaderPosition();
    this.handleScroll();
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { boundsTop } = this.props;
    
    if(boundsTop !== prevProps.boundsTop) this.setHeaderPosition();
  }
  
  setHeaderPosition() {
    const {
      boundsTop,
      headerRef,
    } = this.props;
    
    if(boundsTop){
      headerRef.current.style.top = `${boundsTop}px`;
      
      if(!stickySupported()){
        if(!this.stickyAdded){
          headerRef.current.classList.add('sticky');
          window.Stickyfill.add(document.querySelectorAll('.sticky'));
          this.stickyAdded = true;
        }
        else {
          window.Stickyfill.refreshAll();
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
