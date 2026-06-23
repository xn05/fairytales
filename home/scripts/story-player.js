document.addEventListener("DOMContentLoaded", () => {
  const players = document.querySelectorAll("[data-video-player]");

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  players.forEach((shell) => {
    const video = shell.querySelector("video");
    const overlay = shell.querySelector(".story_player_overlay");
    const playButton = shell.querySelector('[data-player-action="play"]');
    const muteButton = shell.querySelector('[data-player-action="mute"]');
    const fullscreenButton = shell.querySelector('[data-player-action="fullscreen"]');
    const seek = shell.querySelector("[data-player-seek]");
    const timeLabel = shell.querySelector("[data-player-time]");

    if (!video || !overlay || !playButton || !muteButton || !fullscreenButton || !seek || !timeLabel) {
      return;
    }

    const updateControls = () => {
      playButton.textContent = video.paused ? "Play" : "Pause";
      muteButton.textContent = video.muted ? "Unmute" : "Mute";

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const progress = (video.currentTime / video.duration) * 100;
        seek.value = String(Math.max(0, Math.min(100, progress)));
        timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      } else {
        seek.value = "0";
        timeLabel.textContent = "0:00 / 0:00";
      }
    };

    const hasVideoSource = () => {
      const source = video.querySelector("source");
      return Boolean((source && source.getAttribute("src")) || video.getAttribute("src") || video.currentSrc);
    };

    const setEmptyState = () => {
      shell.classList.remove("is-ready");
      shell.classList.add("is-empty");
      playButton.disabled = true;
      muteButton.disabled = true;
      fullscreenButton.disabled = true;
      seek.disabled = true;
      timeLabel.textContent = "0:00 / 0:00";
    };

    const setReadyState = () => {
      shell.classList.remove("is-empty");
      shell.classList.add("is-ready");
      playButton.disabled = false;
      muteButton.disabled = false;
      fullscreenButton.disabled = false;
      seek.disabled = false;
      updateControls();
    };

    if (!hasVideoSource()) {
      setEmptyState();
      overlay.innerHTML = `
        <h3>Add your video here</h3>
        <p>Set a video source inside this player to activate the custom controls and preview area.</p>
      `;
    } else {
      video.addEventListener("loadedmetadata", setReadyState, { once: true });
      video.addEventListener("loadeddata", setReadyState, { once: true });
      video.addEventListener("timeupdate", updateControls);
      video.addEventListener("play", updateControls);
      video.addEventListener("pause", updateControls);
      video.addEventListener("volumechange", updateControls);
      video.addEventListener("durationchange", updateControls);
      video.addEventListener("emptied", setEmptyState);
      updateControls();
    }

    playButton.addEventListener("click", async () => {
      if (!hasVideoSource()) {
        return;
      }

      if (video.paused) {
        try {
          await video.play();
        } catch (error) {
          // Playback may be blocked until the user interacts with the page.
        }
      } else {
        video.pause();
      }
      updateControls();
    });

    muteButton.addEventListener("click", () => {
      if (!hasVideoSource()) {
        return;
      }

      video.muted = !video.muted;
      updateControls();
    });

    fullscreenButton.addEventListener("click", async () => {
      if (!shell.requestFullscreen || !hasVideoSource()) {
        return;
      }

      try {
        await shell.requestFullscreen();
      } catch (error) {
        // Some browsers block fullscreen in restricted contexts.
      }
    });

    seek.addEventListener("input", () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.currentTime = (Number(seek.value) / 100) * video.duration;
      updateControls();
    });
  });
});
