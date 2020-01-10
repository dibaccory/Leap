

function Node(move, player) {
    this.visits = 1;
    this.score = 0;
    this.children = null;
    this.player = player;
    this.move = move;
}

Node.prototype.opponent = function () {
    return this.player ^ 8;
}

Node.prototype.append = function (child) {
    if (!this.children) this.children = [child];
    else this.children.push(child);
}

Node.prototype.expand = function (board) {
    board.clearMoves();
    board.getAllMoves();

    for (var i = 0; i < moveList.length; i++) {
        var child = new Node(moveList.list[i], board.player);
        this.append(child);
    }
}

Node.prototype.playFor = function (board) {
    var move = this.move;
    var fromRow = move >> 24;
    var fromCol = (move >> 16) & 0xFF;
    var toRow = (move >> 8) & 0xFF;
    var toCol = (move) & 0xFF;
    return board.move(fromRow, fromCol, toRow, toCol);
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





function UCT() {
  const root = new Node(0, 0);
  let MaxHistory = original.area();
  let MaturityThreshold = 200;

  // Populate the first node.
  root.expand(original, moveList);
  var history = [root];

  var TotalPlayouts = 0;
  var start = Date.now();
  var elapsed;
  while (true) {
      for (var i = 0; i < 500; i++)
          this.run();
      TotalPlayouts += 500;
      elapsed = Date.now() - start;
      if (elapsed >= maxTime)
          break;
  }

  var bestChild = null;
  var bestScore = -Infinity;
  for (var i = 0; i < root.children.length; i++) {
      var child = root.children[i];
      if (child.visits > bestScore) {
          bestChild = child;
          bestScore = child.visits;
      }
  }

  var move = bestChild.move;
  var fromRow = move >> 24;
  var fromCol = (move >> 16) & 0xFF;
  var toRow = (move >> 8) & 0xFF;
  var toCol = (move) & 0xFF;

  return { elapsed: elapsed,
      playouts: TotalPlayouts,
      fromRow: fromRow,
      fromCol: fromCol,
      toRow: toRow,
      toCol: toCol
  };
}

UCT.prototype.playout = function (board) {
    var nmoves = 0;

    while (++nmoves < 60) {
        var result = board.moveRandom(moveList);
        if (result)
            return result;
    }
    var p1 = board.evaluateScore(Checkers.PlayerOne);
    var p2 = board.evaluateScore(Checkers.PlayerTwo);
    if (p1 > p2)
        return Checkers.PlayerOne;
    if (p1 < p2)
        return Checkers.PlayerTwo;
    return 0;
}

UCT.protoype.run = function () {
    var depth = 1;
    var board = original.copy();
    var node = this.root;
    var winner = 0;

    while (true) {
        if (node.children === null) {
            if (node.visits >= MaturityThreshold) {
                node.expand(board, moveList);

                // Leaf node - go directly to update.
                if (node.children === null) {
                    winner = node.opponent();
                    history[depth++] = node;
                    break;
                }
                continue;
            }
            winner = this.playout(board);
            break;
        }
        node = node.findBestChild();
        history[depth++] = node;
        if (node.playFor(board)) {
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
