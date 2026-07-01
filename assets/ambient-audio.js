(function () {
  'use strict';

  // Find this script's URL so the audio path can be relative to it
  var script = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  var audioUrl;
  try {
    audioUrl = script
        ? new URL('audio/tfa.mp3', script.src).href
        : '/assets/audio/tfa.mp3';
  } catch (e) {
    audioUrl = '/assets/audio/tfa.mp3';
  }

  // Prevent duplicate players
  if (window.__ambientSound && window.__ambientSound.audio) {
    return;
  }

  var ambient = new Audio(audioUrl);
  ambient.loop = true;
  ambient.preload = 'auto';
  ambient.volume = 0.6;
  ambient.setAttribute('aria-hidden', 'true');

  var savedTime = parseFloat(localStorage.getItem('ambientTime') || '0');
  var savedAt = parseInt(localStorage.getItem('ambientSavedAt') || '0', 10);

  ambient.addEventListener('loadedmetadata', function () {
    if (!isNaN(savedTime) && savedTime > 0) {

      // Advance the song by however long the page took to load
      if (savedAt > 0) {
        savedTime += (Date.now() - savedAt) / 1000;
      }

      if (ambient.duration && isFinite(ambient.duration)) {
        ambient.currentTime = savedTime % ambient.duration;
      } else {
        ambient.currentTime = savedTime;
      }
    }
  });

  function tryPlay() {
    ambient.play().catch(function () {
      // Browser blocked autoplay
    });
  }

  tryPlay();

  function onFirstGesture() {
    tryPlay();

    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(function (ev) {
      window.removeEventListener(ev, onFirstGesture, true);
    });
  }

  setTimeout(function () {
    if (ambient.paused) {
      ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(function (ev) {
        window.addEventListener(ev, onFirstGesture, true);
      });
    }
  }, 250);

  function savePosition() {
    if (!ambient.paused) {
      localStorage.setItem('ambientTime', ambient.currentTime);
      localStorage.setItem('ambientSavedAt', Date.now());
    }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (link) {
      savePosition();
    }
  }, true);

  // Save on form submissions
  document.addEventListener('submit', savePosition, true);

  // Save before refresh/back/close
  window.addEventListener('beforeunload', savePosition);

  // Mobile/browser fallback
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      savePosition();
    }
  });

  window.__ambientSound = {
    audio: ambient,
    play: function () {
      return ambient.play().catch(function () {});
    },
    pause: function () {
      savePosition();
      ambient.pause();
    },
    toggle: function () {
      if (ambient.paused) {
        return ambient.play().catch(function () {});
      } else {
        savePosition();
        ambient.pause();
      }
    },
    setVolume: function (v) {
      ambient.volume = Math.max(0, Math.min(1, v));
    }
  };

})();