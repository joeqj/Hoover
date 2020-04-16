// Animate!
app.ticker.add((delta) => {
    // Applied deacceleration for both squares, done by hooverucing the
    // acceleration by 0.01% of the acceleration every loop
    hoover.acceleration.set(hoover.acceleration.x * 0.99, hoover.acceleration.y * 0.99);

    const mouseCoords = app.renderer.plugins.interaction.mouse.global;

		for (var i = 0; i < dustArray.length; i++) {
			dustArray[i].acceleration.set(dustArray[i].acceleration.x * 0.93, dustArray[i].acceleration.y * 0.93);

      if (dustArray[i].y < (rug.position.y - 120) || dustArray[i].y > (rug.position.y + rug.height - 80)) {
	       dustContainer.removeChild(dustArray[i]);
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

				if (hooverCenterPosition.x > mouseCoords.x + 75 && distMousehoover > 30) {
					hooverLeft();
				} else if (hooverCenterPosition.x < mouseCoords.x - 55 && distMousehoover > 30) {
					hooverRight();
				} else {
					setTimeout(hooverCenter, 10);
				}

				if (mouseDown === true) {
          startHoover();
          updateHeat(1, 0.2);
        } else {
          stopHoover();
          updateHeat(0, 0.1);
        }

        // check for end of stage
        if (dustContainer.children.length === 0) {
          isStageComplete = true;
        }

        if (isStageComplete === false) {
          // every 2 seconds
          if(!last || app.ticker.lastTime - last >= 1*2000) {
  	        last = app.ticker.lastTime;
  					increaseDust();
  		    }
        } else {
          // stage complete
          stageComplete();
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

// Add to stage
for (var i = 0; i < dustArray.length; i++) {
	dustContainer.addChild(dustArray[i]);
}

app.stage.addChild(dustContainer);
app.stage.addChild(hoover);
