let rug1 = PIXI.Texture.from('assets/rug1.png');

let rug = new PIXI.Sprite.from(rug1);

rug.width = (app.screen.width / 1.7);
rug.height = (app.screen.height / 1.5);

rug.position.x = (app.screen.width / 2) - (rug.width / 2);
rug.position.y = (app.screen.height / 2) - (rug.height / 2) + 20;

app.stage.addChild(rug);
