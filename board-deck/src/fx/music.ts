// Uplifting generative score, synthesized live with Web Audio: no audio files, no licence, works offline.
// C – G – Am – F at 96 bpm. Level 0 = pads and bass, 1 = adds the arpeggio, 2 = adds a soft pulse and bell melody.

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const CHORDS = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 57, 60, 65, 69]];
const MELODY = [76, 74, 72, 77, 79, 74, 76, 72]; // one bell note per bar, two-bar phrases over the progression
const BEAT = 60 / 96, BAR = BEAT * 4, LOOKAHEAD = 0.8;

export class Score {
  private ctx?: AudioContext;
  private master!: GainNode;
  private bus!: GainNode;
  private echo!: GainNode;
  private timer?: ReturnType<typeof setInterval>;
  private stopTimer?: ReturnType<typeof setTimeout>;
  private nextBar = 0;
  private bar = 0;
  private level = 1;
  playing = false;

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);

    // everything goes through one bus: dry plus a long generated reverb
    this.bus = ctx.createGain();
    this.bus.connect(this.master);
    const verb = ctx.createConvolver();
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    verb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    this.bus.connect(verb).connect(wet).connect(this.master);

    // dotted-eighth echo for the arpeggio and bells
    this.echo = ctx.createGain();
    const delay = ctx.createDelay(2);
    delay.delayTime.value = BEAT * 0.75;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    this.echo.connect(delay).connect(fb).connect(delay);
    delay.connect(this.bus);
  }

  private voice(type: OscillatorType, f: number, t: number, dur: number, gain: number, attack: number, opts: { detune?: number; cutoff?: number; echo?: boolean } = {}) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    if (opts.detune) o.detune.value = opts.detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let out: AudioNode = o;
    if (opts.cutoff) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = opts.cutoff;
      o.connect(lp);
      out = lp;
    }
    out.connect(g).connect(this.bus);
    if (opts.echo) g.connect(this.echo);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.5);
  }

  private scheduleBar(t: number) {
    const chord = CHORDS[this.bar % 4], lv = this.level;
    // pads: two detuned saws per note, filter opens with the level
    for (const n of chord.slice(2)) {
      for (const d of [-7, 7]) this.voice("sawtooth", hz(n), t, BAR + 1.6, 0.022, 1.1, { detune: d, cutoff: 700 + lv * 450 });
    }
    // bass on beats 1 and 3
    for (const b of [0, 2]) this.voice("triangle", hz(chord[0]), t + b * BEAT, BEAT * 2, 0.16, 0.04);
    if (lv >= 1) {
      const arp = [chord[2], chord[3], chord[4], chord[3] + 12, chord[4], chord[3], chord[2] + 12, chord[4]].map((n) => n + 12);
      arp.forEach((n, i) => this.voice("triangle", hz(n), t + i * (BEAT / 2), 0.38, 0.035, 0.008, { echo: true }));
    }
    if (lv >= 2) {
      for (const b of [0, 1, 2, 3]) this.kick(t + b * BEAT);
      const m = MELODY[this.bar % MELODY.length];
      this.voice("sine", hz(m), t, 2.6, 0.05, 0.01, { echo: true });
      this.voice("sine", hz(m + 12), t, 1.2, 0.012, 0.01);
    }
    this.bar++;
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
    this.master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3);
    this.nextBar = Math.max(this.nextBar, ctx.currentTime + 0.1);
    this.timer = setInterval(() => {
      while (this.nextBar < ctx.currentTime + LOOKAHEAD) {
        this.scheduleBar(this.nextBar);
        this.nextBar += BAR;
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
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    this.stopTimer = setTimeout(() => { void ctx.suspend(); this.nextBar = 0; }, 1700);
  }

  /** 0 calm · 1 building · 2 full; takes effect from the next bar */
  setLevel(l: number) { this.level = l; }
}
