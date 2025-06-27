const COLS = 7;
const ROWS = 6;

function evaluateWindow(window, player) {
  const opponent = player === 'yellow' ? 'red' : 'yellow';
  let score = 0;
  const countPlayer = window.filter(cell => cell === player).length;
  const countOpponent = window.filter(cell => cell === opponent).length;
  const countEmpty = window.filter(cell => cell === null).length;

  if (countPlayer === 4) {
    score += 100;
  } else if (countPlayer === 3 && countEmpty === 1) {
    score += 5;
  } else if (countPlayer === 2 && countEmpty === 2) {
    score += 2;
  }

  if (countOpponent === 3 && countEmpty === 1) {
    score -= 4;
  }

  return score;
}

function scorePosition(board, player) {
  let score = 0;

  const centerArray = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][Math.floor(COLS / 2)]);
  }
  const centerCount = centerArray.filter(c => c === player).length;
  score += centerCount * 3;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = board[r].slice(c, c + 4);
      score += evaluateWindow(window, player);
    }
  }

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]];
      score += evaluateWindow(window, player);
    }
  }

  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
      score += evaluateWindow(window, player);
    }
  }

  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

function getValidLocations(board) {
  const valid = [];
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

function isTerminalNode(board) {
  return checkAnyWin(board, 'red') || checkAnyWin(board, 'yellow') || getValidLocations(board).length === 0;
}

function checkAnyWin(board, piece) {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece && board[r][c + 1] === piece && board[r][c + 2] === piece && board[r][c + 3] === piece) {
        return true;
      }
    }
  }
  // Vertikal
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c] === piece && board[r + 1][c] === piece && board[r + 2][c] === piece && board[r + 3][c] === piece) {
        return true;
      }
    }
  }
  // Diagonal \
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece && board[r + 1][c + 1] === piece && board[r + 2][c + 2] === piece && board[r + 3][c + 3] === piece) {
        return true;
      }
    }
  }
  // Diagonal /
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === piece && board[r - 1][c + 1] === piece && board[r - 2][c + 2] === piece && board[r - 3][c + 3] === piece) {
        return true;
      }
    }
  }
  return false;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkAnyWin(board, 'yellow')) {
        return { score: 1000000000 };
      } else if (checkAnyWin(board, 'red')) {
        return { score: -1000000000 };
      } else {
        return { score: 0 };
      }
    } else {
      return { score: scorePosition(board, 'yellow') };
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[0];
    for (let col of validLocations) {
      const row = getNextOpenRow(board, col);
      if (row === -1) continue;
      let tempBoard = board.map(row => row.slice());
      tempBoard[row][col] = 'yellow';
      let newScore = minimax(tempBoard, depth - 1, alpha, beta, false).score;
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { column, score: value };
  } else {
    let value = Infinity;
    let column = validLocations[0];
    for (let col of validLocations) {
      const row = getNextOpenRow(board, col);
      if (row === -1) continue;
      let tempBoard = board.map(row => row.slice());
      tempBoard[row][col] = 'red';
      let newScore = minimax(tempBoard, depth - 1, alpha, beta, true).score;
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { column, score: value };
  }
}
