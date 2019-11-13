// General functions for pathfinding algorithms

export function neighbors(grid, node, rows, cols) {
  const col = node.col;
  const row = node.row;
  const nb = [];
  if (row > 0) nb.push(grid[row - 1][col]);
  if (col > 0) nb.push(grid[row][col - 1]);
  if (row + 1 < rows) nb.push(grid[row + 1][col]);
  if (col + 1 < cols) nb.push(grid[row][col + 1]);
  return nb.filter(node => !node.isVisited);
};

export function distanceToNode(target_node, node) {
  return Math.abs(target_node.row - node.row) + Math.abs(target_node.col - node.col)
};

export function GridToNodeArray(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function sortNodesByDistance(nodes) {
  nodes.sort((A, B) => A.distance - B.distance);
}

export function animate(visitedNodesInOrder, nodesInShortestPathOrder, end_node) {
  if (visitedNodesInOrder[visitedNodesInOrder.length-1].row !== end_node.row
     || visitedNodesInOrder[visitedNodesInOrder.length-1].col !== end_node.col) {
    for (let i = 1; i <= visitedNodesInOrder.length; ++i) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          for (let j = 1; j < visitedNodesInOrder.length; ++j) {
            const node = visitedNodesInOrder[j];
            //node.setClassName('Node-nopath');
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'Node Node-nopath';
          }
        }, 10 * i + 200);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'Node Node-visited';
      }, 10 * i);
    }
  }
  for (let i = 1; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i + 500);
      return;
    }
    if (i === visitedNodesInOrder.length - 1) continue;
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'Node Node-visited';
    }, 10 * i);
  }
}

export function finalPath(end_node) {
  const nodes = [];
  let currentNode = end_node;
  while (currentNode !== null) {
    nodes.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodes;
}

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 1; i < nodesInShortestPathOrder.length-1; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      console.log(node);
      //node.setClassName('Node-shortest-path');
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'Node Node-shortest-path';
    }, 50 * i);
  }
}