const player = document.querySelector('audio');
const startPauseButton = document.querySelector('.play-pause-block')
const playbutton = document.querySelector('.play-button');
const pausebutton = document.querySelector('.pause-button');
const previousButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
const tape_counter = document.querySelector(".tape_counter");
const tapeMarker = document.querySelector(".marker");
const volume_bar = document.querySelector('.volume-bar');
const volume_slider = document.querySelector('.volume-slider');
const playlist = document.querySelector('.playlist');
const songcover = document.querySelector(".song-cover");


player.volume = 0.75;
let isPlaying = false;
let wasMarkerDragged = false;
let isDown = false; //check if we drag a marker
let mousePositionX = 0; //save last position of warker before we release the button
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
	animateSpeakers();
});

player.addEventListener("loadeddata", (e)=>{
	currentTrackStep = player.duration * 4; 
	currentMarkerPosition = 0;
	lastframe = 0;
	
});


function startPlay(){
		isPlaying = true;
		playbutton.classList.add('play-button-hide');
		pausebutton.classList.add('pause-button-visible');
		initAudioContext();//init analiz of musuc for beat
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
	if(artistAndTitle[0].length > 25){
		artistName.classList.add("text-animated");
	}	
	else{
		artistName.classList.remove("text-animated");
	}
	songTitle.innerHTML = artistAndTitle[1];
	//console.log("leng", artistAndTitle[1].length, "title", artistAndTitle);
	if(artistAndTitle[1].length > 25){
		songTitle.classList.add("text-animated");
	}	
	else{
		songTitle.classList.remove("text-animated");
	}
	
}



function moveProgressMarker(){
	
	if(!isDown){//move it only if we don't drag a marker
		let barWidth = tape_counter.offsetWidth - 22
		const marker = document.querySelector(".marker");

		//count time between frames (depend on 'timeupdate' event)
		let stepInPercent = (player.currentTime - lastframe) * 100 / player.duration;
		lastframe = player.currentTime;

		currentMarkerPosition += barWidth * stepInPercent / 100;

		marker.style.left = currentMarkerPosition + "px";
	}
	
};
//skip around track
tape_counter.addEventListener('click', (event)=> {
	
	
	if(!wasMarkerDragged){ //prevent skip track if we click on tome tracker while dragging
		skipTrackAccortingMarker(event.offsetX);
		isDown = false;
	}

	
})

function skipTrackAccortingMarker(point){
	console.log("skip_accord", point);
	isDown = false;
	let barWidth = (window.getComputedStyle(tape_counter).width);
	let timeToSeek = point / parseInt(barWidth) * player.duration; 
	player.currentTime = timeToSeek;
	
	setTimeout(()=>{//need little timeout, to return our "seek_by_click" functionality
		wasMarkerDragged = false;
	},20)
}




tapeMarker.addEventListener("mousedown", (event)=>{
	isDown = true;
	wasMarkerDragged = true;//need to prevent skipping song after click into tapecounter
 }, true);

//drag marker
tapeMarker.addEventListener("mousemove", function (e) {
    let bounds = tape_counter.getBoundingClientRect(); //get bounds of parent element
    let x = e.clientX - bounds.left; //calculate mouse position according to parent element
	
	if(x > 400){//boundries correction
		x = 385;		
	}
	if( x < 0){
		x = 10;
	}
		
	if(isDown){//change position of marker while dragging marker
		mousePositionX = x;
		tapeMarker.style.left = (x-10) + 'px';		
   		
	}
	
});

tapeMarker.addEventListener("mouseup", (event)=>{
	
	isDown = false; //flag that we dont drag anymore
	skipTrackAccortingMarker(mousePositionX); //skip to last marker position
	}, true);

//try to check when we leave dragging zone
tape_counter.addEventListener('mouseout', (event)=>{
	isDown = false;
	wasMarkerDragged = false;
})


//volume regulator
volume_bar.addEventListener('click', (event)=>{
	
	let barHeight = (window.getComputedStyle(volume_bar).height);
	let clickY = parseInt(barHeight) - event.offsetY;
	
	let newVolume = clickY / parseInt(barHeight);
	
	player.volume = newVolume;
	//change color depending on current color
	volume_slider.style.height = newVolume * 100 + '%';
	
	

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





//test create music analizer
let dataArray = new Array()
let analyser = null;
let audioSource = null

function initAudioContext(){
	const audioCtx = new window.AudioContext;
	if(audioSource === null){
		audioSource = audioCtx.createMediaElementSource(player);
		analyser = audioCtx.createAnalyser();
		audioSource.connect(analyser);
		analyser.connect(audioCtx.destination);
			//get info from analizer
		analyser.fftSize = 128;
		const bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
	}
	
}



let c01 = 0;
let c02 = 1;
let c03 = 2;
let c04 = 3;
let c05 = 4;


function touchStarted() {
	getAudioContext().resume();
  }

  const speaker1 = document.querySelector(".speaker-01");
  const speaker2 = document.querySelector(".speaker-02");
  const speaker3 = document.querySelector(".speaker-03");
  const speaker4 = document.querySelector(".speaker-04");
  const speaker5 = document.querySelector(".speaker-05");

  function animateSpeakers(){
	analyser.getByteFrequencyData(dataArray);
	
	let sum = 0;
	dataArray.forEach(element => {
		sum += element;
	});	
	
	speaker1.style.transform = `scale(1.0${dataArray[11]})`
	speaker2.style.transform = `scale(1.0${dataArray[12]})`
	speaker3.style.transform = `scale(1.0${dataArray[13]})`
	speaker4.style.transform = `scale(1.0${dataArray[14]})`
	speaker5.style.transform = `scale(1.0${dataArray[11]})`
	setTimeout(() => {
		 speaker1.style.transform = `scale(1.0${dataArray[11]/2})`
		 speaker2.style.transform = `scale(1.0${dataArray[12]/2})`
		 speaker3.style.transform = `scale(1.0${dataArray[13]/2})`
		 speaker4.style.transform = `scale(1.0${dataArray[14]/2})`
		 speaker5.style.transform = `scale(1.0${dataArray[11]/2})`
		}, 20)

	
	//console.log(dataArray);
  }
  
//   speaker2.addEventListener("click", (e)=>{
// 		c01++;
// 		c02++;
// 		c03++;
// 		c04++;
// 		c05++;
// 		console.log(c01, c02, c03);
//   })

  speaker3.addEventListener("click", (e)=>{
	console.log("in");
	initAudioContext();
})

//speaker3.click();