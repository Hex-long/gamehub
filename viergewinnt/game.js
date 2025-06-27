const COLS = 7;
const ROWS = 6;
let board = [];
let currentPlayer;
let gameOver = false;

const gameDiv = document.getElementById('game');
const status = document.getElementById('status');

let mode = new URLSearchParams(window.location.search).get('mode');
currentPlayer = 'red'; // rot beginnt immer – KI spielt dann 2. (gelb)

function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
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

  // Falls KI sofort dran ist
  maybeAiMove();
}

function isPlayerTurn() {
  return !(mode === 'ai' && currentPlayer === 'yellow');
}

function makeMove(col) {
  if (gameOver) return;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = currentPlayer;
      updateBoard();

      if (checkWin(row, col)) {
        gameOver = true;
        status.textContent = currentPlayer + " gewinnt!";
        saveWin();
      } else {
        togglePlayer();
        maybeAiMove(); // prüfen, ob KI als nächstes dran ist
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
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 }
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

function aiMove() {
  console.table(board);
  const { column, score } = minimax(board, MAX_DEPTH, -Infinity, Infinity, true);
  console.log("KI spielt Spalte:", column, "Bewertung:", score);

  if (column !== undefined) {
    makeMove(column);
  }
}

function maybeAiMove() {
  if (!gameOver && mode === 'ai' && currentPlayer === 'yellow') {
    setTimeout(aiMove, 300);
  }
}

// Starte Spiel
createBoard();
