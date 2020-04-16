let isCompleteFunctionRun = false;

function resetGame() {
  startDust();
  hooverHeat = 0;
  app.stage.removeChild(dustContainer);
  app.stage.removeChild(hoover);
  for (var i = 0; i < dustArray.length; i++) {
  	dustContainer.addChild(dustArray[i]);
  }

  app.stage.addChild(dustContainer);
  app.stage.addChild(hoover);

  changeRug();

  // Initialise variables
  isStageComplete = false;
  isCompleteFunctionRun = false;
}

var stageComplete = (function() {
    return function() {
        if (!isCompleteFunctionRun) {
            isCompleteFunctionRun = true;
            playCompleteSound();
            rugisStrobing = setInterval(function() {
              rugStrobe();
            }, 10);
            setTimeout(function() {
              clearInterval(rugisStrobing);
              rugStrobeBlendCounter = 0;
              rug.blendMode = PIXI.BLEND_MODES.NORMAL;
              setTimeout(resetGame, 2000);
            }, 2000)
        }
    };
})();

function heatControlBarUpdate() {
  setInterval(function() {
    document.getElementById("heatStatus").style.width = hooverHeat + '%';
  }, 10);
}
