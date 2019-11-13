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
      isVisited,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    let extraClassName = '';

    if (isStart) extraClassName = 'Node-start';
    else if (isFinish) extraClassName = 'Node-finish';
    else if (isWall) extraClassName = 'Node-wall';
    else if (isVisited) extraClassName = 'Node-visited';

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