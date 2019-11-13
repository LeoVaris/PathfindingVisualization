import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {

  render() {

    const {
      col, 
      row,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props; // extract data to constants
    // extra classname if start, end or wall
    let extraClassName = '';

    if (isStart) extraClassName = 'Node-start';
    else if (isFinish) extraClassName = 'Node-finish';
    else if (isWall) extraClassName = 'Node-wall';

    return (
      <div id={`node-${row}-${col}`}
           className={`Node ${extraClassName}`}
           onMouseDown={() => onMouseDown(row, col)}
           onMouseEnter={() => onMouseEnter(row, col)}
           onMouseUp={() => onMouseUp()}
      ></div> 
    )
  }
}