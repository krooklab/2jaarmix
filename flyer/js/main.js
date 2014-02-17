// var colors = ["#8DBDC7","#FFE37F","#F0C271","#E3A368","#D18461"];
var colors = ["#0A87BF","#03657F","#00F2FF","#011940","#0781E5", "#BF09A1","#13207F","#E098FF","#120040","#A841E5"];
var titleArray1 = ["LET'S","MAKE","SOME","MUSIC"];
var titleArray2 = ["MEDIA HACKATHON","Zat. 15/03","AB BRUSSEL","Inschrijven!"];
var hasStarted = false;
var interval = 0;
var currentSequence = 0;
var altSequence = 0;
var context;
var bufferLoader;
var leftArray = [false,false,false,false];
var rightArray = [false,false,false,false];
var startTime;
var tempo = 80; // BPM (beats per minute)
var eighthNoteTime = (60 / tempo) / 2;
var bufferList;
var sources = [];
var gains = [];
var backPLaying = false;
var activeBlocks = 0;
var gainNode1;
var gainNode2;

function init(){
	initSound();
	initMotionsound();
	initClickHandlers();

	$("#flow-sequencer").css("height",$(".sequence-left-group > .sequence").height()  +30);
	interval = setInterval("sequenceTick();", 468.75);

	//fastclick for mobile devices:
	FastClick.attach(document.body);
}

function initClickHandlers () {
	$(".sequence-left-group > .sequence").click(function(event){
		event.preventDefault();
		$(this).toggleClass("sequence-left");
		$(this).toggleClass("sequence-left-off");
		updateLeftArray();

		if(!hasStarted){
			// $(".title > h2").text(titleArray[currentSequence]);
			$(".title").css("background-image", "url(/img/gear.png)");
			playSound(bufferList[0],0);
			$(".title-container > span").css("font-size","10vw");
			$(".title-container > span").text(titleArray2[0]);
			// interval = setInterval("sequenceTick();", 400);
			hasStarted = true;
		}

		return false;
	});

	$(".sequence-right-group > .sequence").click(function(event){
		event.preventDefault();
		$(this).toggleClass("sequence-right");
		$(this).toggleClass("sequence-right-off");
		updateRightArray();

		if(!hasStarted){
			// $(".title > h2").text(titleArray[currentSequence]);
			$(".title").css("background-image", "url(/img/gear.png)");
			playSound(bufferList[0],0);
			$(".title-container > span").css("font-size","10vw");
			$(".title-container > span").text(titleArray2[0]);
			hasStarted = true;

		}

		return false;
	});

	$(".title").click(function(event){
		event.preventDefault();
		$(".title").hide();

		return false;
	});

	$("#helmet-left").click(function(event){
		if(hasStarted){
			activeBlocks--;
			if(activeBlocks<0)
				activeBlocks = 0;
			// console.log("helmet left");
			$(".sequence-container").css("left", activeBlocks*-50 +"%");
		}
	});

	$("#helmet-right").click(function(event){
		if(hasStarted){
			activeBlocks++;
			if(activeBlocks==4)
				activeBlocks = 3;
			// console.log("helmet right");
			$(".sequence-container").css("left", activeBlocks*-50 +"%");
		}
	});
}

function moveDiv (div, activeBlock) {
	div.css({
		        'transform': 'translate3d('+x+', '+y+', 0) scale3d(1, 1, 1)',
		   '-moz-transform': 'translate3d('+x+', '+y+', 0) scale3d(1, 1, 1)',
		'-webkit-transform': 'translate3d('+x+', '+y+', 0) scale3d(1, 1, 1)'
	});
}

function updateLeftArray(){
	$(".sequence-left-group > .sequence").each(function(i,el){
		leftArray[i] = $(el).hasClass("sequence-left");
	})
}
function updateRightArray(){
	$(".sequence-right-group > .sequence").each(function(i,el){
		rightArray[i] = $(el).hasClass("sequence-right");
	})
}

function sequenceTick(){
	if(currentSequence==3){
		currentSequence = 0;
		$("#flow-sequencer").css("height",$(".sequence-left-group > .sequence").height()  +30);
		if(hasStarted){
			if(!backPLaying){
				initBackSound1();
				initBackSound2();
				backPLaying = true;
			}

			// altSequence++;
			// if(altSequence==4)
			// 	altSequence=0
			// $(".title-container > span").text(titleArray2[altSequence]);
		}


	}else{
		currentSequence ++;
	}
	var top = parseInt($("#flow-sequencer").css("top"), 10);
	// console.log("rgb("+(Math.floor(Math.random()*128))+","+(Math.floor(Math.random()*64))+","+(Math.floor(Math.random()*255))+")");
	$("#flow-sequencer").css("top",currentSequence*$("#flow-sequencer").height() +5);
	// $("body").css("background-color",colors[Math.floor(Math.random()*colors.length)]);
	$("body").css("background-color","rgb("+(Math.floor(Math.random()*128))+","+(Math.floor(Math.random()*64))+","+(Math.floor(Math.random()*128)+128)+")");
	if(!hasStarted){
		$(".title-container > span").text(titleArray1[currentSequence]);
	}else{
		$(".title-container > span").text(titleArray2[currentSequence]);
	}


	if(leftArray[currentSequence])
		playSound(bufferList[0],startTime);
	if(rightArray[currentSequence])
		playSound(bufferList[1],startTime);
}

function initSound() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '/sounds/cdd_snare.mp3',
      '/sounds/cdd_kick.mp3',
      '/sounds/cdd_bassline.wav',
      '/sounds/cdd_sequence2.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
  startTime = context.currentTime + 0.0100;
}

function initBackSound1(){
	var source = context.createBufferSource();
	source.buffer = bufferList[2];
	source.loop = true;
	gainNode1 = context.createGainNode();
	source.connect(gainNode1);
	gainNode1.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(startTime);
}

function initBackSound2(){
	var source = context.createBufferSource();
	source.buffer = bufferList[3];
	source.loop = true;
	gainNode2 = context.createGainNode();
	source.connect(gainNode2);
	gainNode2.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(startTime+0.24);
}

function finishedLoading(_bufferList) {
	bufferList = _bufferList;
}

function playSound(buffer, time) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(time);
}

function initMotionsound () {
	var motionsound = new Motionsound({
		onLeftVolumeChanged: leftVolumeChanged,
		onRightVolumeChanged: rightVolumeChanged
	});
	motionsound.init();
}

function leftVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	// konsole.log( 'left volume: ' + Math.round(value*100)/100 );

	if(gainNode2){
		gainNode2.gain.value = value;
	}
}

function rightVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	// konsole.log( 'right volume: ' + Math.round(value*100)/100 );

	if(gainNode2){
		gainNode2.gain.value = value;
	}
}

window.onload = init;

