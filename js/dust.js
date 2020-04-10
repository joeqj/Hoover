let dustArray = [];

for (var i = 0; i < dustCount; i++) {
	var sprite = new PIXI.Sprite.from('assets/dust.png');
	sprite.width = 10;
	sprite.height = 10;
	sprite.tint = '0xffeeee';
	sprite.acceleration = new PIXI.Point(0);
	sprite.mass = 1;
	sprite.alpha = 1;
	sprite.name = sprite + i;

	var x = Math.ceil((Math.floor(Math.random() * app.screen.width)) / 5) * 5;
	var y = Math.ceil((Math.floor(Math.random() * app.screen.height)) / 5) * 5;

	sprite.position.set(x,y);
	dustArray.push(sprite);
}

var increaseDust = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            // do something
        }
    };
})();

function addDust() {
  if (dustContainer.children.length < dustCount) {
    var sprite = new PIXI.Sprite.from('assets/dust.png');
    sprite.width = 10;
    sprite.height = 10;
    sprite.tint = '0xffeeee';
    sprite.acceleration = new PIXI.Point(0);
    sprite.mass = 1;
    sprite.alpha = 1;
    sprite.name = sprite + i;

    var x = Math.ceil((Math.floor(Math.random() * app.screen.width)) / 5) * 5;
    var y = Math.ceil((Math.floor(Math.random() * app.screen.height)) / 5) * 5;

    sprite.position.set(x,y);
    dustArray.push(sprite);
    dustContainer.addChild(sprite);

    console.log(dustContainer.children.length);
  }
}
