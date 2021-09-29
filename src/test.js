QUnit.test.todo('functions exist', (assert) => {
    assert.ok(drawBoard, "Function Exists")
    assert.ok(drawSquare, "Function Exists")
    assert.ok(drawPiece, "Function Exists")
    assert.ok(createButtons, "Function Exists")

});

QUnit.test.todo('Buttons', (assert) => {
    for (var i = 0; i < 7; i++) {
      assert.ok(document.getElementById("drop-button-" + i), "Button Exists")
    }
    
    assert.equal

});



// QUnit.test.todo('drawBoard', (assert) => {
//     assert.equal( drawBoard(6,7), , "square(2)" );
//
//   })
