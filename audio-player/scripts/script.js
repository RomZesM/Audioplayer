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
const songcover = document.querySelector(".song-cover");


player.volume = 0.75;
let isPlaying = false;
let currentTrackNumber = 0;

let currentMarkerPosition = 0;
let currentTrackStep = 0;
let lastframe = 0;

//res
const tracklist = ["<source src=\"assets/audio/01-prekrasnoe-daleko.ogg\" type=\"audio/ogg\">",
				"<source src=\"assets/audio/02-v-poslednuu-osen.ogg\" type=\"audio/ogg\">",
				"<source src=\"assets/audio/03-vera.ogg\" type=\"audio/ogg\">",
				"<source src=\"assets/audio/04-vechno-molodoy.ogg\" type=\"audio/ogg\">"]

const covers = ["<img src=\"assets/img/01-prekrasnoe.jpg\" alt=\"image for song\">",
				"<img src=\"assets/img/02-osen.jpg\" alt=\"image for song\">",
				"<img src=\"assets/img/03-vera.jpg\" alt=\"image for song\">",
				"<img src=\"assets/img/04-molod.jpg\" alt=\"image for song\">"];

const songsTitle = ["АйЛетов=Прекрасное далеко","АйЛетов, АйЦой, АйГоршенев=В последнюю осень","АйЛетов=Салют Вера", "АйЦой=Вечно молодой"]

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
// player.addEventListener("loadstart", (e)=>{ //Fired when the browser has started to load the resource.
	
// 	if(isPlaying){
// 		startPlay();
// 	}
	
// });
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
		
		clickPlaylist()
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
	//background-image: url(/assets/img/01-prekrasnoe.jpg);

	//console.log(`url(/${covers[trackNumber].split("\"")[1]})`);
	document.body.style.backgroundImage = `url(${covers[trackNumber].split("\"")[1]})`
	
	songcover.innerHTML = covers[trackNumber];
	
}

function showTitle(trackNumber){
	const artistName = document.querySelector(".artist");
	const songTitle = document.querySelector(".title");
	
	let artistAndTitle = songsTitle[trackNumber].split("=");
	artistName.innerHTML = artistAndTitle[0];
	if(artistAndTitle[0].length > 16){
		artistName.classList.add("text-animated");
	}	
	else{
		artistName.classList.remove("text-animated");
	}
	songTitle.innerHTML = artistAndTitle[1];
	//console.log("leng", artistAndTitle[1].length, "title", artistAndTitle);
	if(artistAndTitle[1].length > 16){
		songTitle.classList.add("text-animated");
	}	
	else{
		songTitle.classList.remove("text-animated");
	}
	
}



function moveProgressMarker(){
	let barWidth = tape_counter.offsetWidth - 27
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
	//console.log(player.volume);
	let barHeight = (window.getComputedStyle(volume_bar).height);
	let clickY = parseInt(barHeight) - event.offsetY;
	
	let newVolume = clickY / parseInt(barHeight);
	
	player.volume = newVolume;
	//change color depending on current color
	volume_slider.style.height = newVolume * 100 + '%';
	
	//console.log(player.volume);
});

//choose track from playlist
function playlistInit(){
	let generatedList = '';
	for (let i = 0; i < songsTitle.length; i++) {
		const element = songsTitle[i].split('=')
		let li = '';
		let songName = element[0] + ' - ' + element[1];
		li = `<li class="song-${i}">${songName}</li>`
		generatedList = generatedList.concat(' ', li);
	}
	playlist.innerHTML = generatedList;
	//add event listenert for every song
	const songlist = playlist.querySelectorAll('li');
	for (let i = 0; i < songlist.length; i++) {
		const element = songlist[i];
		element.addEventListener("click", (event)=>{
			
			
			//event.target.classList.add("selected-song")//mark selected song
			//markSongsInPlaylist(event.target);
			let songNumber = event.target.classList[0].split('-')[1];//get song number from track
			currentTrackNumber = songNumber;
			putTrackIntoPlayer(songNumber);
			player.load();
			startPlay();
		});
	}
	


}

function markSongsInPlaylist(currentSong){
	//console.log(currentTrackNumber);
	const songlist = playlist.querySelectorAll('li')
	songlist.forEach(element => {
		element.classList.remove("selected-song");
	});
	currentSong.classList.add("selected-song");
}

function clickPlaylist(){
	const songlist = playlist.querySelectorAll('li')
	markSongsInPlaylist(songlist[currentTrackNumber]);
}

	//event listener for song ending, play next
player.addEventListener("ended", (event)=>{
	//console.log("song end");
	nextButton.click();
})