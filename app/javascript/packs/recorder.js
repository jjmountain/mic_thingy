//= require rails-ujs
//= require_tree .
// set up basic variables for app
import WaveSurfer from 'wavesurfer.js';

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var deleteButton = document.querySelector('.delete');

deleteButton.disabled = true;

var soundClips = document.querySelector('#sound-clips');
var waveform = document.querySelector('#waveform')

// var mainSection = document.querySelector('.main-controls');
// var waveform_index = 1;
// disable stop button while not recording

stop.disabled = true;

let recording = false;

// visualiser setup - create web audio api context and canvas

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");

      let recording = !recording;
      let pauseRecordingIcon = '<i class="fas fa-pause"></i>'
        if (recording) {
          record.innerHTML = pauseRecordingIcon; 
        } else {
          record.innerHTML = '<i class="fas fa-microphone"></i>';
        };



    
      record.classList.add('playing');
      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      recording = false;
      if (recording) {
        record.innerHTML = pauseRecordingIcon; 
      } else {
        record.innerHTML = '<i class="fas fa-microphone"></i>';
      };
      stop.disabled = true;
      record.disabled = true;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      // var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      // console.log(clipName);

      // create a clip container to store wavesurfer object and delete button
      // var clipContainer = document.createElement('div');
      // clipContainer.id = 'waveform';
      // increment waveform_index for the next one
      // waveform_index ++;
      // create a delete button

      let playing = false;

      var buttonControls = document.createElement('div');
      buttonControls.classList.add('button-controls');

      var playButton = document.createElement('button');
      playButton.classList.add('play');
      let playIcon = '<i class="fas fa-play"></i>'
      let pauseIcon = '<i class="fas fa-pause"></i>'
      playButton.innerHTML = playIcon;


      var rewindButton = document.createElement('button');
      rewindButton.classList.add('rewind');
      let backwardIcon = '<i class="fas fa-backward"></i>'
      rewindButton.innerHTML = backwardIcon;

      var forwardButton = document.createElement('button');
      forwardButton.classList.add('forward');
      let forwardIcon = '<i class="fas fa-forward"></i>'
      forwardButton.innerHTML = forwardIcon;

      // append the delete button to the clip container
      buttonControls.appendChild(rewindButton);
      buttonControls.appendChild(playButton);
      buttonControls.appendChild(forwardButton);

      deleteButton.disabled = false;

      // append clipContainer to the dom in soundclips
      // soundClips.appendChild(clipContainer);

      // var currentContainer = `#waveform-${waveform_index}`
      // create the wavesurfer object in the clip-container
      var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5CD1B7',
        progressColor: '#3c8977',
        skipLength: 5.0
    });

      // if(clipName === null) {
      //   clipLabel.textContent = 'My unnamed clip';
      // } else {
      //   clipLabel.textContent = clipName;
      // }

      // clipContainer.appendChild(audio);

      // audio.controls = true;
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      // audio.src = audioURL;
      console.log("recorder stopped");
      waveform.appendChild(buttonControls);

      wavesurfer.load(audioURL);



      playButton.onclick = function(e) {
        playing = !playing;
        if (playing) {
          playButton.innerHTML = pauseIcon; 
        } else {
          playButton.innerHTML = playIcon;
        };
        wavesurfer.playPause();
      }

      wavesurfer.on('finish', function() {
        playButton.innerHTML = playIcon;
        playing = false;
      })

      rewindButton.onclick = function(e) {
        wavesurfer.skipBackward();
      }

      forwardButton.onclick = function(e) {
        wavesurfer.skipForward();
      }

      deleteButton.onclick = function(e) {
        // console.log(e.target.parentNode)
        // e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        waveform.remove();
        record.disabled = false;
        var clipContainer = document.createElement('div');
        clipContainer.id = 'waveform';
        soundClips.appendChild(clipContainer);
        waveform = document.querySelector('#waveform');
      }

      // clipLabel.onclick = function() {
      //   var existingName = clipLabel.textContent;
      //   var newClipName = prompt('Enter a new name for your sound clip?');
      //   if(newClipName === null) {
      //     clipLabel.textContent = existingName;
      //   } else {
      //     clipLabel.textContent = newClipName;
      //   }
      // }
    }

    // mediaRecorder.onstop.bind(waveform_index)

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}