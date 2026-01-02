let audio: HTMLAudioElement | null = null;

export const startFocusSound = () => {
  if (!audio) {
    audio = new Audio("/sounds/focus.mp3");
    audio.loop = true;
    audio.volume = 0.4;
  }
  audio.play().catch(() => {});
};

export const stopFocusSound = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
