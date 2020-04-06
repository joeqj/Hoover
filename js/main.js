// Based somewhat on this article by Spicy Yoghurt
const app = new PIXI.Application({
	autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor: 0x111111
});
document.querySelector('#frame').appendChild(app.view);

// Resize canvas
window.addEventListener('resize', resize);

function resize() {
	const parent = app.view.parentNode;
	app.renderer.resize(parent.clientWidth, parent.clientHeight);
}

resize();


// Options for how objects interact
// How fast the hoover moves
const movementSpeed = 0.10;

let hooverStarted = false;

// Strength of the impulse push between two objects
const impulsePower = 3;

let mouseDown = false;

document.addEventListener("mousedown", function() {
	mouseDown = true;
});
document.addEventListener("mouseup", function() {
	mouseDown = false;
});

// Test For Hit
// A basic AABB check between two different squares
function testForAABB(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds2.width - 38 > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds2.height - 220 > bounds2.y;
}

// Calculates the results of a collision, object2 is hoover
function collisionResponse(object1, object2) {
    if (!object1 || !object2) {
        return new PIXI.Point(0);
    }

    const vCollision = new PIXI.Point(
        object2.x - object1.x,
        object2.y - object1.y,
    );

    const distance = Math.sqrt(
        (object2.x - object1.x) * (object2.x - object1.x)
        + (object2.y - (object1.y)) * (object2.y - object1.y),
    );

    const vCollisionNorm = new PIXI.Point(
        vCollision.x / distance,
        vCollision.y / distance,
    );

    const vRelativeVelocity = new PIXI.Point(
        object1.acceleration.x - object2.acceleration.x,
        object1.acceleration.y - object2.acceleration.y,
    );

    const speed = vRelativeVelocity.x * vCollisionNorm.x
        + vRelativeVelocity.y * vCollisionNorm.y;

    const impulse = impulsePower * speed / (object1.mass + object2.mass);

    return new PIXI.Point(
        impulse * vCollisionNorm.x,
        impulse * vCollisionNorm.y,
    );
}

// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
}

// The dust we will knock about
let dustArray = [];

for (var i = 0; i < 3000; i++) {
	var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
	sprite.width = 10;
	sprite.height = 10;
	sprite.tint = '0x008b8b';
	sprite.acceleration = new PIXI.Point(0);
	sprite.mass = 1;
	sprite.alpha = 1;
	sprite.name = sprite + i;

	sprite.position.set((Math.floor(Math.random() * app.screen.width)), (Math.floor(Math.random() * app.screen.width)));
	dustArray.push(sprite);
}

// The square you move around
const hoover = PIXI.Sprite.from('assets/hoover.png');
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
            hoover.y + (hoover.height * 0.5),
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

// Audio
const mono = new Tone.Mono().toMaster();

const env = new Tone.AmplitudeEnvelope({
	"attack" : 0.5,
	"decay" : 0.21,
	"sustain" : 1,
	"release" : 2,
}).connect(mono);

var autoFilter = new Tone.AutoFilter({
  frequency : 2000 ,
  type : "sine" ,
  depth : 1 ,
  baseFrequency : 2000 ,
  octaves : 3.6 ,
  filter : {
    type : "lowpass" ,
    rolloff : -12 ,
    Q : 1
  }
}).connect(env).start();

const osc1 = new Tone.Oscillator({
	"type" : "sine",
	"frequency" : "G4",
	"volume" : -29,
}).connect(autoFilter).start();

const noise = new Tone.Noise({
  "type" : "pink",
  "playbackRate" : 1,
  "volume" : -35
}).connect(autoFilter).start();

function startHoover() {
  //play a middle 'C' for the duration of an 8th note
  if (hooverStarted === false) {
    env.triggerAttack();
    hooverStarted = true;
  }
}

function stopHoover() {
  if (hooverStarted === true) {
    env.triggerRelease();
    hooverStarted = false;
  }
}

if (Tone.context.state !== 'running') {
  Tone.context.resume();
  console.log("yo");
}
