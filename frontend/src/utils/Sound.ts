export const playSoftSound = () => {
  const audio = new Audio("/notify.mp3");
  audio.volume = 0.15;
  audio.play().catch(() => {});
};
