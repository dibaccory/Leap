import {BOARD_SIZE, BOARD_AREA, BIT_SIZE, BIT_MAX_PI, BIT_INDEX_SHIFT, BIT_AREA} from './board.js';

const UCB_COEFFICENT = 1;

function Node(player, from, to) {
    this.visits = 1;
    this.score = (to >> 5) ? BOARD_SIZE : 0;
    this.children = null;
    this.to = to & (BIT_AREA - 1);
    this.from = from;
    this.player = player;
}

Node.prototype.opponent = function () {
    return this.player ^ 8;
}

Node.prototype.append = function (child) {
    if (!this.children) this.children = [child];
    else this.children.push(child);
}

Node.prototype.branch = function (state) {
    state.clearMoves();
    state.getAllMoves(state.player);

    const shift = (state.player === 12) ? BIT_MAX_PI : 0;
    for (let pi = shift; pi < BIT_MAX_PI + shift; pi++) {
      const nMoves = state.moves[pi].length;
      const from = state.board[BOARD_AREA + pi];

      for (let i = 0; i < nMoves; i++) {
        const to = state.moves[pi][i];
        let child = new Node(state.player, from, to);
        this.append(child);
      }
  }
}

Node.prototype.playFor = function (state) {
    return state.doMove(this.from, this.to);
}

Node.prototype.ucb = function (c) {
    const score = (this.score / this.visits);
    return score + UCB_COEFFICENT * Math.sqrt( c / this.visits);
}

Node.prototype.findBestChild = function () {
    const coeff = Math.log(this.visits);
    let bestScore = -Infinity;
    let bestChild = null;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      let score;

      //Prioritize unexplored nodes
      if (child.visits !== 1) score = child.ucb(coeff);
      else score = Math.ceil( 10000*(1 + Math.random()) );

      if (score > bestScore) {
          bestScore = score;
          bestChild = child;
      }
    }
    return bestChild;
}





export function UCT(startState, maxTime) {
  this.root = new Node(startState.player);
  this.startState = startState;
  this.visitThreshold = BOARD_SIZE;

  // Populate the first node.
  this.root.branch(startState);
  this.history = [this.root];

  let totalPlayouts = 0;
  const start = Date.now();
  let elapsedTime = 0;
  while (elapsedTime < maxTime) {
      for (let i = 0; i < 500; i++) this.run();
      totalPlayouts += 500;
      elapsedTime = Date.now() - start;
  }

  //Choose best child of root to return next move
  let bestChild = null;
  let bestScore = -Infinity;
  for (let i = 0; i < this.root.children.length; i++) {
      const child = this.root.children[i];
      if (child.visits > bestScore) {
          bestChild = child;
          bestScore = child.visits;
      }
  }

  return {
    elapsed: elapsedTime,
    playouts: totalPlayouts,
    from: bestChild.from,
    to: bestChild.to
  };
}

UCT.prototype.playout = function (state) {
    let nmoves = 0;

    while (++nmoves < 40) {
      const result = state.randomMove(); //returns if won
      if (result) return result;
    }
    return state.score();
}

UCT.prototype.run = function () {
    const state = this.startState.copy();
    let node = this.root;
    let depth = 1;
    let winner = 0;

    while (true) {
      if (node.children === null) {
        //Keeps UCT from branching too quickly
        if (node.visits >= this.visitThreshold*depth) {
        node.branch(state);

        // Leaf node - go directly to update.
        if (node.children === null) {
          winner = node.opponent();
          this.history[depth++] = node;
          break;
        }
          continue;
        }
        winner = this.playout(state);
        break;
      }
        node = node.findBestChild();
        this.history[depth++] = node;
        if (node.playFor(state)) {
          winner = state.player;
          break;
        }
    }

    //Update scores
    for (let i = 0; i < depth; i++) {
      node = this.history[i];
      node.visits++;
      if (winner === node.player) node.score += 1;
      else if (!winner) node.score -= 1;
    }
}
