// Sound Engine — Web Audio API only, no audio files
// All sounds are procedurally generated.

let _audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!_audioCtx) {
    _audioCtx = new AudioContext();
  }
  // Resume if suspended (autoplay policy)
  if (_audioCtx.state === "suspended") {
    _audioCtx.resume();
  }
  return _audioCtx;
}

/**
 * Bat-crack: short burst of high-freq noise with quick decay.
 * Duration ~80ms.
 */
export function playBatCrack(): void {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 2000;
    source.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Silently ignore AudioContext errors
  }
}

/**
 * Crowd roar: noise swell. Duration ~1.5s normal, ~3s big.
 */
export function playCrowdRoar(intensity: "normal" | "big"): void {
  try {
    const ctx = getAudioContext();
    const duration = intensity === "big" ? 3 : 1.5;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const peak = intensity === "big" ? 0.35 : 0.2;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + duration * 0.3);
    gain.gain.linearRampToValueAtTime(
      peak * 0.7,
      ctx.currentTime + duration * 0.7,
    );
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = intensity === "big" ? 1800 : 1200;
    source.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Silently ignore AudioContext errors
  }
}

/**
 * Wicket: descending tone sequence. Duration ~800ms.
 */
export function playWicketSound(): void {
  try {
    const ctx = getAudioContext();
    const freqs = [660, 550, 440, 330, 220];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.14 + 0.18,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 0.2);
    });
  } catch {
    // Silently ignore AudioContext errors
  }
}

/**
 * Ambient crowd: continuous low-volume filtered noise loop.
 * Returns a stop function.
 */
export function playAmbientCrowd(): () => void {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 600;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 300;
    bandpass.Q.value = 0.5;
    source.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    return () => {
      try {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          try {
            source.stop();
          } catch {
            /* ignore */
          }
        }, 500);
      } catch {
        /* ignore */
      }
    };
  } catch {
    return () => {};
  }
}

/**
 * Boundary bell: ascending chime for four. 3 notes.
 */
export function playBoundaryBell(): void {
  try {
    const ctx = getAudioContext();
    const freqs = [523, 659, 784]; // C5, E5, G5
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(
        0.35,
        ctx.currentTime + i * 0.15 + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.15 + 0.5,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.55);
    });
  } catch {
    // Silently ignore AudioContext errors
  }
}

/**
 * Six fanfare: louder ascending fanfare. 5 notes.
 */
export function playSixFanfare(): void {
  try {
    const ctx = getAudioContext();
    const freqs = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + i * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.1 + 0.45,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
  } catch {
    // Silently ignore AudioContext errors
  }
}
