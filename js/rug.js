let rugArray = [
  PIXI.Texture.from('assets/rug1.png'),
  PIXI.Texture.from('assets/rug2.png'),
];

var currentRug = rugArray[Math.floor(Math.random() * rugArray.length)];

let rug = new PIXI.Sprite.from(currentRug);

var rugBlend = [
  PIXI.BLEND_MODES.SCREEN,
  PIXI.BLEND_MODES.MULTIPLY,
  PIXI.BLEND_MODES.SRC_IN
];

rug.width = (app.screen.width / 1.7);
rug.height = (app.screen.height / 1.5);

rug.position.x = (app.screen.width / 2) - (rug.width / 2);
rug.position.y = (app.screen.height / 2) - (rug.height / 2) + 20;

app.stage.addChild(rug);

function changeRug() {
  var newRug = rugArray[Math.floor(Math.random() * rugArray.length)];
  while (newRug === currentRug) {
    newRug = rugArray[Math.floor(Math.random() * rugArray.length)];
  }
  rug.texture = newRug;
  currentRug = newRug;
}

function rugStrobe() {
  rug.blendMode = rugBlend[Math.floor(Math.random() * rugBlend.length)];
}
