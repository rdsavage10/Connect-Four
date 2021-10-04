const clickE = new Event("click", {"bubbles":true});
// document.dispatchEvent(evt);

// QUnit.test('functions exist', (assert) => {
//     assert.ok(drawBoard, "Function Exists")
//     assert.ok(drawSquare, "Function Exists")
//     assert.ok(drawPiece, "Function Exists")
//     assert.ok(createButtons, "Function Exists")
//
// });

// QUnit.test('Buttons', (assert) => {
//     for (var i = 0; i < 7; i++) {
//       assert.ok(document.getElementById("drop-button-" + i), "Button Exists")
//     }
// });
// QUnit.test('menu', (assert) => {
//     assert.ok(menu, "menu active")
// });
//
// QUnit.test('game', (assert) => {
//     document.getElementById("start").dispatchEvent(clickE);
//     assert.ok(!menu, "game active");
//
//     let boardState = [ [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ], [ "white", "white", "white", "white", "white", "white" ] ];
//     assert.deepEqual(board, boardState, "blank board");
//     document.getElementById("col-" + 1).dispatchEvent(clickE);
//     boardState[0][5] = "red";
//     assert.deepEqual(board, boardState, "board");
//     boardState[0][4] = "red";
//     boardState[0][3] = "red";
//     setTimeout(() => { document.getElementById("col-" + 2).dispatchEvent(clickE); }, 2000);
//
//
// });


// QUnit.test.todo('drawBoard', (assert) => {
//     assert.equal( drawBoard(6,7), , "square(2)" );
//
//   })
