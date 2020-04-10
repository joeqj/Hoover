let rug = new PIXI.Graphics();

rug.beginFill(0x000000);

// draw a rectangle
rug.drawRect(0, 0, (app.screen.width / 1.7), (app.screen.height / 1.5));

rug.position.x = (app.screen.width / 2) - (rug.width / 2);
rug.position.y = (app.screen.height / 2) - (rug.height / 2) + 20;

app.stage.addChild(rug);
