// Background song, inlined into the single-file build so the deck still runs offline.
// Plays through an <audio> element, which also works in phone in-app browsers without Web Audio.
// It loops, fading out and back in at the seam, and its volume rises as the deck moves forward.
// iOS ignores audio.volume, so there the fades and the low-to-high rise don't apply.

import song from "../assets/audio/song.mp3";

const LOW = 0.2; // volume on the first scene
const PEAK = 0.7; // volume at the finale: full, still under the speaker
const FADE_IN = 4; // seconds at the start of each pass
const FADE_OUT = 6; // seconds at the end of each pass
const TICK = 100; // ms
const STEP = 0.02; // largest volume change per tick, so scene changes glide over about 3 s

export class Score {
  private audio?: HTMLAudioElement;
  private timer?: ReturnType<typeof setInterval>;
  private progress = 0;
  playing = false;

  private get target() {
    const a = this.audio!;
    if (!this.playing) return 0;
    const left = Number.isFinite(a.duration) ? (a.duration - a.currentTime) / FADE_OUT : 1;
    const fade = Math.max(0, Math.min(1, a.currentTime / FADE_IN, left));
    return (LOW + (PEAK - LOW) * this.progress) * fade;
  }

  private tick = () => {
    const a = this.audio!;
    const gap = this.target - a.volume;
    a.volume = Math.max(0, Math.min(1, a.volume + Math.max(-STEP, Math.min(STEP, gap))));
    if (!this.playing && a.volume === 0) this.halt();
  };

  private halt() {
    clearInterval(this.timer);
    this.timer = undefined;
    this.audio?.pause();
  }

  start() {
    if (!this.audio) {
      this.audio = new Audio(song);
      this.audio.loop = true;
      this.audio.volume = 0;
    }
    const a = this.audio;
    this.playing = true;
    this.timer ??= setInterval(this.tick, TICK);
    // refused until the first gesture; App calls start() again on the first key or click
    a.play().catch(() => { if (a.paused) { this.playing = false; this.halt(); } });
  }

  /** fades out, then pauses; start() resumes from the same place */
  stop() { this.playing = false; }

  /** 0 = first scene (quiet) … 1 = finale (loudest); glides to the new volume */
  setProgress(p: number) { this.progress = Math.min(1, Math.max(0, p)); }
}
