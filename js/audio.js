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
