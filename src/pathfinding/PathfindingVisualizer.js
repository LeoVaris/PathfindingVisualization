import React, {Component} from 'react';
import Node from './Node';
import {dijkstra} from '../algorithms/dijkstra';
import {astar} from '../algorithms/Astar';
import {GBF} from '../algorithms/GBF';
import {animate, finalPath} from '../algorithms/generalAlgorithms';

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

  // Makes grid after components loaded
  componentDidMount() {
    const grid = Makegrid();
    this.setState({grid, loading: false});
  }
  // when mouse is pressed down
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithAction(this.state.grid, row, col, this.state.CurrentAction);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }
  // when mouse enters
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return; // if currently not placing walls
    const newGrid = getNewGridWithAction(this.state.grid, row, col, this.state.CurrentAction);
    this.setState({grid: newGrid});
  }
  // when mouse up
  handleMouseUp() {
    this.setState({mouseIsPressed: false}); // updates mouse state
  }
  // To make certain action "active"
  extraState(button) {
    const {CurrentAction} = this.state;
    if (CurrentAction === button) {
      return 'IO-current';
    } else return ''; 
  }
  // Clears walls by making a new grid
  ClearGrid() {
    const grid = Makegrid();
    this.setState({grid});
  }
  // Refreshing the page -> everything is reset
  ResetGrid() {
    window.location.reload();
  }


  // These algorithms could have been made to 1 function to save space
  // Dijkstra
  VisualizeDijkstra() {
    const {grid} = this.state;
    const start_node = grid[start_row][start_col];
    const end_node = grid[end_row][end_col];
    const nodes = dijkstra(grid, start_node, end_node); // computes visited nodes
    const pathNodes = finalPath(nodes[nodes.length-1]); // gets shortest path 
    animate(nodes, pathNodes, end_node); // animates path
  }
  // Astar
  VisualizeAstar() {
    const {grid} = this.state;
    const start_node = grid[start_row][start_col];
    const end_node = grid[end_row][end_col];
    const nodes = astar(grid, start_node, end_node);
    const pathNodes = finalPath(nodes[nodes.length-1]);
    animate(nodes, pathNodes, end_node);
  }
  // Greedy Best-first Search
  VisualizeGBF() {
    const {grid} = this.state;
    const start_node = grid[start_row][start_col];
    const end_node = grid[end_row][end_col];
    const nodes = GBF(grid, start_node, end_node);
    const pathNodes = finalPath(nodes[nodes.length-1]);
    animate(nodes, pathNodes, end_node);
  }
  // Updates ActionState
  SetActionState(newState) {
    this.setState({CurrentAction: newState});
  }
  // render
  render() {
    const {grid, loading, mouseDown} = this.state; // extract variables

    if (loading) { // if page not loaded
      return 'Loading...';
    }
    return (
    <>
      <div className="buttons"> { /* Create all IO*/}
        <div className="IO"> {/*Create top row */}
          <button className="general" onClick={() => this.ClearGrid()}>
            Clear Walls
          </button>
          <button className={`general ${this.extraState(ActionState.PlaceWall)}`} onClick={() => this.SetActionState(ActionState.PlaceWall)}>
            Place wall
          </button>
          <button className={`general ${this.extraState(ActionState.RemoveWall)}`} onClick={() => this.SetActionState(ActionState.RemoveWall)}>
            Remove wall
          </button>
          <button className={`general ${this.extraState(ActionState.Start)}`} onClick={() => this.SetActionState(ActionState.Start)}>
            Place startnode
          </button>
          <button className={`general ${this.extraState(ActionState.End)}`} onClick={() => this.SetActionState(ActionState.End)}>
            Place endnode
          </button>
          <button className="general" onClick={() => this.ResetGrid()}>
            Reset Grid
          </button>
        </div>
        <div className="info"> {/*Create info message */}
          Press below to visualize!
        </div>
        <div className="VisualizeClass"> {/*Visualize buttons */}
          <button className="general Visualize" onClick={() => this.VisualizeDijkstra()}>
            Dijkstra's
          </button>
          <button className="general Visualize" onClick={() => this.VisualizeAstar()}>
            AStar
          </button>
          <button className="general Visualize" onClick={() => this.VisualizeGBF()}>
            Greedy Best-first Search
          </button>
        </div>
        <div className="warning"> {/* Last row to tell user to reset browser after visualization*/}
          Please reset grid after visualization
        </div>
      </div>
      
      <div className="grid"> {/* Render the grid*/}
        {grid.map((row, rowIdx) => { 
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {  
                const {row, col, isStart, isFinish, isWall, isVisited} = node; 
                return( // return Node component with these props
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
// Create grid
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

// creates every node to have necessary data
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

// handles Actions
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
// place new start 
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
  // remove start first to avoid adding and removing the same node
  newGrid[start_row][start_col] = RemovedStart; 
  newGrid[row][col] = newStart;
  start_col = col;
  start_row = row;
  return newGrid;
}
// place new end
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

// toggle wall with placewall boolean
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
