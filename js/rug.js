let rug1 = PIXI.Texture.from('assets/rug1.png');

let rug = new PIXI.Sprite.from(rug1);

var blendCounter = 0;
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

function rugStrobe() {
  if (blendCounter < 10000) {
    rug.blendMode = rugBlend[Math.floor(Math.random() * rugBlend.length)];
  } else {
    rug.blendMode = PIXI.BLEND_MODES.NORMAL;
  }
  blendCounter++;
}
