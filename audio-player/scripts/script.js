const player = document.querySelector('audio');
const startPauseButton = document.querySelector('.play-pause-block')
const playbutton = document.querySelector('.play-button');
const pausebutton = document.querySelector('.pause-button');
const previousButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
let isPlaying = false;
let currentTrackNumber = 0;

let currentMarkerPosition = 0;
let currentTrackStep = 0;
let lastframe = 0;

//res
const tracklist = ["<source src=\"/assets/audio/beyonce.mp3\" type=\"audio/mp3\">",
				"<source src=\"/assets/audio/dontstartnow.mp3\" type=\"audio/mp3\">"]
const covers = ["<img src=\"assets/img/lemonade.png\" alt=\"image for song2\">",
					"<img src=\"assets/img/dontstartnow.png\" alt=\"image for song\">"];
const songsTitle = ["Beyonce=Don't Hurt Yourself","Dua Lipa=Don't Start Now"]

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
	
	moveProgressMarker();
})
//reload track data when we have new track
player.addEventListener("loadstart", (e)=>{ //Fired when the browser has started to load the resource.
	
	if(isPlaying){
		startPlay();
	}
	
});
 //	The first frame of the media has finished loading.
player.addEventListener("loadeddata", (e)=>{
	currentTrackStep = player.duration * 4; 
	currentMarkerPosition = 0;
	lastframe = 0;
	console.log("song duration after load", player.duration);
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
		return "00 : 00"
	}
	
	let stringRet = '';
	let min = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
	let sec = Math.floor(time % 60) < 10 ? "0" + Math.floor(time % 60) : Math.floor(time % 60);

	return stringRet = min + " : " + sec;

}

function putTrackIntoPlayer(trackNumber){
	player.innerHTML = tracklist[trackNumber];
	showCover(trackNumber);
	showTitle(trackNumber);
}

function showCover(trackNumber){
	document.querySelector(".song-cover").innerHTML = covers[trackNumber];
}

function showTitle(trackNumber){
	let artistAndTitle = songsTitle[trackNumber].split("=");
	document.querySelector(".artist").innerHTML = artistAndTitle[0];
	document.querySelector(".title").innerHTML = artistAndTitle[1];
}



function moveProgressMarker(){
	let barWidth = document.querySelector(".tape_counter").offsetWidth - 19
	const marker = document.querySelector(".marker");

	let stepInPercent = (player.currentTime - lastframe) * 100 / player.duration;
	lastframe = player.currentTime;

	currentMarkerPosition += barWidth * stepInPercent / 100;
	
	console.log(stepInPercent);

	marker.style.left = currentMarkerPosition + "px";
};