const COLS = 7;
const ROWS = 6;
let board = [];
let currentPlayer = 'red'; // rot beginnt
let gameOver = false;

const gameDiv = document.getElementById('game');
const status = document.getElementById('status');

// Spielbrett erstellen
function createBoard() {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  gameDiv.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => {
        if (!gameOver && isPlayerTurn()) {
          makeMove(c);
        }
      });
      gameDiv.appendChild(cell);
    }
  }
}

function isPlayerTurn() {
  // TODO: Bei Multiplayer: nur aktueller Spieler kann ziehen
  return true;
}

function makeMove(col) {
  if (gameOver) return;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col)) {
        gameOver = true;
        status.textContent = currentPlayer + " gewinnt!";
        saveWin();
      } else {
        togglePlayer();
        if (mode === 'ai' && currentPlayer === 'yellow') {
          aiMove();
        }
      }
      break;
    }
  }
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    cell.classList.remove('red', 'yellow');
    if (board[r][c]) {
      cell.classList.add(board[r][c]);
    }
  });
}

function togglePlayer() {
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
}

function checkWin(row, col) {
  const directions = [
    { dr: 0, dc: 1 },  // horizontal
    { dr: 1, dc: 0 },  // vertical
    { dr: 1, dc: 1 },  // diagonal down-right
    { dr: 1, dc: -1 }  // diagonal down-left
  ];

  function count(dir) {
    let r = row + dir.dr;
    let c = col + dir.dc;
    let count = 0;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
      count++;
      r += dir.dr;
      c += dir.dc;
    }
    return count;
  }

  for (let d of directions) {
    if (count(d) + count({ dr: -d.dr, dc: -d.dc }) + 1 >= 4) {
      return true;
    }
  }
  return false;
}

function saveWin() {
  const user = firebase.auth().currentUser;
  if (!user) return;
  const uid = user.uid;
  const userRef = db.collection('users').doc(uid);

  userRef.get().then(doc => {
    const wins = doc.exists && doc.data().wins ? doc.data().wins : 0;
    userRef.set({ wins: wins + 1 }, { merge: true });
  });
}

// KI-Zug (Minimax) placeholder (minimax.js macht das wirklich)
function aiMove() {
  const { column } = minimax(board, MAX_DEPTH, -Infinity, Infinity, true);
  if (column !== undefined) {
    setTimeout(() => makeMove(column), 500);
  } else {
    // Fallback, falls Minimax nichts findet
    for (let c = 0; c < COLS; c++) {
      if (!board[0][c]) {
        setTimeout(() => makeMove(c), 500);
        break;
      }
    }
  }
}

let mode = new URLSearchParams(window.location.search).get('mode');

createBoard();

if (mode === 'ai' && currentPlayer === 'yellow') {
  aiMove();
}
