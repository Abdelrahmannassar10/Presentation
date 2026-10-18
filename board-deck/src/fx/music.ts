// Quiet classical score: Pachelbel's Canon in D (public domain), synthesized live with Web Audio,
// so there are no audio files or licences and the deck stays one offline file.
// Level 0 = strings on the ground bass, 1 = adds the violin melody, 2 = adds a soft harp arpeggio.

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
// the eight-chord ground: D – A – Bm – F#m – G – D – G – A  [bass, ...upper strings]
const GROUND = [[38, 62, 66, 69], [45, 61, 64, 69], [47, 62, 66, 71], [42, 61, 66, 69], [43, 62, 67, 71], [38, 62, 66, 69], [43, 62, 67, 71], [45, 61, 64, 69]];
// first-violin lines over the ground, one long note per chord, alternating each cycle
const MELODIES = [[78, 76, 74, 73, 71, 69, 71, 73], [74, 73, 71, 69, 67, 66, 67, 64], [78, 76, 74, 78, 79, 78, 79, 76]];
const STEP = 2.2; // seconds per chord: slow and calm
const LOOKAHEAD = 1.2;
const PEAK = 0.24; // master level: background, never over the speaker

export class Score {
  private ctx?: AudioContext;
  private master!: GainNode;
  private bus!: GainNode;
  private timer?: ReturnType<typeof setInterval>;
  private stopTimer?: ReturnType<typeof setTimeout>;
  private next = 0;
  private n = 0;
  private level = 1;
  playing = false;

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22;
    comp.ratio.value = 2.5;
    // soften the top end, like a hall
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 5200;
    this.master.connect(tone).connect(comp).connect(ctx.destination);

    this.bus = ctx.createGain();
    this.bus.connect(this.master);
    const verb = ctx.createConvolver();
    const len = ctx.sampleRate * 4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    verb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.6;
    this.bus.connect(verb).connect(wet).connect(this.master);
  }

  /** bowed string: two detuned saws, filtered, with a slow swell and gentle vibrato */
  private bow(midi: number, t: number, dur: number, gain: number, bright = 1600) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + Math.min(0.7, dur * 0.35));
    g.gain.setValueAtTime(gain, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.6);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = bright;
    lp.Q.value = 0.5;
    lp.connect(g).connect(this.bus);
    const vib = ctx.createOscillator(), vibAmt = ctx.createGain();
    vib.frequency.value = 5.2;
    vibAmt.gain.value = 5; // cents
    vib.connect(vibAmt);
    for (const d of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = hz(midi);
      o.detune.value = d;
      vibAmt.connect(o.detune);
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.7);
    }
    vib.start(t);
    vib.stop(t + dur + 0.7);
  }

  /** plucked harp: sine with a quiet octave, fast attack, long natural decay */
  private pluck(midi: number, t: number, gain: number) {
    const ctx = this.ctx!;
    for (const [mul, amt] of [[1, 1], [2, 0.25]] as const) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = hz(midi) * mul;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain * amt, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      o.connect(g).connect(this.bus);
      o.start(t);
      o.stop(t + 1.9);
    }
  }

  private scheduleChord(t: number) {
    const i = this.n % 8, [bass, ...upper] = GROUND[i], lv = this.level;
    this.bow(bass, t, STEP, 0.05, 900); // cello
    this.bow(bass + 12, t, STEP, 0.02, 1100); // viola doubling
    for (const u of upper) this.bow(u, t, STEP, 0.011, 1500); // second violins
    if (lv >= 1) {
      const line = MELODIES[Math.floor(this.n / 8) % MELODIES.length];
      this.bow(line[i], t, STEP * 0.96, 0.024, 2600); // first violin
    }
    if (lv >= 2) {
      // broken chord in eighths: bass, fifth, octave, third…
      const notes = [bass + 12, upper[0], upper[1], upper[2], upper[1] + 12, upper[2], upper[1], upper[0]];
      notes.forEach((m, k) => this.pluck(m, t + k * (STEP / 8), 0.03));
    }
    this.n++;
  }

  start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    clearTimeout(this.stopTimer);
    void ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(PEAK, ctx.currentTime + 4);
    this.next = Math.max(this.next, ctx.currentTime + 0.1);
    this.timer = setInterval(() => {
      while (this.next < ctx.currentTime + LOOKAHEAD) {
        this.scheduleChord(this.next);
        this.next += STEP;
      }
    }, 100);
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    const ctx = this.ctx;
    this.playing = false;
    clearInterval(this.timer);
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    this.stopTimer = setTimeout(() => { void ctx.suspend(); this.next = 0; }, 2200);
  }

  /** 0 calm · 1 melody · 2 full; takes effect from the next chord */
  setLevel(l: number) { this.level = l; }
}
