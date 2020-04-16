let dustArray = [];

dustContainer.width = rug.width;
dustContainer.height = rug.height;
dustContainer.position.x = (app.screen.width / 2) - (rug.width / 2);
dustContainer.position.y = (app.screen.height / 2) - (rug.height / 2) + 5;

function startDust() {
	dustArray = [];
	for (var i = 0; i < dustCount; i++) {
		var sprite = new PIXI.Sprite.from('assets/dust.png');
		sprite.width = 14;
		sprite.height = 14;
		sprite.acceleration = new PIXI.Point(0);
		sprite.mass = 1;
		sprite.alpha = 1;
		// sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
		sprite.name = sprite + i;

		var x = Math.ceil((Math.floor(Math.random() * rug.width - 9)) / 7) * 7;
		var y = Math.ceil((Math.floor(Math.random() * rug.height + 10)) / 7) * 7;

		sprite.position.set(x,y);
		dustArray.push(sprite);
	}
}

startDust();


function increaseDust() {
  if (dustContainer.children.length < dustCount) {
		var sprite = new PIXI.Sprite.from('assets/dust.png');
		sprite.width = 12;
		sprite.height = 12;
		sprite.acceleration = new PIXI.Point(0);
		sprite.mass = 1;
		sprite.alpha = 1;
		// sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
		sprite.name = sprite + i;

    var x = Math.ceil((Math.floor(Math.random() * rug.width - 9)) / 5) * 5;
    var y = Math.ceil((Math.floor(Math.random() * rug.height + 10)) / 5) * 5;

    sprite.position.set(x,y);
    dustArray.push(sprite);
    dustContainer.addChild(sprite);

    console.log(dustContainer.children.length);
  }
}
