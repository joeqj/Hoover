// Based somewhat on this article by Spicy Yoghurt
const app = new PIXI.Application({
	autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor: 0x111111
});
document.querySelector('#frame').appendChild(app.view);

// How fast the hoover moves
const movementSpeed = 0.10;
// Strength of the impulse push between two objects
const impulsePower = 3;

let dustArray = [];
let hooverStarted = false;

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