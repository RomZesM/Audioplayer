const player = document.querySelector('audio');
const startPauseButton = document.querySelector('.play-pause-block')
const playbutton = document.querySelector('.play-button');
const pausebutton = document.querySelector('.pause-button');
const previousButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
const tape_counter = document.querySelector(".tape_counter");
const volume_bar = document.querySelector('.volume-bar');
const volume_slider = document.querySelector('.volume-slider');
const playlist = document.querySelector('.playlist');


player.volume = 0.75;
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
const songsTitle = ["Beyonce=Don't Hurt Yourself-somesomesomesomesoem","Dua Lipa=Don't Start Now"]

//putFirsttrackAfterLoading
putTrackIntoPlayer(0);
playlistInit();


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
	
});


function startPlay(){
		isPlaying = true;
		playbutton.classList.add('play-button-hide');
		pausebutton.classList.add('pause-button-visible');
		player.play();
}
function pausePlay(){
		isPlaying = false;
		playbutton.classList.remove('play-button-hide');
		pausebutton.classList.remove('pause-button-visible');		
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
	const artistName = document.querySelector(".artist");
	const songTitle = document.querySelector(".title");
	
	let artistAndTitle = songsTitle[trackNumber].split("=");
	artistName.innerHTML = artistAndTitle[0];
	if(artistAndTitle[0].length > 20){
		artistName.classList.add("text-animated");
	}	
	else{
		artistName.classList.remove("text-animated");
	}
	songTitle.innerHTML = artistAndTitle[1];
	console.log("leng", artistAndTitle[1].length);
	if(artistAndTitle[1].length > 20){
		songTitle.classList.add("text-animated");
	}	
	else{
		songTitle.classList.remove("text-animated");
	}
	
}



function moveProgressMarker(){
	let barWidth = tape_counter.offsetWidth - 19
	const marker = document.querySelector(".marker");
	//count time between frames (depend on 'timeupdate' event)
	let stepInPercent = (player.currentTime - lastframe) * 100 / player.duration;
	lastframe = player.currentTime;

	currentMarkerPosition += barWidth * stepInPercent / 100;

	marker.style.left = currentMarkerPosition + "px";
};
//skip around track
tape_counter.addEventListener('click', (event)=> {
	let barWidth = (window.getComputedStyle(tape_counter).width);
	let clickX = event.offsetX; //get cirrent click coordinate
	let timeToSeek = clickX / parseInt(barWidth) * player.duration; 
	player.currentTime = timeToSeek;
	
})

//volume regulator
volume_bar.addEventListener('click', (event)=>{
	console.log(player.volume);
	let barHeight = (window.getComputedStyle(volume_bar).height);
	let clickY = parseInt(barHeight) - event.offsetY;
	
	let newVolume = clickY / parseInt(barHeight);
	
	player.volume = newVolume;
	//change color depending on current color
	volume_slider.style.height = newVolume * 100 + '%';
	
	console.log(player.volume);
});

//choose track from playlist
function playlistInit(){
	let generatedList = '';
	for (let i = 0; i < songsTitle.length; i++) {
		const element = songsTitle[i].split('=')
		let songName = element[0] + ' - ' + element[1];
		
		let li = `<li class="song-${i}">${songName}</li>`
		
		generatedList = generatedList.concat(' ', li);
	}
	playlist.innerHTML = generatedList;
	//add event listenert for every song
	const songlist = playlist.querySelectorAll('li');
	for (let i = 0; i < songlist.length; i++) {
		const element = songlist[i];
		element.addEventListener("click", (event)=>{
			let songNumber = event.target.classList[0].split('-')[1];//get song number from track
			//console.log(); 
			putTrackIntoPlayer(songNumber);
			player.load();
			startPlay();
		});
	}
	
	//console.log(songlist);
}

