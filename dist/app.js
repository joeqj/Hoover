// Based somewhat on this article by Spicy Yoghurt
const app = new PIXI.Application({
	autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor: 0x008040
});
document.querySelector('#frame').appendChild(app.view);

// How fast the hoover moves
const movementSpeed = 0.10;
// Strength of the impulse push between two objects
const impulsePower = 3;

let dustContainer = new PIXI.Container();

let dustCount = 1;

let rugStrobeBlendCounter = 0;
var rugisStrobing;

let isStageComplete = false;

let last = 0;

// Mouse events
let mouseDown = false;

document.addEventListener("mousedown", function() {
	mouseDown = true;
  document.querySelector('#frame').style.cursor = "grabbing";
});
document.addEventListener("mouseup", function() {
	mouseDown = false;
  document.querySelector('#frame').style.cursor = "grab";
});

// Resize events
window.addEventListener('resize', resize);
function resize() {
	const parent = app.view.parentNode;
	app.renderer.resize(parent.clientWidth, parent.clientHeight);
}
resize();

let rugArray = [
  PIXI.Texture.from('assets/rug1.png'),
  PIXI.Texture.from('assets/rug2.png'),
];

var currentRug = rugArray[Math.floor(Math.random() * rugArray.length)];

let rug = new PIXI.Sprite.from(currentRug);

var rugBlend = [
  PIXI.BLEND_MODES.SCREEN,
  PIXI.BLEND_MODES.MULTIPLY,
  PIXI.BLEND_MODES.SRC_IN
];

rug.width = (app.screen.width / 1.7);
rug.height = (app.screen.height / 1.5);

rug.position.x = (app.screen.width / 2) - (rug.width / 2);
rug.position.y = (app.screen.height / 2) - (rug.height / 2) + 20;

app.stage.addChild(rug);

function changeRug() {
  var newRug = rugArray[Math.floor(Math.random() * rugArray.length)];
  while (newRug === currentRug) {
    newRug = rugArray[Math.floor(Math.random() * rugArray.length)];
  }
  rug.texture = newRug;
  currentRug = newRug;
}

function rugStrobe() {
  rug.blendMode = rugBlend[Math.floor(Math.random() * rugBlend.length)];
}

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

// A basic AABB check
function testForAABB(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    bounds2.x = bounds2.x - hooverCollisionOffset;
    bounds2.y = bounds2.y + 20;

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds2.width - hooverCollisionWidth > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds2.height - 320 > bounds2.y;
}

// Calculates the results of a collision, object2 = hoover
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
	"volume" : -19,
}).connect(autoFilter).start();

const noise = new Tone.Noise({
  "type" : "pink",
  "playbackRate" : 1,
  "volume" : -25
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

var stageCompleteSound =  new Tone.Sampler({
	"C3" : "assets/complete.mp3"
}).toMaster();

stageCompleteSound.volume = -15;

function playCompleteSound() {
	stageCompleteSound.triggerAttackRelease("C3");
}

let isCompleteFunctionRun = false;

function resetGame() {
  startDust();
  hooverHeat = 0;
  app.stage.removeChild(dustContainer);
  app.stage.removeChild(hoover);
  for (var i = 0; i < dustArray.length; i++) {
  	dustContainer.addChild(dustArray[i]);
  }

  app.stage.addChild(dustContainer);
  app.stage.addChild(hoover);

  changeRug();

  // Initialise variables
  isStageComplete = false;
  isCompleteFunctionRun = false;
}

var stageComplete = (function() {
    return function() {
        if (!isCompleteFunctionRun) {
            isCompleteFunctionRun = true;
            playCompleteSound();
            rugisStrobing = setInterval(function() {
              rugStrobe();
            }, 10);
            setTimeout(function() {
              clearInterval(rugisStrobing);
              rugStrobeBlendCounter = 0;
              rug.blendMode = PIXI.BLEND_MODES.NORMAL;
              setTimeout(resetGame, 2000);
            }, 2000)
        }
    };
})();

function heatControlBarUpdate() {
  setInterval(function() {
    document.getElementById("heatStatus").style.width = hooverHeat + '%';
  }, 10);
}

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
