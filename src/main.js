let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');
let cvs2 = document.getElementById('canvas-2');
let ctx2 = cvs2.getContext('2d');
ctx2.scale(0.2, 0.2)
let boardRow = 6;
let boardCol = 7;
const SQ = 100;
const VACANT = 'white';
let board = [];
let board2 = [];
let p1Turn = true;
let p1Color = "red";
let p2Color = "yellow";
let colDiv = document.getElementById("button-container");
let menuDiv = document.getElementById("menu");
let gameDiv = document.getElementById("game");
let arrowButtons;
let gameOver = false;
let mousehovering = 0;
let menu = true;


function createButtons() {
  while (colDiv.childElementCount !== boardCol) {
    let i = colDiv.childElementCount;
    if (i > boardCol) {
      colDiv.lastChild.remove();
    } else if (i < boardCol) {
      colDiv.insertAdjacentHTML('beforeend',
        `<button type="button" name="col-${i + 1}" class="arrow" id="col-${i + 1}" value="${i + 1}"></button>`
      )
    } else {
      break;
    }
  }
  arrowButtons = document.querySelectorAll(".arrow");
}

function drawBoard(col, row, canvas) {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      drawSquare(c, r + 1, board[c][r], canvas);
    }
  }
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

function drop(col) {
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
      animatePiece(col, 0, color, nextEmpty)
      break;
    }
  }
}

function animatePiece(col, y, color, nextEmpty) {
  setTimeout(function(){
    let speed = 1/5;
    y = Math.floor(y*100)/100;
    if(y <= boardRow && y <= nextEmpty) {
      undrawPiece(col, y - speed, ctx)
      drawPiece(col, y, color, ctx);
      drawBoard(boardCol, boardRow, ctx);
      window.requestAnimationFrame(()=>{animatePiece(col, y + speed, color, nextEmpty)});
    } else {
          arrowButtons.forEach(e => {e.disabled = false;});
          if (winCheck(col, nextEmpty - 1, color)) {
            alert(winCheck(col, nextEmpty - 1, color))
            gameOver = true;
          }
          nextTurn();
          arrowButtons.forEach(e => {
            if (e.matches(":hover")) {
              e.dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
            }
          });
    }
  }, 1000/60)

}

function menuAnimation() {
  board = [];
  for (let c = 0; c < boardCol; c++) {
    board[c] = [];
    for (let r = 0; r < boardRow; r++) {
      board[c][r] = VACANT;
    }
  }
  ctx2.clearRect(0, 0, cvs2.width * 5, cvs2.height * 5);
  drawBoard(boardCol, boardRow, ctx2);
  menuDrop()
}

function menuDrop() {
  let col = Math.floor(Math.random() * boardCol);
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
      menuAnimatePiece(col, 0, color, nextEmpty)
      break;
    }
  }
}

function menuAnimatePiece(col, y, color, nextEmpty) {
  setTimeout(function(){
    let speed = 1/5;
    y = Math.floor(y*100)/100;
    if(y <= boardRow && y <= nextEmpty) {
      undrawPiece(col, y - speed, ctx2)
      drawPiece(col, y, color, ctx2);
      drawBoard(boardCol, boardRow, ctx2);
      window.requestAnimationFrame(()=>{menuAnimatePiece(col, y + speed, color, nextEmpty)});
    } else {
          nextTurn();
          if (menu) {
            setTimeout(function() {
              menuDrop();
            }, 1000/5)
          }
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
  if (menu) {
    gameDiv.style.display = "flex";
    menuDiv.style.display = "none";
    menu = false;
  }
  gameOver = false;
  p1Turn = true;
  board = [];
  for (let c = 0; c < boardCol; c++) {
    board[c] = [];
    for (let r = 0; r < boardRow; r++) {
      board[c][r] = VACANT;
    }
  }

    createButtons();
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawBoard(boardCol, boardRow, ctx)
}

function quit() {
  gameDiv.style.display = "none";
  menuDiv.style.display = "flex";
  menu = true;
  menuAnimation();
}

colDiv.addEventListener("click", event => {
    if (event.target.className !== "arrow") {
      return;
    }
    if (event.target.disabled === false) {
      drop(event.target.value);
    }
    arrowButtons.forEach(e => {e.disabled = true;});
  }
)

colDiv.addEventListener("mouseover", event => {
    if (event.target.className !== "arrow") {
      return;
    }
    if (event.target.disabled === false) {
      mousehovering = event.target.value;
      drawPreview(event.target.value);
    }
  }
)

colDiv.addEventListener("mouseout", event => {
    if (event.target.className !== "arrow") {
      return;
    }
    mousehovering = 0;
    if (event.target.disabled === false) {
      undrawPiece(event.target.value - 1, 0, ctx);
    }
  }
)


//Title icon
menuAnimation();
