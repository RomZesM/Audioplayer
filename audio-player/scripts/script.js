const player = document.querySelector('audio');
const startPauseButton = document.querySelector('.play-pause-block')
const playbutton = document.querySelector('.play-button');
const pausebutton = document.querySelector('.pause-button');
const previousButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
const tracklist = ["<source src=\"/assets/audio/beyonce.mp3\" type=\"audio/mp3\">",
				"<source src=\"/assets/audio/dontstartnow.mp3\" type=\"audio/mp3\">"]

let isPlaying = false;
let currentTrackNumber = 0;

//putFirsttrackAfterLoading
putTrackIntoPlayer(0);


startPauseButton.addEventListener('click', (e)=>{
		
	if(!isPlaying){
		startPlay();
	}
	else if(isPlaying){
		pausePlay();		
	}
	
})

nextButton.addEventListener('click', (event)=>{
		
		if(currentTrackNumber + 1 < tracklist.length){
			putTrackIntoPlayer(++currentTrackNumber)
			player.load();
			startPlay();
		}
		else{
			
			currentTrackNumber = 0;
			putTrackIntoPlayer(currentTrackNumber);
			player.load();
			startPlay();
		}
});


previousButton.addEventListener('click', (event)=>{
	console.log("enter");
	if(currentTrackNumber > 0){
		putTrackIntoPlayer(--currentTrackNumber)
		player.load();
		startPlay();
	}
	else if(currentTrackNumber == 0){
		
		currentTrackNumber = tracklist.length - 1;
		putTrackIntoPlayer(currentTrackNumber);
		player.load();
		startPlay();
	}
});


//add current time of track while playing
player.addEventListener("timeupdate", (e)=>{
	document.querySelector(".current_track_time").innerHTML = getCurrentTimeOfSong(player.currentTime);
	//add current track duration into player monitor
	document.querySelector(".track-duration").innerHTML = getCurrentTimeOfSong(player.duration);
})
//reload track data when we have new track
player.addEventListener("loadstart", (e)=>{
	console.log("load new track	")
	
	if(isPlaying){
		startPlay();
	}
	
});


function startPlay(){
		isPlaying = true;
		playbutton.classList.toggle('play-button-hide');
		pausebutton.classList.toggle('pause-button-visible');
		player.play();
}
function pausePlay(){
		isPlaying = false;
		playbutton.classList.toggle('play-button-hide');
		pausebutton.classList.toggle('pause-button-visible');		
		player.pause();
}

function getCurrentTimeOfSong(time){
	if(isNaN(time)){
		console.log("bugagag");
		return "00 : 00"
	}
	
	let stringRet = '';
	let min = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
	let sec = Math.floor(time % 60) < 10 ? "0" + Math.floor(time % 60) : Math.floor(time % 60);

	return stringRet = min + " : " + sec;

}

function putTrackIntoPlayer(trackNumber){
	player.innerHTML = tracklist[trackNumber];
}