let hooverLeftTexture = PIXI.Texture.from('assets/hoover-l.png');
let hooverRightTexture = PIXI.Texture.from('assets/hoover-r.png');
let hooverCenterTexture = PIXI.Texture.from('assets/hoover.png');

let hooverTicker = 0;
let hooverMoved = false;

let hoover = PIXI.Sprite.from(hooverCenterTexture);
hoover.position.set(0, 0);
hoover.width = 50;
hoover.height = 134;
hoover.acceleration = new PIXI.Point(0);
hoover.mass = 1;

function hooverDust(dust, collision) {
	// dust has been hoovered!
	if (mouseDown === true) {
		//hoover collision
		// hoover.acceleration.set(
		// 		(collision.x * dust.mass / 10),
		// 		(collision.y * dust.mass / 10),
		// );

		dust.alpha = 0.7;
		setTimeout(function () {
			dust.alpha = 0;
			app.stage.removeChild(dust);
		}, 250);
	}
}

function hooverLeft() {
	hoover.texture = hooverLeftTexture;
	hoover.width = 134;
}

function hooverRight() {
	hoover.texture = hooverRightTexture;
	hoover.width = 134;
}

function hooverCenter() {
	hoover.texture = hooverCenterTexture;
	hoover.width = 50;
}
