import {neighbors, GridToNodeArray, sortNodesByDistance} 
from './generalAlgorithms';


export function dijkstra(grid, start_node, end_node) {
  const visitedNodes = [];
  start_node.distance = 0; // start with 0 dist
  const unVisitedNodes = GridToNodeArray(grid); // all are unvisited
  while (unVisitedNodes.length) { // while theres nodes to visit
    sortNodesByDistance(unVisitedNodes); // sort nodes
    const closestNode = unVisitedNodes.shift(); // removes the first item

    if (closestNode.isWall) continue; // if its wall ignore it

    if (closestNode.distance === Infinity) return visitedNodes; // theres no path
    closestNode.isVisited = true; // "visit" this node
    visitedNodes.push(closestNode); 
    if (closestNode.row === end_node.row && closestNode.col === end_node.col)  // if this is end
      return visitedNodes;
    updateNeighbors(closestNode, grid); // update this nodes neighbors
  }
}

function updateNeighbors(node, grid) {
  const nb = neighbors(grid, node, grid.length, grid[0].length);
  for (const neighbor of nb) {
    neighbor.distance = node.distance + 1; // distance is 1 more than where it came from
    neighbor.previousNode = node;
  }
}
