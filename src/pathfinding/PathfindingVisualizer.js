import React, {Component} from 'react';
import Node from './Node';
import {dijkstra} from '../algorithms/dijkstra';
import {astar} from '../algorithms/Astar';
import {GBF} from '../algorithms/GBF';
import {animate, finalPath, GridToNodeArray} from '../algorithms/generalAlgorithms';

import './PathfindingVisualizer.css';

const GridHeight = 25;
const GridWidth = 50;

let start_row = 12
let start_col = 10

let end_row = 12
let end_col = 40

var ActionState = {
  PlaceWall: 1,
  RemoveWall: 2,
  Start: 3,
  End: 4,
}

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      loading: true,
      mouseDown: false,
      CurrentAction: ActionState.PlaceWall,
    };
  }

  componentDidMount() {
    const grid = Makegrid();
    this.setState({grid, loading: false});
  }

  HardReset() {
    const arr = GridToNodeArray(this.state.grid);
    arr.forEach((node) => {
      node.setClassName('');
    })
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithAction(this.state.grid, row, col, this.state.CurrentAction);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithAction(this.state.grid, row, col, this.state.CurrentAction);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  extraState(button) {
    const {CurrentAction} = this.state;
    if (CurrentAction === button) {
      return 'IO-current';
    } else return '';
  }

  ClearGrid() {
    const grid = Makegrid();
    this.setState({grid});
  }

  ResetGrid() {
    window.location.reload();
  }

  VisualizeDijkstra() {
    const {grid} = this.state;
    const s_node = grid[start_row][start_col];
    const e_node = grid[end_row][end_col];
    const nodes = dijkstra(grid, s_node, e_node);
    const pathNodes = finalPath(nodes[nodes.length-1]);
    animate(nodes, pathNodes, e_node);
  }

  VisualizeAstar() {
    const {grid} = this.state;
    const s_node = grid[start_row][start_col];
    const e_node = grid[end_row][end_col];
    const nodes = astar(grid, s_node, e_node);
    const pathNodes = finalPath(nodes[nodes.length-1]);
    animate(nodes, pathNodes, e_node);
  }

  VisualizeGBF() {
    const {grid} = this.state;
    const s_node = grid[start_row][start_col];
    const e_node = grid[end_row][end_col];
    const nodes = GBF(grid, s_node, e_node);
    const pathNodes = finalPath(nodes[nodes.length-1]);
    animate(nodes, pathNodes, e_node);
  }

  SetActionState(newState) {
    this.setState({CurrentAction: newState});
  }

  render() {
    const {grid, loading, mouseDown} = this.state;

    if (loading) {
      return 'Loading...';
    }
    return (
    <>
      <div className="buttons">
        <div className="IOclass">
          <button className="IO" onClick={() => this.ClearGrid()}>
            Clear Walls
          </button>
          <button className={`IO ${this.extraState(ActionState.PlaceWall)}`} onClick={() => this.SetActionState(ActionState.PlaceWall)}>
            Place wall
          </button>
          <button className={`IO ${this.extraState(ActionState.RemoveWall)}`} onClick={() => this.SetActionState(ActionState.RemoveWall)}>
            Remove wall
          </button>
          <button className={`IO ${this.extraState(ActionState.Start)}`} onClick={() => this.SetActionState(ActionState.Start)}>
            Place startnode
          </button>
          <button className={`IO ${this.extraState(ActionState.End)}`} onClick={() => this.SetActionState(ActionState.End)}>
            Place endnode
          </button>
          <button className="IO" onClick={() => this.ResetGrid()}>
            Reset Grid
          </button>
        </div>

        <div className="info">
          Press below to visualize!
        </div>

        <div className="VisualizeClass"> {/*Algorithms that guarantee best path */}
          <button className="Visualize" onClick={() => this.VisualizeDijkstra()}>
            Dijkstra's
          </button>
          <button className="Visualize" onClick={() => this.VisualizeAstar()}>
            AStar
          </button>
          <button className="Visualize" onClick={() => this.VisualizeGBF()}>
            Greedy Best-first Search
          </button>
        </div>
      </div>
      
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isStart, isFinish, isWall, isVisited} = node;
                return(
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    isVisited={isVisited}
                    mouseDown={mouseDown}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) =>
                      this.handleMouseEnter(row, col)
                    }
                    onMouseUp={() => this.handleMouseUp()}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
    );
  }
}

const Makegrid = () => {
  const grid = [];

  for (let row = 0; row < GridHeight; row++) {
    const thisRow = [];
    for (let col = 0; col < GridWidth; col++) {
      thisRow.push(createNode(row, col));
    }
    grid.push(thisRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col, 
    isStart: row === start_row && col === start_col,
    isFinish: row === end_row && col === end_col,
    isWall: false,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    };
};

const getNewGridWithAction = (grid, row, col, action) => {
  if (action === ActionState.PlaceWall) {
    return getNewGridWithWallToggled(grid, row, col, true);
  } else if (action === ActionState.RemoveWall) {
    return getNewGridWithWallToggled(grid, row, col, false);
  } else if (action === ActionState.Start) {
    return getNewGridWithNewStart(grid, row, col);
  } else {
    return getNewGridWithNewEnd(grid, row, col);
  }
};

const getNewGridWithNewStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const oldStart = newGrid[start_row][start_col];
  const node = newGrid[row][col];
  const newStart = {
    ...node,
    isWall: false,
    isStart: true,
  };
  const RemovedStart = {
    ...oldStart,
    isStart: false,
  }
  newGrid[start_row][start_col] = RemovedStart;
  newGrid[row][col] = newStart;
  start_col = col;
  start_row = row;
  return newGrid;
}

const getNewGridWithNewEnd = (grid, row, col) => {
  const newGrid = grid.slice();
  const oldEnd = newGrid[end_row][end_col];
  const node = newGrid[row][col];
  const newEnd = {
    ...node,
    isWall: false,
    isFinish: true,
  };
  const RemovedEnd = {
    ...oldEnd,
    isFinish: false,
  }
  newGrid[end_row][end_col] = RemovedEnd;
  newGrid[row][col] = newEnd;
  end_col = col;
  end_row = row;
  return newGrid;
}

const getNewGridWithWallToggled = (grid, row, col, placeWall) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: placeWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
