let cvs = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let boardRow = 6;
let boardCol = 7;
const SQ = 100;
const VACANT = 'white';
let board = [];
let p1Turn = true;
let p1Color = "red";
let p2Color = "yellow";
let colDiv = document.getElementById("button-container");
let isAnimated = false;
let gameOver = false;

function createButtons() {
  while (colDiv.childElementCount !== boardCol) {
    let i = colDiv.childElementCount;
    if (i > boardCol) {
      colDiv.lastChild.remove();
    } else if (i < boardCol) {
      colDiv.insertAdjacentHTML('beforeend',
        `<button type="button" name="col-${i + 1}" class="arrow arrow-down" id="col-${i + 1}" onmouseover="drawPreview(${i + 1})" onmouseout="undrawPiece(${i}, 0)" onclick="drop(${i + 1})"></button>`
      )
    } else {
      break;
    }
  }
}

function drawBoard(col, row) {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      drawSquare(c, r + 1, board[c][r]);
    }
  }
}

function drawSquare(x, y, color) {
  ctx.fillStyle = "#32557f";
  ctx.beginPath();
  ctx.arc(x*SQ + 0.5*SQ, y*SQ+ 0.5*SQ, 0.33*SQ, 0, 2 * Math.PI);
  ctx.rect(x*SQ + SQ, y*SQ, -SQ, SQ);
  ctx.fill();
}

function drawPiece(x, y, color) {
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

function drawPreview(x) {
  x--;
  if (board[x][0] == VACANT) {
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

function undrawPiece(x, y) {
  ctx.fillStyle = VACANT;
  ctx.strokeStyle = VACANT;
  ctx.beginPath();
  ctx.arc(x*SQ + 0.5*SQ, y*SQ + 0.5*SQ, 0.34*SQ, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drop(col) {
  if(!isAnimated) {
    col--
    let nextEmpty;
    let color;
    if (p1Turn === true) {
      color = p1Color;
    } else {
      color = p2Color;
    }
    for (var i = board[col].length; i >= 0; i--) {
      if (board[col][i] == VACANT) {
        board[col][i] = color;
        nextEmpty = i + 1;
        isAnimated = true;
        animatePiece(col, 0, color, nextEmpty)
        if (winCheck(col, i, color)) {
          alert(winCheck(col, i, color))
          gameOver = true;

        }
        isAnimated = false;
        nextTurn();
        break;
      }
    }
  }
}

function animatePiece(col, y, color, nextEmpty) {
  setTimeout(function(){
    let speed = 1/5;
    y = Math.floor(y*100)/100;
    if(y <= boardRow && y <= nextEmpty) {
      undrawPiece(col, y - speed)
      drawPiece(col, y, color);
      drawBoard(boardCol, boardRow);
      window.requestAnimationFrame(()=>{animatePiece(col, y + speed, color, nextEmpty)});
    } else {
    }
  }, 1000/60)

}

function nextTurn() {
  if (p1Turn) {
    p1Turn = false;
  } else {
    p1Turn = true;
  }
}

function winCheck(col, row, color) {
  //horizontal
  let consecutive = 0;
  let startC = (col - 3 >= 0) ? col - 3 : 0 ;
  let endC = (col + 3 < boardCol) ? col + 4 : boardCol ;
  if (endC - startC >= 3) {
    for (let i = startC; i < endC; i++) {
      if (board[i][row] == color) {
        consecutive++;
      } else {
        consecutive = 0;
      }

      if (consecutive == 4) {
        return [color + " Wins!", "horizontal", [[i - 3,row],[i - 2,row],[i - 1,row],[i,row]]];
      }
    }
  }

  //vertical
  consecutive = 0;
  let startR = (row - 3 >= 0) ? row - 3 : 0 ;
  let endR = (row + 3 < boardRow) ? row + 4 : boardRow ;
  if (endR - startR >= 3) {
    for (let i = startR; i < endR; i++) {
      if (board[col][i] == color) {
        consecutive++;
      } else {
        consecutive = 0;
      }

      if (consecutive == 4) {
        return [color + " Wins!", "vertical", [[col, i - 3],[col, i - 2],[col, i - 1],[col, i]]];
      }
    }
  }

  //diagonal win top left => bottom right
  consecutive = 0;
  let delta = 3
  for (var i = -delta; i <= delta; i++) {
    if (col + i < 0 || col + i >= boardCol || row + i < 0 || row + i >= boardRow) {
      continue;
    }
    if (board[col + i][row + i] == color) {
      consecutive++;
    } else {
      consecutive = 0;
    }

    if (consecutive == 4) {
      return [color + " Wins!", "diagonal top left => bottom right", [[col + i - 3, row + i - 3],[col + i - 2, row + i - 2],[col + i - 1, row + i - 1],[col + i, row + i]]];
    }
  }

  //diagonal win bottom left => top right
  consecutive = 0;
  for (var i = -delta; i <= delta; i++) {
    if (col + i < 0 || col + i >= boardCol || row - i < 0 || row - i >= boardRow) {
      continue;
    }
    if (board[col + i][row - i] == color) {
      consecutive++;
    } else {
      consecutive = 0;
    }

    if (consecutive == 4) {
      return [color + " Wins!", "diagonal bottom left => top right", [[col + i - 3, row - i + 3],[col + i - 2, row - i + 2],[col + i - 1, row - i + 1],[col + i, row - i]]];
    }
  }
}




function newGame() {
  gameOver = false;
  // dropStart = Date.now();
  // p = randomPiece();
  // p2 = randomPiece();

  board = [];
  for (let c = 0; c < boardCol; c++) {
    board[c] = [];
    for (let r = 0; r < boardRow; r++) {
      board[c][r] = VACANT;
    }
  }


    createButtons();
    drawBoard(boardCol, boardRow)
}




newGame();
