

function Node(from, to) {
    this.visits = 1;
    this.score = 0;
    this.children = null;
    this.to = to || -1;
    this.from = from || -1;
}
//
// Node.prototype.opponent = function () {
//     return this.player ^ 8;
// }

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
        const to = ( state.moves[pi][i] & (BIT_AREA - 1) );
        let child = new Node(from, to);
        this.append(child);
      }
  }
}

Node.prototype.playFor = function (state) {
    return state.doMove(this.from, this.to);
}

Node.prototype.ucb = function (coeff) {
    var score = (this.score / this.visits);
    return score + Math.sqrt(coeff / this.visits);
}

Node.prototype.findBestChild = function () {
    var coeff = 20 * Math.log(this.visits);
    var bestScore = -Infinity;
    var bestChild = null;
    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        var score = child.ucb(coeff);
        if (score > bestScore) {
            bestScore = score;
            bestChild = child;
        }
    }
    return bestChild;
}





function UCT(startState, maxTime) {
  this.root = new Node();
  this.startState = startState;
  let MaturityThreshold = 200;

  // Populate the first node.
  this.root.branch(startState);
  var history = [this.root];

  var TotalPlayouts = 0;
  var start = Date.now();
  var elapsedTime;
  while (elapsedTime < maxTime) {
      for (var i = 0; i < 500; i++) this.run();
      TotalPlayouts += 500;
      elapsedTime = Date.now() - start;
  }

  var bestChild = null;
  var bestScore = -Infinity;
  for (var i = 0; i < this.root.children.length; i++) {
      var child = this.root.children[i];
      if (child.visits > bestScore) {
          bestChild = child;
          bestScore = child.visits;
      }
  }

  return {
    elapsed: elapsed,
    playouts: TotalPlayouts,
    from: bestChild.from,
    to: bestChild.to
  };
}

UCT.prototype.playout = function (state) {
    var nmoves = 0;

    while (++nmoves < 60) {
        var result = state.moveRandom(); //returns if won
        if (result) return result;
    }
    var p1 = board.evaluateScore(Checkers.PlayerOne);
    var p2 = board.evaluateScore(Checkers.PlayerTwo);
    if (p1 > p2)
        return Checkers.PlayerOne;
    if (p1 < p2)
        return Checkers.PlayerTwo;
    return 0; //tie?
}

UCT.protoype.run = function () {
    const state = this.startState.copy();
    const node = this.root;
    let depth = 1;
    let winner = 0;

    while (true) {
        if (node.children === null) {
            if (node.visits >= MaturityThreshold) {
                node.branch(state);

                // Leaf node - go directly to update.
                if (node.children === null) {
                    winner = node.opponent();
                    history[depth++] = node;
                    break;
                }
                continue;
            }
            winner = this.playout(state);
            break;
        }
        node = node.findBestChild();
        history[depth++] = node;
        if (node.playFor(state)) {
            winner = board.player;
            break;
        }
    }

    for (var i = 0; i < depth; i++) {
        node = history[i];
        node.visits++;
        if (winner == node.player)
            node.score += 1;
        else if (winner != 0)
            node.score -= 1;
    }
}
