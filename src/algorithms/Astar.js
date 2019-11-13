import {neighbors, GridToNodeArray, sortNodesByDistance, distanceToNode} 
from './generalAlgorithms';


export function astar(grid, start_node, end_node) {
  const visitedNodes = [];
  start_node.distance = 0;
  const unVisitedNodes = GridToNodeArray(grid);
  while (unVisitedNodes.length) {
    sortNodesByDistance(unVisitedNodes);
    const closestNode = unVisitedNodes.shift();

    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodes;
    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    if (closestNode.row === end_node.row && closestNode.col === end_node.col) 
      return visitedNodes;
    updateNeighbors(closestNode, grid, start_node, end_node);
  }
}

function updateNeighbors(node, grid, start_node, end_node) {
  const nb = neighbors(grid, node, grid.length, grid[0].length);
  for (const neighbor of nb) {
    neighbor.distance = distanceToNode(end_node, neighbor) + distanceToNode(start_node, neighbor);
    neighbor.previousNode = node;
  }
}