import React, { Component } from "react";
import Number from './components/Number';
import Toggle from './components/Toggle';
import styles, {
  DOCK_TO_RIGHT,
} from "./styles";

const Tools = {
  Number,
  Toggle,
};

class Toolbox extends Component {
  constructor(props) {
    super();

    this.state = {
      opened: false,
    };

    this.handleOpenClick = this.handleOpenClick.bind(this);
  }

  handleOpenClick(ev) {
    this.setState({
      opened: !this.state.opened,
    });
  }

  render() {
    const {
      children,
      position,
    } = this.props;
    const {
      opened,
    } = this.state;
    let modifiers = position;

    if(opened) modifiers += ' is--open';

    return (
      <div className={`toolbox ${styles.root} ${modifiers}`}>
        <button
          className="toolbox__toggle-btn"
          onClick={this.handleOpenClick}
        >&#x2630;</button>
        <div className="toolbox__tools">
          {children}
        </div>
      </div>
    );
  }
}

export default Toolbox;
export {
  DOCK_TO_RIGHT,
  Tools,
};
