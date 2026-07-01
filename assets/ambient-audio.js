(function(){
  'use strict';

  // Find this script's URL so audio path can be relative to the script file
  var script = document.currentScript || (function(){
    var s = document.getElementsByTagName('script');
    return s[s.length-1];
  })();

  var audioUrl;
  try {
    audioUrl = script ? new URL('audio/tfa.mp3', script.src).href : '/assets/audio/tfa.mp3';
  } catch (e) {
    audioUrl = '/assets/audio/tfa.mp3';
  }

  var ambient = new Audio(audioUrl);
  ambient.loop = true;
  ambient.preload = 'auto';
  ambient.volume = 0.6; // ~60%
  ambient.setAttribute('aria-hidden', 'true');

  // Try to autoplay. If blocked by browser policies, wait for first user gesture.
  function tryPlay() {
    ambient.play().catch(function(){ /* autoplay blocked */ });
  }

  tryPlay();

  function onFirstGesture() {
    tryPlay();
    ['click','keydown','touchstart','pointerdown'].forEach(function(ev){
      window.removeEventListener(ev, onFirstGesture, {passive:true});
    });
  }

  // If still paused shortly after load, listen for a user gesture to start playback.
  setTimeout(function(){
    if (ambient.paused) {
      ['click','keydown','touchstart','pointerdown'].forEach(function(ev){
        window.addEventListener(ev, onFirstGesture, {passive:true});
      });
    }
  }, 250);

  // Expose a small API for toggling or adjusting volume if needed
  window.__ambientSound = {
    audio: ambient,
    play: function(){ return ambient.play().catch(function(){}); },
    pause: function(){ ambient.pause(); },
    toggle: function(){ if (ambient.paused) { return ambient.play().catch(function(){}); } else { ambient.pause(); } },
    setVolume: function(v){ ambient.volume = Math.max(0, Math.min(1, v)); }
  };

})();
