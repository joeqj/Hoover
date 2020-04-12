function resetGame() {
  startDust();
  hooverHeat = 0;
  for (var i = 0; i < dustArray.length; i++) {
  	dustContainer.addChild(dustArray[i]);
  }

  app.stage.addChild(dustContainer);
}

var stageComplete = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            playCompleteSound();
            setTimeout(resetGame, 5000);
        }
    };
})();
