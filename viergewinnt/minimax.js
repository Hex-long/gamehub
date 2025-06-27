const MAX_DEPTH = 4;

// Bewertungsfunktion (einfaches Beispiel)
function evaluateBoard(board) {
  // TODO: Deine Bewertung für das Board
  return 0;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
  // Abbruchbedingung
  if (depth === 0) {
    return { score: evaluateBoard(board) };
  }

  const COLS = 7;
  let validColumns = [];
  for (let c = 0; c < COLS; c++) {
    if (!board[0][c]) validColumns.push(c);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestCol = validColumns[0];
    for (let col of validColumns) {
      // Simuliere Zug
      let row = getAvailableRow(board, col);
      if (row === -1) continue;
      let newBoard = copyBoard(board);
      newBoard[row][col] = 'yellow'; // KI Farbe
      let eval = minimax(newBoard, depth -1, alpha, beta, false).score;
      if (eval > maxEval) {
        maxEval = eval;
        bestCol = col;
      }
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
    return { column: bestCol, score: maxEval };
  } else {
    let minEval = Infinity;
    let bestCol = validColumns[0];
    for (let col of validColumns) {
      let row = getAvailableRow(board, col);
      if (row === -1) continue;
      let newBoard = copyBoard(board);
      newBoard[row][col] = 'red'; // Spieler Farbe
      let eval = minimax(newBoard, depth -1, alpha, beta, true).score;
      if (eval < minEval) {
        minEval = eval;
        bestCol = col;
      }
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
    return { column: bestCol, score: minEval };
  }
}

function getAvailableRow(board, col) {
  for (let r = board.length - 1; r >= 0; r--) {
    if (!board[r][col]) return r;
  }
  return -1;
}

function copyBoard(board) {
  return board.map(row => row.slice());
}
