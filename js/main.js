// Based somewhat on this article by Spicy Yoghurt
const app = new PIXI.Application({
	autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor: 0x111111
});
document.querySelector('#frame').appendChild(app.view);

// Options for how objects interact
// How fast the hoover moves
const movementSpeed = 0.10;

// Strength of the impulse push between two objects
const impulsePower = 3;

let vCollision;
let vCollisionNorm;

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

    vCollision = new PIXI.Point(
        object2.x - object1.x,
        object2.y - object1.y,
    );

    const distance = Math.sqrt(
        (object2.x - object1.x) * (object2.x - object1.x)
        + (object2.y - (object1.y)) * (object2.y - object1.y),
    );

    vCollisionNorm = new PIXI.Point(
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
const dust = new PIXI.Sprite(PIXI.Texture.WHITE);
dust.position.set((app.screen.width) / 2, (app.screen.height) / 2);
dust.width = 10;
dust.height = 10;
dust.tint = '0xffd500';
dust.acceleration = new PIXI.Point(0);
dust.mass = 3;
dust.alpha = 1;

// The square you move around
const hoover = PIXI.Sprite.from('img/hoover.png');
hoover.position.set(0, 0);
hoover.width = 50;
hoover.height = 134;
hoover.acceleration = new PIXI.Point(0);
hoover.mass = 0.3;

// Listen for animate update
app.ticker.add((delta) => {
    // Applied deacceleration for both squares, done by hooverucing the
    // acceleration by 0.01% of the acceleration every loop
    hoover.acceleration.set(hoover.acceleration.x * 0.99, hoover.acceleration.y * 0.99);
    dust.acceleration.set(dust.acceleration.x * 0.93, dust.acceleration.y * 0.93);

    const mouseCoords = app.renderer.plugins.interaction.mouse.global;

    // Check whether the dust ever moves off the screen
    if (dust.x < 0 || dust.x > (app.screen.width - 20)) {
        dust.acceleration.x = -dust.acceleration.x;
    }

    if (dust.y < 0 || dust.y > (app.screen.height - 20)) {
        dust.acceleration.y = -dust.acceleration.y;
    }

    // If the dust pops out of the cordon, it pops back into the middle
    if ((dust.x < -30 || dust.x > (app.screen.width + 30))
        || dust.y < -30 || dust.y > (app.screen.height + 30)) {
        dust.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
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

        if (hooverSpeed > 1 && hooverSpeed < 20) {
          startHoover();
        } else {
          stopHoover();
        }
    }

    // Colliding
    if (testForAABB(dust, hoover)) {
        if (dust.alpha > 0.5) {
          // Calculate the changes in acceleration that should be made between
          // each square as a result of the collision
          let collisionPush = collisionResponse(dust, hoover);
          // Set the changes in acceleration for both squares
          hoover.acceleration.set(
              (collisionPush.x * dust.mass),
              (collisionPush.y * dust.mass),
          );
          dust.acceleration.set(
              -(collisionPush.x * hoover.mass),
              -(collisionPush.y * hoover.mass),
          );

          // dust has been hoovered!
          dust.alpha = 0.7;
          setTimeout(function () {
            dust.alpha = 0;
            app.stage.removeChild(dust);
          }, 250);
        }
    }

    dust.x += dust.acceleration.x * delta / 2;
    dust.y += dust.acceleration.y * delta;

    hoover.x += hoover.acceleration.x * delta;
    hoover.y += hoover.acceleration.y * delta;
});

// Add to stage
app.stage.addChild(dust, hoover);

// Resize canvas
window.addEventListener('resize', resize);

function resize() {
	const parent = app.view.parentNode;
	app.renderer.resize(parent.clientWidth, parent.clientHeight);
}

resize();

// Audio
const synth = new Tone.AMSynth().toMaster();
synth.set({
  "harmonicity" : 3,
  "detune" : 10,
  "oscillator" : {
    "type" : "triangle"
  } ,
	"envelope" : {
		"attack" : 0.3,
    "sustain": 1,
    "release": 6
	},
  "modulation" : {
    "type" : "sawtooth"
  } ,
  "modulationEnvelope" : {
    "attack" : 0.5 ,
    "decay" : 0 ,
    "sustain" : 1 ,
    "release" : 6
  }
});

synth.volume.value = -5;

let started = false;

function startHoover() {
  //play a middle 'C' for the duration of an 8th note
  if (started === false) {
    synth.triggerAttack("D4");
    started = true;
  }
}

function stopHoover() {
  if (started === true) {
    synth.triggerRelease();
    started = false;
  }
}

if (Tone.context.state !== 'running') {
  Tone.context.resume();
  console.log("yo");
}
