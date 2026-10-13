/**
 * PhonkAudioEngine - High Energy Dark Anime Phonk & Sound Designer Engine
 * 
 * Features:
 * - Autoplay compliant Web Audio API initialization
 * - Heavy 808 sub-bass drops
 * - Phonk drift cowbell arpeggios
 * - Dark atmospheric tension drone & heartbeat impacts
 * - Powerful warrior battle roar / roar resonance formant synthesis
 * - Lightning impact & energy riser sweeps
 * - Optional custom audio asset playback with automatic synthetic fallback
 */

class PhonkAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active track nodes
  private ambientDroneOsc1: OscillatorNode | null = null;
  private ambientDroneOsc2: OscillatorNode | null = null;
  private cowbellTimer: number | null = null;
  private isPlayingPhonk: boolean = false;
  private customAudioElement: HTMLAudioElement | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public async unlockAudio(): Promise<boolean> {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
    if (this.customAudioElement) {
      this.customAudioElement.muted = muted;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * SCENE 1: Deep Atmospheric Void Drone & Heartbeat
   */
  public startAtmosphericTension() {
    this.init();
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    this.stopAtmosphericTension();

    const now = this.ctx.currentTime;
    this.ambientDroneOsc1 = this.ctx.createOscillator();
    this.ambientDroneOsc2 = this.ctx.createOscillator();

    this.ambientDroneOsc1.type = 'sawtooth';
    this.ambientDroneOsc2.type = 'sine';

    this.ambientDroneOsc1.frequency.setValueAtTime(45, now);
    this.ambientDroneOsc2.frequency.setValueAtTime(46.2, now); // 1.2Hz binaural beating

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, now);
    filter.frequency.linearRampToValueAtTime(260, now + 3.0);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.linearRampToValueAtTime(0.25, now + 1.5);

    this.ambientDroneOsc1.connect(filter);
    this.ambientDroneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.musicGain);

    this.ambientDroneOsc1.start(now);
    this.ambientDroneOsc2.start(now);
  }

  public stopAtmosphericTension() {
    if (this.ambientDroneOsc1) {
      try { this.ambientDroneOsc1.stop(); } catch {}
      this.ambientDroneOsc1 = null;
    }
    if (this.ambientDroneOsc2) {
      try { this.ambientDroneOsc2.stop(); } catch {}
      this.ambientDroneOsc2 = null;
    }
  }

  /**
   * Heartbeat Impact: Low sub thump
   */
  public playHeartbeatImpact() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(78, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.18);

    g.gain.setValueAtTime(0.55, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * SCENE 2: Eye Open Ignition (High frequency glint + energy hum)
   */
  public playEyeOpenGlint(glowType: 'cyan' | 'silver' | 'purple' | 'amber' = 'cyan') {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const baseFreq = glowType === 'cyan' ? 1864 : glowType === 'purple' ? 1567 : glowType === 'amber' ? 1318 : 2093;

    // High crystalline shimmer
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.35, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.65);

    // Sub rumble
    const sub = this.ctx.createOscillator();
    const subG = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.4);
    subG.gain.setValueAtTime(0.4, now);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    sub.connect(subG);
    subG.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.5);
  }

  /**
   * SCENE 4: Riser & Tension Sweep (Accelerating build)
   */
  public playEnergyRiser() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 2.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 2.8);

    g.gain.setValueAtTime(0.01, now);
    g.gain.linearRampToValueAtTime(0.3, now + 2.6);
    g.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 3.1);
  }

  /**
   * SCENE 5: EXPLOSIVE 808 BASS DROP & WARRIOR ROAR / BATTLE CRY
   */
  public playBattleRoarAnd808Drop(characterStyle: string) {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. HARD 808 SUB-BASS DROP
    const sub808 = this.ctx.createOscillator();
    const sub808Gain = this.ctx.createGain();
    sub808.type = 'sine';
    sub808.frequency.setValueAtTime(140, now);
    sub808.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    sub808Gain.gain.setValueAtTime(0.85, now);
    sub808Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    sub808.connect(sub808Gain);
    sub808Gain.connect(this.sfxGain);
    sub808.start(now);
    sub808.stop(now + 1.9);

    // 2. SYNTHESIZED WARRIOR ROAR ACOUSTICS (Dual Formant Vowel Filter Sweep)
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();

    roarOsc.type = 'sawtooth';
    const startFreq = characterStyle === 'saiyan' ? 160 : characterStyle === 'cursed' ? 110 : 130;
    roarOsc.frequency.setValueAtTime(startFreq, now);
    roarOsc.frequency.linearRampToValueAtTime(startFreq * 1.4, now + 0.35);
    roarOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, now + 1.6);

    // Vocal tract formant filter
    const formantFilter = this.ctx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(750, now);
    formantFilter.frequency.linearRampToValueAtTime(1150, now + 0.4);
    formantFilter.frequency.exponentialRampToValueAtTime(500, now + 1.5);
    formantFilter.Q.setValueAtTime(4.2, now);

    roarGain.gain.setValueAtTime(0.01, now);
    roarGain.gain.linearRampToValueAtTime(0.48, now + 0.15);
    roarGain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

    roarOsc.connect(formantFilter);
    formantFilter.connect(roarGain);
    roarGain.connect(this.sfxGain);

    roarOsc.start(now);
    roarOsc.stop(now + 1.8);

    // 3. SEISMIC SHOCKWAVE NOISE CRACKLE
    this.triggerShockwaveBurst(now);

    // 4. Start driving Phonk Cowbell rhythm in the climax
    this.startPhonkBeatLoop();
  }

  private triggerShockwaveBurst(time: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.3);

    g.gain.setValueAtTime(0.35, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 0.38);
  }

  /**
   * Phonk Cowbell Syncopated Melodic Progression
   */
  public startPhonkBeatLoop() {
    if (this.isPlayingPhonk) return;
    this.isPlayingPhonk = true;

    // Classic Phonk Cowbell scale: D5, E5, G5, A5, G5, E5
    const cowbellNotes = [587.33, 659.25, 783.99, 880.0, 783.99, 659.25];
    let noteIndex = 0;

    const playCowbellHit = () => {
      if (!this.ctx || !this.musicGain || this.isMuted || !this.isPlayingPhonk) return;
      const now = this.ctx.currentTime;
      const freq = cowbellNotes[noteIndex % cowbellNotes.length];
      noteIndex++;

      // Dual square/pulse sound typical of Roland TR-808 cowbell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.48, now); // Distinctive dissonant interval

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.2, now);
      filter.Q.setValueAtTime(6.0, now);

      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(g);
      g.connect(this.musicGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.24);
      osc2.stop(now + 0.24);
    };

    // 140 BPM phonk eighth-note rhythm (~214ms interval)
    this.cowbellTimer = window.setInterval(() => {
      playCowbellHit();
    }, 214);
  }

  public stopPhonkBeatLoop() {
    this.isPlayingPhonk = false;
    if (this.cowbellTimer !== null) {
      clearInterval(this.cowbellTimer);
      this.cowbellTimer = null;
    }
  }

  /**
   * SCENE 7: Final Awakening Climax Chime
   */
  public playAwakenedSystemChime() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [1046.5, 1318.51, 1567.98, 2093.0];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.3 / (idx + 1), now + idx * 0.05 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 1.2);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.3);
    });
  }

  /**
   * Attempt to play external audio file if present (e.g. /assets/awakening/voices/...)
   */
  public async playCustomAudioTrack(url: string): Promise<boolean> {
    try {
      if (this.customAudioElement) {
        this.customAudioElement.pause();
        this.customAudioElement = null;
      }
      const audio = new Audio(url);
      audio.muted = this.isMuted;
      await audio.play();
      this.customAudioElement = audio;
      return true;
    } catch {
      return false; // Fallback to synthesized audio
    }
  }

  /**
   * Stop all intro audio completely on exit/transition
   */
  public stopAll() {
    this.stopAtmosphericTension();
    this.stopPhonkBeatLoop();
    if (this.customAudioElement) {
      try {
        this.customAudioElement.pause();
      } catch {}
      this.customAudioElement = null;
    }
  }
}

export const phonkAudio = new PhonkAudioEngine();
