// Minimax-Algorithmus für KIconst ROWS = 6;
const COLS = 7;
const MAX_DEPTH = 4; // Suchtiefe (kann höher, aber langsamer)

const PLAYER = 'red';    // Mensch
const AI = 'yellow';     // KI

// Prüfen, ob vier Steine in einer Reihe sind
function checkWin(board, piece) {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece &&
          board[r][c + 1] === piece &&
          board[r][c + 2] === piece &&
          board[r][c + 3] === piece) return true;
    }
  }

  // Vertikal
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c] === piece &&
          board[r + 1][c] === piece &&
          board[r + 2][c] === piece &&
          board[r + 3][c] === piece) return true;
    }
  }

  // Diagonal (down-right)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece &&
          board[r + 1][c + 1] === piece &&
          board[r + 2][c + 2] === piece &&
          board[r + 3][c + 3] === piece) return true;
    }
  }

  // Diagonal (down-left)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece &&
          board[r - 1][c + 1] === piece &&
          board[r - 2][c + 2] === piece &&
          board[r - 3][c + 3] === piece) return true;
    }
  }

  return false;
}

// Bewertet ein Fenster von 4 Zellen für die Bewertung der KI
function evaluateWindow(window, piece) {
  const opponent = (piece === AI) ? PLAYER : AI;
  let score = 0;

  const countPiece = window.filter(cell => cell === piece).length;
  const countOpponent = window.filter(cell => cell === opponent).length;
  const countEmpty = window.filter(cell => cell === null).length;

  if (countPiece === 4) score += 100;
  else if (countPiece === 3 && countEmpty === 1) score += 5;
  else if (countPiece === 2 && countEmpty === 2) score += 2;

  if (countOpponent === 3 && countEmpty === 1) score -= 4;

  return score;
}

// Bewertet das gesamte Board für die KI
function scorePosition(board, piece) {
  let score = 0;

  // Mitte bevorzugen
  let centerArray = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][Math.floor(COLS / 2)]);
  }
  const centerCount = centerArray.filter(cell => cell === piece).length;
  score += centerCount * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    let rowArray = board[r];
    for (let c = 0; c < COLS - 3; c++) {
      let window = rowArray.slice(c, c + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Vertikal
  for (let c = 0; c < COLS; c++) {
    let colArray = [];
    for (let r = 0; r < ROWS; r++) {
      colArray.push(board[r][c]);
    }
    for (let r = 0; r < ROWS - 3; r++) {
      let window = colArray.slice(r, r + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Diagonal (down-right)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      let window = [
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3]
      ];
      score += evaluateWindow(window, piece);
    }
  }

  // Diagonal (down-left)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      let window = [
        board[r][c],
        board[r - 1][c + 1],
        board[r - 2][c + 2],
        board[r - 3][c + 3]
      ];
      score += evaluateWindow(window, piece);
    }
  }

  return score;
}

function getValidLocations(board) {
  let valid = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) valid.push(c);
  }
  return valid;
}

function getNextOpenRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) return r;
  }
  return -1;
}

function dropPiece(board, row, col, piece) {
  board[row][col] = piece;
}

function isTerminalNode(board) {
  return checkWin(board, PLAYER) || checkWin(board, AI) || getValidLocations(board).length === 0;
}

// Minimax mit Alpha-Beta-Pruning
function minimax(board, depth, alpha, beta, maximizingPlayer) {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWin(board, AI)) {
        return { score: 1000000 };
      } else if (checkWin(board, PLAYER)) {
        return { score: -1000000 };
      } else {
        return { score: 0 };
      }
    } else {
      return { score: scorePosition(board, AI) };
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      let tempBoard = board.map(row => row.slice());
      dropPiece(tempBoard, row, col, AI);
      let newScore = minimax(tempBoard, depth - 1, alpha, beta, false).score;
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, column };
  } else {
    let value = Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      let tempBoard = board.map(row => row.slice());
      dropPiece(tempBoard, row, col, PLAYER);
      let newScore = minimax(tempBoard, depth - 1, alpha, beta, true).score;
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { score: value, column };
  }
}
