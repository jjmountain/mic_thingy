//= require rails-ujs
//= require_tree .
// set up basic variables for app

// recorder.js code start

//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
//new audio context to help us record 
var recordButton = document.querySelector('.record');
var stopButton = document.querySelector('.stop');
var pauseButton = document.querySelector('.pause');
//add events to those 3 buttons 
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

  var paths = document.getElementsByTagName('path');
  var visualizer = document.getElementById('visualizer');
  var mask = visualizer.getElementById('mask');
  var h = document.getElementsByTagName('h1')[0];
  var path;

function startRecording() {
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();

		//update the format 
		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

    console.log("Recording started");
    
    window.persistAudioStream = stream;
      h.innerHTML = "Thanks";
      h.setAttribute('style', 'opacity: 0;');
      // var audioContent = new AudioContext();
      // var audioStream = audioContent.createMediaStreamSource( stream );
      var analyser = audioContext.createAnalyser();
      input.connect(analyser);
      analyser.fftSize = 1024;

      var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      visualizer.setAttribute('viewBox', '0 0 255 255');
    
      //Through the frequencyArray has a length longer than 255, there seems to be no
      //significant data after this point. Not worth visualizing.
      for (var i = 0 ; i < 255; i++) {
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('stroke-dasharray', '4,1');
          mask.appendChild(path);
      }
      var doDraw = function () {
          requestAnimationFrame(doDraw);
          analyser.getByteFrequencyData(frequencyArray);
          var adjustedLength;
          for (var i = 0 ; i < 255; i++) {
              adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
              paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
          }

      }

      doDraw();

	}).catch(function(err) {
      //enable the record button if getUserMedia() fails
      console.log('There was an error: ', err);
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

// end recorder.js code

var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');
var mainSection = document.querySelector('.main-controls');


// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

// var audioCtx = new (window.AudioContext || webkitAudioContext)();
// var canvasCtx = canvas.getContext("2d");

// visualiser imported setup

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
  // var au = document.createElement('audio');

  var link = document.createElement('a');
  var clipContainer = document.createElement('article');
  var deleteButton = document.createElement('button');
  var buttonContainer = document.createElement('div');
  var playButton = document.createElement('button');
  var waveform = document.createElement('waveform');
  
  
  clipContainer.classList.add('clip');
  waveform.classList.add('waveform');
  buttonContainer.classList.add('button-container');
  deleteButton.innerHTML = "Delete";
  playButton.innerHTML = "Play | Pause";
  deleteButton.classList.add('delete');
  link.classList.add('download');


	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

  //add controls to the <audio> element
	// au.controls = true;
  // au.src = url;
  // console.log(au.src);

  //save to disk link
  console.log(link.href);
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
  link.innerHTML = "Save to disk";
  

	//add the new audio element to clipContainer
  // clipContainer.appendChild(au);

  var wavesurfer = WaveSurfer.create({
    container: '.waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});

  playButton.onclick = function(e) {
    wavesurfer.playPause();
  }

  debugger;
  wavesurfer.load(url);
  waveform.appendChild(buttonContainer);
  buttonContainer.appendChild(playButton);
  buttonContainer.appendChild(deleteButton);


 
  //delete the clip if deleteButton is clicked
  deleteButton.onclick = function(e) {
    evtTgt = e.target;
    console.log(evtTgt);
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
  }

	
	//add the filename to the clipContainer
	// clipContainer.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to clipContainer
	buttonContainer.appendChild(link);
	
	//add the li element to the ol
	soundClips.appendChild(clipContainer);
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();

// Recorder.js script

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Recorder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  "use strict";
  
  module.exports = require("./recorder").Recorder;
  
  },{"./recorder":2}],2:[function(require,module,exports){
  'use strict';
  
  var _createClass = (function () {
      function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
      }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
      };
  })();
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  exports.Recorder = undefined;
  
  var _inlineWorker = require('inline-worker');
  
  var _inlineWorker2 = _interopRequireDefault(_inlineWorker);
  
  function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  
  var Recorder = exports.Recorder = (function () {
      function Recorder(source, cfg) {
          var _this = this;
  
          _classCallCheck(this, Recorder);
  
          this.config = {
              bufferLen: 4096,
              numChannels: 2,
              mimeType: 'audio/wav'
          };
          this.recording = false;
          this.callbacks = {
              getBuffer: [],
              exportWAV: []
          };
  
          Object.assign(this.config, cfg);
          this.context = source.context;
          this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);
  
          this.node.onaudioprocess = function (e) {
              if (!_this.recording) return;
  
              var buffer = [];
              for (var channel = 0; channel < _this.config.numChannels; channel++) {
                  buffer.push(e.inputBuffer.getChannelData(channel));
              }
              _this.worker.postMessage({
                  command: 'record',
                  buffer: buffer
              });
          };
  
          source.connect(this.node);
          this.node.connect(this.context.destination); //this should not be necessary
  
          var self = {};
          this.worker = new _inlineWorker2.default(function () {
              var recLength = 0,
                  recBuffers = [],
                  sampleRate = undefined,
                  numChannels = undefined;
  
              self.onmessage = function (e) {
                  switch (e.data.command) {
                      case 'init':
                          init(e.data.config);
                          break;
                      case 'record':
                          record(e.data.buffer);
                          break;
                      case 'exportWAV':
                          exportWAV(e.data.type);
                          break;
                      case 'getBuffer':
                          getBuffer();
                          break;
                      case 'clear':
                          clear();
                          break;
                  }
              };
  
              function init(config) {
                  sampleRate = config.sampleRate;
                  numChannels = config.numChannels;
                  initBuffers();
              }
  
              function record(inputBuffer) {
                  for (var channel = 0; channel < numChannels; channel++) {
                      recBuffers[channel].push(inputBuffer[channel]);
                  }
                  recLength += inputBuffer[0].length;
              }
  
              function exportWAV(type) {
                  var buffers = [];
                  for (var channel = 0; channel < numChannels; channel++) {
                      buffers.push(mergeBuffers(recBuffers[channel], recLength));
                  }
                  var interleaved = undefined;
                  if (numChannels === 2) {
                      interleaved = interleave(buffers[0], buffers[1]);
                  } else {
                      interleaved = buffers[0];
                  }
                  var dataview = encodeWAV(interleaved);
                  var audioBlob = new Blob([dataview], { type: type });
  
                  self.postMessage({ command: 'exportWAV', data: audioBlob });
              }
  
              function getBuffer() {
                  var buffers = [];
                  for (var channel = 0; channel < numChannels; channel++) {
                      buffers.push(mergeBuffers(recBuffers[channel], recLength));
                  }
                  self.postMessage({ command: 'getBuffer', data: buffers });
              }
  
              function clear() {
                  recLength = 0;
                  recBuffers = [];
                  initBuffers();
              }
  
              function initBuffers() {
                  for (var channel = 0; channel < numChannels; channel++) {
                      recBuffers[channel] = [];
                  }
              }
  
              function mergeBuffers(recBuffers, recLength) {
                  var result = new Float32Array(recLength);
                  var offset = 0;
                  for (var i = 0; i < recBuffers.length; i++) {
                      result.set(recBuffers[i], offset);
                      offset += recBuffers[i].length;
                  }
                  return result;
              }
  
              function interleave(inputL, inputR) {
                  var length = inputL.length + inputR.length;
                  var result = new Float32Array(length);
  
                  var index = 0,
                      inputIndex = 0;
  
                  while (index < length) {
                      result[index++] = inputL[inputIndex];
                      result[index++] = inputR[inputIndex];
                      inputIndex++;
                  }
                  return result;
              }
  
              function floatTo16BitPCM(output, offset, input) {
                  for (var i = 0; i < input.length; i++, offset += 2) {
                      var s = Math.max(-1, Math.min(1, input[i]));
                      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                  }
              }
  
              function writeString(view, offset, string) {
                  for (var i = 0; i < string.length; i++) {
                      view.setUint8(offset + i, string.charCodeAt(i));
                  }
              }
  
              function encodeWAV(samples) {
                  var buffer = new ArrayBuffer(44 + samples.length * 2);
                  var view = new DataView(buffer);
  
                  /* RIFF identifier */
                  writeString(view, 0, 'RIFF');
                  /* RIFF chunk length */
                  view.setUint32(4, 36 + samples.length * 2, true);
                  /* RIFF type */
                  writeString(view, 8, 'WAVE');
                  /* format chunk identifier */
                  writeString(view, 12, 'fmt ');
                  /* format chunk length */
                  view.setUint32(16, 16, true);
                  /* sample format (raw) */
                  view.setUint16(20, 1, true);
                  /* channel count */
                  view.setUint16(22, numChannels, true);
                  /* sample rate */
                  view.setUint32(24, sampleRate, true);
                  /* byte rate (sample rate * block align) */
                  view.setUint32(28, sampleRate * 4, true);
                  /* block align (channel count * bytes per sample) */
                  view.setUint16(32, numChannels * 2, true);
                  /* bits per sample */
                  view.setUint16(34, 16, true);
                  /* data chunk identifier */
                  writeString(view, 36, 'data');
                  /* data chunk length */
                  view.setUint32(40, samples.length * 2, true);
  
                  floatTo16BitPCM(view, 44, samples);
  
                  return view;
              }
          }, self);
  
          this.worker.postMessage({
              command: 'init',
              config: {
                  sampleRate: this.context.sampleRate,
                  numChannels: this.config.numChannels
              }
          });
  
          this.worker.onmessage = function (e) {
              var cb = _this.callbacks[e.data.command].pop();
              if (typeof cb == 'function') {
                  cb(e.data.data);
              }
          };
      }
  
      _createClass(Recorder, [{
          key: 'record',
          value: function record() {
              this.recording = true;
          }
      }, {
          key: 'stop',
          value: function stop() {
              this.recording = false;
          }
      }, {
          key: 'clear',
          value: function clear() {
              this.worker.postMessage({ command: 'clear' });
          }
      }, {
          key: 'getBuffer',
          value: function getBuffer(cb) {
              cb = cb || this.config.callback;
              if (!cb) throw new Error('Callback not set');
  
              this.callbacks.getBuffer.push(cb);
  
              this.worker.postMessage({ command: 'getBuffer' });
          }
      }, {
          key: 'exportWAV',
          value: function exportWAV(cb, mimeType) {
              mimeType = mimeType || this.config.mimeType;
              cb = cb || this.config.callback;
              if (!cb) throw new Error('Callback not set');
  
              this.callbacks.exportWAV.push(cb);
  
              this.worker.postMessage({
                  command: 'exportWAV',
                  type: mimeType
              });
          }
      }], [{
          key: 'forceDownload',
          value: function forceDownload(blob, filename) {
              var url = (window.URL || window.webkitURL).createObjectURL(blob);
              var link = window.document.createElement('a');
              link.href = url;
              link.download = filename || 'output.wav';
              var click = document.createEvent("Event");
              click.initEvent("click", true, true);
              link.dispatchEvent(click);
          }
      }]);
  
      return Recorder;
  })();
  
  exports.default = Recorder;
  
  },{"inline-worker":3}],3:[function(require,module,exports){
  "use strict";
  
  module.exports = require("./inline-worker");
  },{"./inline-worker":4}],4:[function(require,module,exports){
  (function (global){
  "use strict";
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);
  
  var InlineWorker = (function () {
    function InlineWorker(func, self) {
      var _this = this;
  
      _classCallCheck(this, InlineWorker);
  
      if (WORKER_ENABLED) {
        var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
        var url = global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" }));
  
        return new global.Worker(url);
      }
  
      this.self = self;
      this.self.postMessage = function (data) {
        setTimeout(function () {
          _this.onmessage({ data: data });
        }, 0);
      };
  
      setTimeout(function () {
        func.call(self);
      }, 0);
    }
  
    _createClass(InlineWorker, {
      postMessage: {
        value: function postMessage(data) {
          var _this = this;
  
          setTimeout(function () {
            _this.self.onmessage({ data: data });
          }, 0);
        }
      }
    });
  
    return InlineWorker;
  })();
  
  module.exports = InlineWorker;
  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}]},{},[1])(1)
  });