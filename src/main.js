let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');
let cvs2 = document.getElementById('canvas-2');
let ctx2 = cvs2.getContext('2d');
ctx2.scale(0.2, 0.2)
const SQ = 100;
const VACANT = 'white';
let board = [];
let board2 = [];
let menuP1Turn = true;
let p1Turn = true;
let p1Color = "red";
let p2Color = "yellow";
let twoPlayers;
let colDiv = document.getElementById("button-container");
let menuDiv = document.getElementById("menu");
let gameDiv = document.getElementById("game");
let optionDiv = document.getElementById("options");
let gameSelectDiv = document.getElementById("gameSelectDiv");
let resumeBtn = document.getElementById('resume');
let arrowButtons;
let gameOver = false;
let mousehovering = 0;
let menu = true;
let winner;
let showAnimations = true;
let difficulty = "hard"
let functionCalls = 0;
let searchDepth = 8;
let bestScore;
let bestPath;
let path

let game = {
  rows: 6,
  cols: 7,
  lastMove: null,
  board: [],
  showAnimations: true,
  difficulty: "hard",
  p1Color: "red",
  p2Color: "yellow",
  p1Turns: 0,
  p2Turns: 0,
  turns: this.p1Turns + this.p2Turns
}


function createButtons() {
  while (colDiv.childElementCount !== game.cols) {
    let i = colDiv.childElementCount;
    if (i > game.cols) {
      colDiv.lastChild.remove();
    } else if (i < game.cols) {
      colDiv.insertAdjacentHTML('beforeend', `<button type="button" name="col-${i + 1}" class="arrow" id="col-${i + 1}" value="${i + 1}"></button>`)
    } else {
      break;
    }
  }
  arrowButtons = document.querySelectorAll(".arrow");
  arrowButtons.forEach(e => {e.disabled = false;});
}

function drawSquare(x, y, color, canvas) {
  canvas.fillStyle = "#32557f";
  canvas.beginPath();
  canvas.arc(x*SQ + 0.5*SQ, y*SQ+ 0.5*SQ, 0.33*SQ, 0, 2 * Math.PI);
  canvas.rect(x*SQ + SQ, y*SQ, -SQ, SQ);
  canvas.fill();
  canvas.lineWidth = 2;
  canvas.strokeStyle = "#32557f";
  canvas.stroke();
}

function drawBoard(col, row, canvas) {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      drawSquare(c, r + 1, game.board[c][r], canvas);
    }
  }
}

function menuDrawBoard(col, row, canvas) {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      drawSquare(c, r + 1, board2[c][r], canvas);
    }
  }
}

function drawPiece(x, y, color, canvas) {
  canvas.fillStyle = color;
  canvas.strokeStyle = 'black';
  canvas.beginPath();
  canvas.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.33*SQ, 0, 2 * Math.PI);
  canvas.fill();
  canvas.stroke();
  canvas.beginPath();
  canvas.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.25*SQ, 0, 2 * Math.PI);
  canvas.stroke();
  canvas.beginPath();
  canvas.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.15*SQ, 0, 2 * Math.PI);
  canvas.stroke();
  canvas.closePath()
}

function undrawPiece(x, y, canvas) {
  canvas.lineWidth = 2;
  canvas.fillStyle = VACANT;
  canvas.strokeStyle = VACANT;
  canvas.beginPath();
  if (canvas == ctx2) {
    canvas.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.4*SQ, 0, 2 * Math.PI);
  } else {
    canvas.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.34*SQ, 0, 2 * Math.PI);
  }
  canvas.fill();
  canvas.stroke();
}

function drawPreview(x) {
  x--;
  if (game.board[x][0] == VACANT) {
    let y = 0;
    let color;
    if (p1Turn === true) {
      color = p1Color;
    } else {
      color = p2Color;
    }
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.33*SQ, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.25*SQ, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.15*SQ, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath()
  }
}

function drop(col) {
  debugger
  col--
  let nextEmpty;
  let color;
  if (p1Turn === true) {
    color = p1Color;
    game.p1Turns++
  } else {
    color = p2Color;
    game.p2Turns++
  }
  if (showAnimations) {
    for (var i = game.board[col].length; i >= 0; i--) {
      if (game.board[col][i] == VACANT) {
        game.board[col][i] = color;
        game.lastMove = [col, i];
        nextEmpty = i + 1;
        animatePiece(col, 0, color, nextEmpty)
        break;
      }
    }
  } else {
    for (var i = game.board[col].length; i >= 0; i--) {
      if (game.board[col][i] == VACANT) {
        game.board[col][i] = color;
        game.lastMove = [col, i];
        nextEmpty = i + 1;
        drawPiece(col, i + 1, color, ctx);
        drawBoard(game.cols, game.rows, ctx);
        if (winCheck(col, i, color, game.board)) {
          win()
        } else {
          nextTurn();
        }
        break;
      }
    }

  }
}

function animatePiece(col, y, color, nextEmpty) {
  setTimeout(function(){
    let speed = 1/5;
    y = Math.floor(y*100)/100;
    if(y <= game.rows && y <= nextEmpty) {
      undrawPiece(col, y - speed, ctx)
      drawPiece(col, y, color, ctx);
      drawBoard(game.cols, game.rows, ctx);
      window.requestAnimationFrame(()=>{animatePiece(col, y + speed, color, nextEmpty)});
    } else {
      if (winCheck(col, nextEmpty - 1, color, game.board)) {
        win()
      } else {
        nextTurn();
      }
    }
  }, 1000/60)

}

function menuAnimation() {
  board2 = [];
  for (let c = 0; c < game.cols; c++) {
    board2[c] = [];
    for (let r = 0; r < game.rows; r++) {
      board2[c][r] = VACANT;
    }
  }
  ctx2.clearRect(0, 0, cvs2.width * 5, cvs2.height * 5);
  menuDrawBoard(game.cols, game.rows, ctx2);
  menuDrop()
}

function menuDrop() {
  let col = Math.floor(Math.random() * game.cols);
  let nextEmpty;
  let color;
  if (menuP1Turn === true) {
    color = p1Color;
  } else {
    color = p2Color;
  }
  for (var i = board2[col].length; i >= 0; i--) {
    if (board2[col][i] == VACANT) {
      board2[col][i] = color;
      nextEmpty = i + 1;
      menuAnimatePiece(col, 0, color, nextEmpty)
      break;
    }
  }
}

function menuAnimatePiece(col, y, color, nextEmpty) {
  setTimeout(function(){
    let speed = 1/10;
    y = Math.floor(y*100)/100;
    if(y <= game.rows && y <= nextEmpty) {
      undrawPiece(col, y - speed, ctx2)
      drawPiece(col, y, color, ctx2);
      menuDrawBoard(game.cols, game.rows, ctx2);
      window.requestAnimationFrame(()=>{menuAnimatePiece(col, y + speed, color, nextEmpty)});
    } else {
          menuNextTurn();
          if (menu) {
            setTimeout(function() {
              if (menu) {
                menuDrop();
              }
            }, 1000/5)
          }
    }
  }, 1000/60)

}

function nextTurn() {

  if (p1Turn) {
    p1Turn = false;
    arrowButtons.forEach(e => {e.style.setProperty("--button-color", p2Color)})
  } else {
    p1Turn = true;
    arrowButtons.forEach(e => {e.style.setProperty("--button-color", p1Color)})
  }

  if (twoPlayers || p1Turn) {
    arrowButtons.forEach((e, i) => {
      if (game.board[i][0] === VACANT) {
        e.disabled = false;
      }

      if (e.matches(":hover") && e.disabled === false) {
        e.dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
      } else {
        e.dispatchEvent(new MouseEvent('mouseout', { 'bubbles': true }));
      }
    });
  } else {
    computerTurn(difficulty);
  }
}


function menuNextTurn() {
  if (menuP1Turn) {
    menuP1Turn = false;
  } else {
    menuP1Turn = true;
  }
}

function computerTurn(difficulty) {
  let slot;
  let open = []


  if (difficulty === "hard") {
    functionCalls = 0;
    bestScore = [0,0];
    slot = pruningAlgo(JSON.parse(JSON.stringify(game.board)));
    // console.log(bestScore);
    // console.log("algo result: "+ slot)
    slot = slot[0] + 1;
    // console.log("function calls: " + functionCalls);



  } else if (difficulty === "medium") {

    slot = negamax(game.board, 0)

  } else if (difficulty === "easy") {
  } else {
    //random
    board.forEach((item, i) => {
      if (item[0] === VACANT) {
        open.push(i + 1);
      }
    });
    slot = open[Math.floor(Math.random() * open.length)];
  }
  drop(slot);
}

function pruningAlgo(gameBoard, depth = 0, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY, maxPlayer = true, lastMove = false) {

  functionCalls++
  gameBoard = JSON.parse(JSON.stringify(gameBoard)); // get deep copy of nested array (need to replace array later because this is slow)

  // find all playable columns and add to possible move list and note what row is the next empty row
  let nextEmpty = [];
  let possibleMoves = [];
  gameBoard.forEach((col, i) => {
      nextEmpty[i] = col.lastIndexOf(VACANT);
      if (nextEmpty[i] >= 0) {
        possibleMoves.push(i)
      }
  });

  possibleMoves = possibleMoves.sort((a, b) => 0.5 - Math.random()); // randomize order of columns for searching

  // define who's turn it is and what color they are
  let maxColor;
  let minColor;
  // if (p1Turn) {
  //   maxColor = p1Color;
  //   minColor = p2Color;
  // } else {
    maxColor = p2Color;
    minColor = p1Color;
  // }

  // check for win/tie condition or for max search depth
  if (lastMove) {
    let score = (22 - (game.p2Turns + depth));
    if (winCheck(lastMove[0], lastMove[1], maxColor, gameBoard)) {
      if (score > bestScore[0]) {
        bestScore[0] = score;
        bestPath = path;
      }
      return [false, score];
    } else if (winCheck(lastMove[0], lastMove[1], minColor, gameBoard)) {
      if (-score < bestScore[1]) {
        bestScore[1] = -score;
      }
      return [false, -score];
    } else if(possibleMoves.length === 0) {
      return [false, 0];
    } else if(depth === searchDepth){
      return [false, 0];
    }
  }


  let move;
  if (maxPlayer) {
    let maxVal = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < possibleMoves.length; i++) {
      move = possibleMoves[i];
      if (depth === 0) {
        path = move;
        // console.log('path ' + i + ": " + path)
      }
      gameBoard[move][nextEmpty[move]] = maxColor;
      maxVal = Math.max(maxVal, pruningAlgo(gameBoard, depth + 1, alpha, beta, false, [move, nextEmpty[move]])[1]);
      gameBoard[move][nextEmpty[move]] = VACANT;
      alpha = Math.max(alpha, maxVal);
      if (maxVal >= beta) { // pruning unimportant nodes
        break;
      }
    }

    if (depth === 0) {
      return [bestPath, bestScore[0]];
    }

    return [move, maxVal];

  } else {
    let minVal = Number.POSITIVE_INFINITY;
    for (var i = 0; i < possibleMoves.length; i++) {
      move = possibleMoves[i];
      gameBoard[move][nextEmpty[move]] = minColor;
      minVal = Math.min(minVal, pruningAlgo(gameBoard, depth + 1, alpha, beta, true, [move, nextEmpty[move]])[1]);
      gameBoard[move][nextEmpty[move]] = VACANT;
      beta = Math.min(beta, minVal);
      if (minVal <= alpha) { // pruning unimportant nodes
        break;
      }
    }
    return [move, minVal];
  }
}

function boardConverter(board) {
  let stringBoard = [];
  for (var r = 0; r < board.length; r++) {
    let string = "";
    for (var c = 0; c < board[r].length; c++) {
      if (board[r][c] === p1Color) {
        string+= "1";
      } else if (board[r][c] === p2Color) {
        string+= "2";
      } else {
        string+="0";
      }
    }
    stringBoard[r] = string;
  }
  return stringBoard
}

function logBoardReverse(board) {
  let newBoard = [];
  for (var i = 0; i < board[0].length; i++) {
    newBoard[i] = []
    for (var j = 0; j < board.length; j++) {
      newBoard[i][j] = board[j][i];
    }
  }
  console.table(newBoard);
}

function boardReverter(stringBoard) {
  let board = [];
  for (var r = 0; r < stringBoard.length; r++) {
    let row = [];
    for (var c = 0; c < stringBoard[r].length; c++) {
      if (stringBoard[r][c] === "1") {
        row.push(p1Color)
      } else if (stringBoard[r][c] === "2") {
        row.push(p2Color)
      } else {
        row.push(VACANT)
      }
    }
    board.push(row);
  }
  return board
}


 function winCheck(col, row, color, board) {
  //horizontal
  let consecutive = 0;
  let startC = (col - 3 >= 0) ? col - 3 : 0 ;
  let endC = (col + 3 < game.cols) ? col + 4 : game.cols ;
  if (endC - startC >= 3) {
    for (let i = startC; i < endC; i++) {
      if (board[i][row] == color) {
        consecutive++;
      } else {
        consecutive = 0;
      }

      if (consecutive == 4) {
        return color;
        // return [color + " Wins!", "horizontal", [[i - 3,row],[i - 2,row],[i - 1,row],[i,row]]];
      }
    }
  }

  //vertical
  consecutive = 0;
  let startR = (row - 3 >= 0) ? row - 3 : 0 ;
  let endR = (row + 3 < game.rows) ? row + 4 : game.rows ;
  if (endR - startR >= 3) {
    for (let i = startR; i < endR; i++) {
      if (board[col][i] == color) {
        consecutive++;
      } else {
        consecutive = 0;
      }

      if (consecutive == 4) {
        // return [color + " Wins!", "vertical", [[col, i - 3],[col, i - 2],[col, i - 1],[col, i]]];
        return color;
      }
    }
  }

  //diagonal win top left => bottom right
  consecutive = 0;
  let delta = 3
  for (var i = -delta; i <= delta; i++) {
    if (col + i < 0 || col + i >= game.cols || row + i < 0 || row + i >= game.rows) {
      continue;
    }
    if (board[col + i][row + i] == color) {
      consecutive++;
    } else {
      consecutive = 0;
    }

    if (consecutive == 4) {
      // return [color + " Wins!", "diagonal top left => bottom right", [[col + i - 3, row + i - 3],[col + i - 2, row + i - 2],[col + i - 1, row + i - 1],[col + i, row + i]]];
      return color;
    }
  }

  //diagonal win bottom left => top right
  consecutive = 0;
  for (var i = -delta; i <= delta; i++) {
    if (col + i < 0 || col + i >= game.cols || row - i < 0 || row - i >= game.rows) {
      continue;
    }
    if (board[col + i][row - i] == color) {
      consecutive++;
    } else {
      consecutive = 0;
    }

    if (consecutive == 4) {
      // return [color + " Wins!", "diagonal bottom left => top right", [[col + i - 3, row - i + 3],[col + i - 2, row - i + 2],[col + i - 1, row - i + 1],[col + i, row - i]]];
      return color;
    }
  }

  return false;
}

function win() {
  gameOver = true;
  winner = p1Turn ? p1Color : p2Color;
  let winMessage = winner.charAt(0).toUpperCase() + winner.slice(1) + " Wins!";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.fill();
  ctx.fillStyle = winner;
  ctx.font = "70px Arial";
  ctx.textAlign = "center";
  ctx.fillText(winMessage, cvs.width/2, 4*SQ);
  ctx.strokeStyle = ""
  ctx.font = "70px Arial";
  ctx.strokeText(winMessage, cvs.width/2, 4*SQ);
}

function newGame(players) {
  if (menu) {
    gameDiv.style.display = "flex";
    menuDiv.style.display = "none";
    gameSelectDiv.style.display = "none";
    menu = false;
  }

  gameOver = false;
  if (!p1Turn) {
    nextTurn();
  }

  if (players === 2) {
    twoPlayers = true;
  } else {
    twoPlayers = false;
  }

  board = [];
  for (let c = 0; c < game.cols; c++) {
    game.board[c] = [];
    for (let r = 0; r < game.rows; r++) {
      game.board[c][r] = VACANT;
    }
  }

  createButtons();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawBoard(game.cols, game.rows, ctx)
}

function quit() {
  gameDiv.style.display = "none";
  menuDiv.style.display = "flex";
  menu = true;
  if (gameOver) {
    resumeBtn.style.display = "none";
  } else {
    resumeBtn.style.display = "inline";
  }
  menuAnimation();
}

function resume() {
  gameDiv.style.display = "flex";
  menuDiv.style.display = "none";
  menu = false;
}

const options = {
  show: function() {
    menuDiv.style.display = "none";
    optionDiv.style.display = "flex";
  },

  hide: function() {
    menuDiv.style.display = "flex";
    optionDiv.style.display = "none";
  },

  toggleAnimations: function() {
    if (document.getElementById('optionAnimation').innerText === "Animations: ON") {
      showAnimations = false;
      document.getElementById('optionAnimation').innerText = "Animations: OFF";
    } else {
      showAnimations = true;
      document.getElementById('optionAnimation').innerText = "Animations: ON"
    }
  }
}

const gameSelect = {
  show: function() {
    menuDiv.style.display = "none";
    gameSelectDiv.style.display = "flex";
  },

  hide: function() {
    menuDiv.style.display = "flex";
    gameSelectDiv.style.display = "none";
  }


}

colDiv.addEventListener("click", event => {
  if (event.target.className !== "arrow") {
    return;
  }
  if (event.target.disabled === false) {
    arrowButtons.forEach(e => {e.disabled = true;});
    undrawPiece(event.target.value - 1, 0, ctx);
    drop(event.target.value);
  }
})

colDiv.addEventListener("mouseover", event => {
  if (event.target.className !== "arrow") {
    return;
  }
  if (event.target.disabled === false) {
    mousehovering = event.target.value;
    drawPreview(event.target.value);
  }
})

colDiv.addEventListener("mouseout", event => {
  if (event.target.className !== "arrow") {
    return;
  }
  mousehovering = 0;
  if (event.target.disabled === false) {
    undrawPiece(event.target.value - 1, 0, ctx);
  }
})

//Run Title Screen Animation
menuAnimation();
//
// // testing area
// options.toggleAnimations()
// gameSelect.show();
// newGame(1);
// game.board[1][5] = "yellow"
// game.board[2][5] = "yellow"
// game.board[3][5] = "yellow"
// let functionCalls = 0;
// console.log(pruningAlgo(JSON.parse(JSON.stringify(game.board)), 3, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true))
// console.log("function calls: " + functionCalls)
// const clickE = new Event("click", {"bubbles":true});
// newGame();
// for (var j = 0; j < 6; j++) {
//   if (j % 2 === 0) {
//     for (let i = 1; i < 8; i++) {
//       // fastDrop(1);
//       document.getElementById("col-" + i).dispatchEvent(clickE);
//     }
//   } else {
//     for (let i = 7; i > 0; i--) {
//       // fastDrop(1);
//       document.getElementById("col-" + i).dispatchEvent(clickE);
//     }
//   }
// }
// document.getElementById("col-" + 1).dispatchEvent(clickE);
// win();
