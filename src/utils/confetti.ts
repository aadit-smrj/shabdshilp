import confetti from 'canvas-confetti';

export function triggerCelebration() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
    });
  } catch (e) {
    // Ignore in unsupported environments
  }
}

export function triggerCoinBurst() {
  try {
    confetti({
      particleCount: 35,
      angle: 90,
      spread: 45,
      origin: { x: 0.85, y: 0.1 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7']
    });
  } catch (e) {
    // Ignore
  }
}
