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
