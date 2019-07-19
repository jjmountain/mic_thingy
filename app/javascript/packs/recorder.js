//= require rails-ujs
//= require_tree .
// set up basic variables for app
import WaveSurfer from 'wavesurfer.js';

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('#sound-clips');
var waveform = document.querySelector('#waveform')

// var mainSection = document.querySelector('.main-controls');
// var waveform_index = 1;
// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();

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
      record.style.background = "red";

      
      var clipLabel = document.createElement('p');
      // var audio = document.createElement('audio');

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
      var deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
     
      // append the delete button to the clip container
      waveform.appendChild(deleteButton);
      // append clipContainer to the dom in soundclips
      // soundClips.appendChild(clipContainer);

      // var currentContainer = `#waveform-${waveform_index}`
      // create the wavesurfer object in the clip-container
      var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
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

      waveform.appendChild(deleteButton);


      wavesurfer.load(audioURL);

      deleteButton.onclick = function(e) {
        console.log(e.target.parentNode)
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
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