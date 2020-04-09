for (var i = 0; i < 4000; i++) {
	var sprite = new PIXI.Sprite.from('assets/dust.png');
	sprite.width = 10;
	sprite.height = 10;
	sprite.tint = '0xffeeee';
	sprite.acceleration = new PIXI.Point(0);
	sprite.mass = 1;
	sprite.alpha = 1;
	sprite.name = sprite + i;

	var x = (Math.floor(Math.random() * app.screen.width));
	var y = (Math.floor(Math.random() * app.screen.width));

	sprite.position.set(x,y);
	dustArray.push(sprite);
}

// The square you move around
let hooverLeftTexture = PIXI.Texture.from('assets/hoover-l.png');
let hooverRightTexture = PIXI.Texture.from('assets/hoover-r.png');
let hooverCenterTexture = PIXI.Texture.from('assets/hoover.png');

let hoover = PIXI.Sprite.from(hooverCenterTexture);
hoover.position.set(0, 0);
hoover.width = 50;
hoover.height = 134;
hoover.acceleration = new PIXI.Point(0);
hoover.mass = 1;


// Listen for animate update
app.ticker.add((delta) => {
    // Applied deacceleration for both squares, done by hooverucing the
    // acceleration by 0.01% of the acceleration every loop
    hoover.acceleration.set(hoover.acceleration.x * 0.99, hoover.acceleration.y * 0.99);
		for (var i = 0; i < dustArray.length; i++) {
			dustArray[i].acceleration.set(dustArray[i].acceleration.x * 0.93, dustArray[i].acceleration.y * 0.93);
		}

    const mouseCoords = app.renderer.plugins.interaction.mouse.global;

    // Check whether the dust ever moves off the screen
		for (var i = 0; i < dustArray.length; i++) {
			if (dustArray[i].x < 0 || dustArray[i].x > (app.screen.width - 20)) {
	        dustArray[i].acceleration.x = -dustArray[i].acceleration.x;
	    }
		}

		for (var i = 0; i < dustArray.length; i++) {
			if (dustArray[i].y < 0 || dustArray[i].y > (app.screen.height - 20)) {
	        dustArray[i].acceleration.y = -dustArray[i].acceleration.y;
	    }
		}

    // If the dust pops out of the cordon, it pops back into the middle
		for (var i = 0; i < dustArray.length; i++) {
			if ((dustArray[i].x < -20 || dustArray[i].x > (app.screen.width + 20))
	        || dustArray[i].y < -20 || dustArray[i].y > (app.screen.height + 20)) {
	        app.stage.removeChild(dustArray[i]);
	    }
		}


    // If the mouse is off screen, then don't update any further
    if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
        || app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
        // Get the hoover's center point
        const hooverCenterPosition = new PIXI.Point(
            hoover.x + (hoover.width * 0.5),
            hoover.y + (hoover.height * 0.05),
        );

        // Calculate the direction vector between the mouse pointer and
        // the hoover
        const toMouseDirection = new PIXI.Point(
            mouseCoords.x - hooverCenterPosition.x,
            mouseCoords.y - hooverCenterPosition.y,
        );

        // Use the above to figure out the angle that direction has
        const angleToMouse = Math.atan2(
            toMouseDirection.y,
            toMouseDirection.x,
        );

        // Figure out the speed the square should be travelling by, as a
        // function of how far away from the mouse pointer the hoover is
        const distMousehoover = distanceBetweenTwoPoints(
            mouseCoords,
            hooverCenterPosition,
        );

        const hooverSpeed = distMousehoover * movementSpeed;

        // Calculate the acceleration of the hoover
        hoover.acceleration.set(
            Math.cos(angleToMouse) * hooverSpeed,
            Math.sin(angleToMouse) * hooverSpeed,
        );

				if (hooverCenterPosition.x > mouseCoords.x + 15 && hooverSpeed > 2) {
					hoover.texture = hooverLeftTexture;
					hoover.width = 134;
				} else if (hooverCenterPosition.x < mouseCoords.x && hooverSpeed > 4) {
					hoover.texture = hooverRightTexture;
					hoover.width = 134;
				} else {
					hoover.texture = hooverCenterTexture;
					hoover.width = 50;
				}

        // if (mouseDown === true && hooverSpeed > 1 && hooverSpeed < 20) {
        //   startHoover();
        // } else {
        //   stopHoover();
        // }

				if (mouseDown === true) {
          startHoover();
        } else {
          stopHoover();
        }
    }



    // Colliding
    for (var i = 0; i < dustArray.length; i++) {
			if (testForAABB(dustArray[i], hoover)) {
	      if (dustArray[i].alpha > 0.5) {
	        // Calculate the changes in acceleration that should be made between
	        // each square as a result of the collision
	        let collisionPush = collisionResponse(dustArray[i], hoover);
	        // Set the changes in acceleration for dust
	        dustArray[i].acceleration.set(
	            (collisionPush.x * hoover.mass / 10),
	            (collisionPush.y * hoover.mass / 10),
	        );
	        hooverDust(dustArray[i], collisionPush);
	      }
	    }
    }

		for (var i = 0; i < dustArray.length; i++) {
			dustArray[i].x += dustArray[i].acceleration.x * delta / 2;
	    dustArray[i].y += dustArray[i].acceleration.y * delta;
		}

    hoover.x += hoover.acceleration.x * delta;
    hoover.y += hoover.acceleration.y * delta;
});

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

// Add to stage
for (var i = 0; i < dustArray.length; i++) {
	app.stage.addChild(dustArray[i]);
}
app.stage.addChild(hoover);
