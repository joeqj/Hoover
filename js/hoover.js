let hooverLeftTexture = PIXI.Texture.from('assets/hoover-l.png');
let hooverRightTexture = PIXI.Texture.from('assets/hoover-r.png');
let hooverCenterTexture = PIXI.Texture.from('assets/hoover.png');

let hooverStarted = false;

let hooverHeat = 0;

let hooverCollisionWidth = 50;
let hooverCollisionOffset = 0;

let hoover = PIXI.Sprite.from(hooverCenterTexture);
hoover.position.set(0, 0);
hoover.width = 75;
hoover.height = 201;
hoover.acceleration = new PIXI.Point(0);
hoover.mass = 1;

function hooverDust(dust, collision) {
	// dust has been hoovered!
	if (mouseDown === true && hooverHeat < 100) {
		//hoover collision
		// hoover.acceleration.set(
		// 		(collision.x * dust.mass / 10),
		// 		(collision.y * dust.mass / 10),
		// );

		dust.alpha = 0.7;
		setTimeout(function () {
			dust.alpha = 0;
			dustContainer.removeChild(dust);
		}, 250);
	}
}

function updateHeat(direction, lvl) {
	if (direction === 1) {
		if (hooverHeat < 100) {
			hooverHeat += lvl;
		}
	}
	if (direction === 0) {
		if (hooverHeat > 0) {
			hooverHeat -= lvl;
		}
	}
	heatControlBarUpdate();
}

function hooverLeft() {
	hoover.texture = hooverLeftTexture;
	hoover.width = 201;
	hooverCollisionWidth = 250;
	hooverCollisionOffset = 150;
}

function hooverRight() {
	hoover.texture = hooverRightTexture;
	hoover.width = 201;
	hooverCollisionWidth = 250;
	hooverCollisionOffset = 0;
}

function hooverCenter() {
	hoover.texture = hooverCenterTexture;
	hoover.width = 75;
	hooverCollisionWidth = 50;
	hooverCollisionOffset = 0;
}
