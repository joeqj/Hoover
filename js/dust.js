let dustArray = [];

dustContainer.width = rug.width;
dustContainer.height = rug.height;
dustContainer.position.x = (app.screen.width / 2) - (rug.width / 2);
dustContainer.position.y = (app.screen.height / 2) - (rug.height / 2) + 5;

for (var i = 0; i < dustCount; i++) {
	var sprite = new PIXI.Sprite.from('assets/dust.png');
	sprite.width = 10;
	sprite.height = 10;
	// sprite.tint = '0x000000';
	sprite.acceleration = new PIXI.Point(0);
	sprite.mass = 1;
	sprite.alpha = 1;
	sprite.name = sprite + i;

	var x = Math.ceil((Math.floor(Math.random() * rug.width - 9)) / 5) * 5;
	var y = Math.ceil((Math.floor(Math.random() * rug.height + 10)) / 5) * 5;

	sprite.position.set(x,y);
	dustArray.push(sprite);
}

function increaseDust() {
  if (dustContainer.children.length < dustCount) {
		var sprite = new PIXI.Sprite.from('assets/dust.png');
		sprite.width = 10;
		sprite.height = 10;
		sprite.acceleration = new PIXI.Point(0);
		sprite.mass = 1;
		sprite.alpha = 1;
		sprite.name = sprite + i;

    var x = Math.ceil((Math.floor(Math.random() * rug.width - 9)) / 5) * 5;
    var y = Math.ceil((Math.floor(Math.random() * rug.height + 10)) / 5) * 5;

    sprite.position.set(x,y);
    dustArray.push(sprite);
    dustContainer.addChild(sprite);

    console.log(dustContainer.children.length);
  }
}
