/**
 * Solo Arise — High-Fidelity Deep Space Audio & Solo Leveling System Synthesizer
 * Built with Web Audio API for true procedural synthesis without external dependencies.
 *
 * Space Acoustic Features:
 * - Planetary Magnetospheric Drone (40Hz - 44Hz dual oscillator with resonant cavity filter)
 * - Saturn/Jupiter Auroral Plasma Waves (narrow-band swept bandpass noise)
 * - Interstellar Pulsar Radio Ticks (astronomical periodic impulse based on neutron star rotation)
 * - Whistler Plasma Dispersion Glide (Voyager planetary lightning magnetospheric curve)
 * - Vacuum Solar Wind Resonance (phased sub-harmonic modulation)
 *
 * Anime Solo Leveling System SFX:
 * - Iconic Holographic System Chime [PING-SHING] with crystalline harmonic overtones
 * - System Quest Prompt / Alert [DUN-TIING]
 * - Subterranean Monarch Boom & ARISE Fanfare (30Hz tectonic displacement)
 * - System Penalty Dread Alarm (dissonant tritone klaxon)
 * - Tactical Haptic Spatial Tap
 */

class SpaceSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Space Ambience Components
  private subDroneOsc1: OscillatorNode | null = null;
  private subDroneOsc2: OscillatorNode | null = null;
  private subFilter: BiquadFilterNode | null = null;
  private plasmaNoiseSource: AudioBufferSourceNode | null = null;
  private plasmaFilter1: BiquadFilterNode | null = null;
  private plasmaFilter2: BiquadFilterNode | null = null;
  private pulsarTimer: any = null;
  private whistlerTimer: any = null;
  private isAmbientPlaying: boolean = false;

  private ambientVolumeVal: number = 0.4;
  private sfxVolumeVal: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolumeVal, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolumeVal, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Unlock Web Audio context on user gesture (iOS Safari + Chrome mobile compliant)
   */
  public async unlockAudio(): Promise<boolean> {
    try {
      this.initContext();
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume();
        }
        // Play an imperceptible 1-sample silent buffer to unlock iOS Safari Web Audio hardware
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
        return true;
      }
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
    return false;
  }

  // Generate pink/brown cosmic background radiation buffer
  private createCosmicNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const length = this.ctx.sampleRate * 8; // 8-second continuous loop
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let lastLeft = 0;
    let lastRight = 0;

    for (let i = 0; i < length; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      // Brown noise integration for deep cosmic hiss
      lastLeft = (lastLeft + 0.02 * whiteL) / 1.02;
      lastRight = (lastRight + 0.02 * whiteR) / 1.02;
      left[i] = lastLeft * 2.2;
      right[i] = lastRight * 2.2;
    }
    return buffer;
  }

  /**
   * Start Genuine Real Space Ambience
   * Recreates NASA Voyager / Cassini magnetosphere plasma wave recordings.
   */
  public startSpaceAmbient() {
    this.initContext();
    if (this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Deep Vacuum Planetary Magnetosphere (41.2Hz and 42.8Hz binaural detune)
      this.subDroneOsc1 = this.ctx.createOscillator();
      this.subDroneOsc2 = this.ctx.createOscillator();
      this.subDroneOsc1.type = 'sine';
      this.subDroneOsc2.type = 'triangle';
      this.subDroneOsc1.frequency.setValueAtTime(41.2, now);
      this.subDroneOsc2.frequency.setValueAtTime(42.8, now);

      // Ultra-slow vacuum breathing LFO (0.035 Hz = ~28 sec cycle)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.035, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(3.2, now);
      lfo.connect(lfoGain);
      lfoGain.connect(this.subDroneOsc1.frequency);
      lfo.start();

      this.subFilter = this.ctx.createBiquadFilter();
      this.subFilter.type = 'lowpass';
      this.subFilter.frequency.setValueAtTime(130, now);
      this.subFilter.Q.setValueAtTime(2.5, now);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.32, now);

      this.subDroneOsc1.connect(this.subFilter);
      this.subDroneOsc2.connect(this.subFilter);
      this.subFilter.connect(droneGain);
      droneGain.connect(this.ambientGain);

      this.subDroneOsc1.start();
      this.subDroneOsc2.start();

      // 2. Cosmic Plasma Auroral Noise (Sweeping Resonant Bandpasses)
      const noiseBuffer = this.createCosmicNoiseBuffer();
      this.plasmaNoiseSource = this.ctx.createBufferSource();
      this.plasmaNoiseSource.buffer = noiseBuffer;
      this.plasmaNoiseSource.loop = true;

      this.plasmaFilter1 = this.ctx.createBiquadFilter();
      this.plasmaFilter1.type = 'bandpass';
      this.plasmaFilter1.frequency.setValueAtTime(340, now);
      this.plasmaFilter1.Q.setValueAtTime(5.5, now);

      this.plasmaFilter2 = this.ctx.createBiquadFilter();
      this.plasmaFilter2.type = 'bandpass';
      this.plasmaFilter2.frequency.setValueAtTime(680, now);
      this.plasmaFilter2.Q.setValueAtTime(4.0, now);

      // Slow plasma drift LFO
      const plasmaLfo = this.ctx.createOscillator();
      plasmaLfo.frequency.setValueAtTime(0.06, now);
      const plasmaLfoGain = this.ctx.createGain();
      plasmaLfoGain.gain.setValueAtTime(140, now);
      plasmaLfo.connect(plasmaLfoGain);
      plasmaLfoGain.connect(this.plasmaFilter1.frequency);
      plasmaLfo.start();

      const plasmaGain = this.ctx.createGain();
      plasmaGain.gain.setValueAtTime(0.18, now);

      this.plasmaNoiseSource.connect(this.plasmaFilter1);
      this.plasmaFilter1.connect(plasmaGain);
      this.plasmaNoiseSource.connect(this.plasmaFilter2);
      this.plasmaFilter2.connect(plasmaGain);
      plasmaGain.connect(this.ambientGain);

      this.plasmaNoiseSource.start();

      // 3. Periodic Pulsar Radio Ticks (Authentic periodic millisecond neutron star tick)
      this.schedulePulsarTicks();

      // 4. Interstellar Whistler Glides
      this.scheduleWhistlerGlides();

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Could not initialize space ambient audio:', e);
    }
  }

  // Periodic authentic pulsar ticks
  private schedulePulsarTicks() {
    if (!this.isAmbientPlaying) return;
    this.pulsarTimer = setInterval(() => {
      if (this.ctx && this.ambientGain && this.isAmbientPlaying) {
        this.triggerPulsarClick();
      }
    }, 1150); // ~1.15s period (similar to PSR B1919+21)
  }

  private triggerPulsarClick() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, now);
    filter.Q.setValueAtTime(3.0, now);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.035, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.ambientGain);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  // Voyager Lightning Whistler Waves (Frequency descends exponentially through magnetospheric plasma)
  private scheduleWhistlerGlides() {
    if (!this.isAmbientPlaying) return;
    this.whistlerTimer = setTimeout(() => {
      if (this.ctx && this.ambientGain && this.isAmbientPlaying) {
        this.playWhistlerChirp();
      }
      this.scheduleWhistlerGlides();
    }, 15000 + Math.random() * 12000);
  }

  private playWhistlerChirp() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 1.9);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.045, now + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

    osc.connect(g);
    g.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 2.2);
  }

  public stopSpaceAmbient() {
    try {
      if (this.subDroneOsc1) {
        this.subDroneOsc1.stop();
        this.subDroneOsc1.disconnect();
        this.subDroneOsc1 = null;
      }
      if (this.subDroneOsc2) {
        this.subDroneOsc2.stop();
        this.subDroneOsc2.disconnect();
        this.subDroneOsc2 = null;
      }
      if (this.plasmaNoiseSource) {
        this.plasmaNoiseSource.stop();
        this.plasmaNoiseSource.disconnect();
        this.plasmaNoiseSource = null;
      }
      if (this.pulsarTimer) {
        clearInterval(this.pulsarTimer);
        this.pulsarTimer = null;
      }
      if (this.whistlerTimer) {
        clearTimeout(this.whistlerTimer);
        this.whistlerTimer = null;
      }
      this.isAmbientPlaying = false;
    } catch (e) {
      console.warn('Error stopping space audio:', e);
    }
  }

  public toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopSpaceAmbient();
      return false;
    } else {
      this.startSpaceAmbient();
      return true;
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolumeVal = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolumeVal, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolumeVal = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolumeVal, this.ctx.currentTime);
    }
  }

  public getAmbientVolume(): number {
    return this.ambientVolumeVal;
  }

  public getSfxVolume(): number {
    return this.sfxVolumeVal;
  }

  // =========================================================================
  // SOLO LEVELING TACTICAL SYSTEM SOUND EFFECTS (Authentic Anime Chimes)
  // =========================================================================

  /**
   * Resume audio context on user gesture
   */
  public async resumeAudioContext(): Promise<void> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * SFX: Authentic Pulsar Star Arrival (Cosmic Neutron Star Resonance)
   * Real celestial pulse star arrival:
   * - Smooth sub-harmonic gravity well resonance (56Hz -> 36Hz, pure sine)
   * - Rhythmic Neutron Star Pulsar Beams (crisp cosmological pulse chirps)
   * - Ethereal crystalline celestial harmonics (pure resonance, zero buzz)
   */
  public playPulseStarArrival() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;

    // 1. Celestial Gravity Well (Deep velvety sub-harmonic sine wave, completely smooth)
    const gravityOsc = this.ctx.createOscillator();
    const gravityGain = this.ctx.createGain();
    gravityOsc.type = 'sine';
    gravityOsc.frequency.setValueAtTime(56, now);
    gravityOsc.frequency.exponentialRampToValueAtTime(34, now + 1.8);

    gravityGain.gain.setValueAtTime(0.0001, now);
    gravityGain.gain.linearRampToValueAtTime(0.45, now + 0.12);
    gravityGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    gravityOsc.connect(gravityGain);
    gravityGain.connect(this.sfxGain);
    gravityOsc.start(now);
    gravityOsc.stop(now + 2.5);

    // 2. Rhythmic Neutron Star Pulsar Beams (3 pure crystalline cosmological pulses)
    const pulseIntervals = [0.06, 0.26, 0.48];
    const frequencies = [880, 1174, 1568]; // Crystalline astronomical triad
    pulseIntervals.forEach((offset, idx) => {
      const pulseOsc = this.ctx!.createOscillator();
      const pulseFilter = this.ctx!.createBiquadFilter();
      const pulseGain = this.ctx!.createGain();

      pulseOsc.type = 'sine';
      pulseOsc.frequency.setValueAtTime(frequencies[idx], now + offset);
      pulseOsc.frequency.exponentialRampToValueAtTime(frequencies[idx] * 0.45, now + offset + 0.18);

      pulseFilter.type = 'bandpass';
      pulseFilter.frequency.setValueAtTime(frequencies[idx] * 0.75, now + offset);
      pulseFilter.Q.setValueAtTime(3.2, now + offset);

      pulseGain.gain.setValueAtTime(0.0001, now + offset);
      pulseGain.gain.linearRampToValueAtTime(0.32 / (idx * 0.3 + 1), now + offset + 0.012);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.42);

      pulseOsc.connect(pulseFilter);
      pulseFilter.connect(pulseGain);
      pulseGain.connect(this.sfxGain!);

      pulseOsc.start(now + offset);
      pulseOsc.stop(now + offset + 0.45);
    });

    // 3. Ethereal Interstellar Aurora Harmonic Shimmer (Crystal bell resonance)
    const shimmerNotes = [1760.0, 2349.32, 3135.96];
    shimmerNotes.forEach((freq, i) => {
      const shimmerOsc = this.ctx!.createOscillator();
      const shimmerGain = this.ctx!.createGain();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(freq, now + 0.18 + i * 0.06);

      shimmerGain.gain.setValueAtTime(0.0001, now + 0.18 + i * 0.06);
      shimmerGain.gain.linearRampToValueAtTime(0.14 / (i + 1), now + 0.22 + i * 0.06);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(this.sfxGain!);
      shimmerOsc.start(now + 0.18 + i * 0.06);
      shimmerOsc.stop(now + 2.1);
    });
  }

  /**
   * SFX: Solo Leveling System Quest Notification Chime
   * The iconic [TIING-G-G] holographic window popup heard in Episode 1 & 2.
   */
  public playSystemChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Sub-vacuum pop transient
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.18);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.25);

    // High crystalline celestial overtones (D6, A6, D7, F#7)
    const bellFrequencies = [1174.66, 1760.0, 2349.32, 2959.96];
    bellFrequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      gain.gain.setValueAtTime(0.001, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.24 / (idx + 1), now + idx * 0.035 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 1.25);
    });
  }

  /**
   * SFX: System Quest Complete (Solo Leveling Shimmer & Mana Reward)
   */
  public playQuestComplete() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Ascending victory chime: E6 -> G#6 -> B6 -> E7
    const notes = [1318.51, 1661.22, 1975.53, 2637.02];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.05 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.95);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.0);
    });

    // Gentle sub-harmonic bass ring
    const sub = this.ctx.createOscillator();
    const subG = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(85, now);
    sub.frequency.exponentialRampToValueAtTime(45, now + 0.4);
    subG.gain.setValueAtTime(0.3, now);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    sub.connect(subG);
    subG.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.52);
  }

  /**
   * SFX: Authentic Solo Leveling Anime System Notification Chime
   * The exact crystalline floating blue window bell alert from the anime:
   * - Dual pristine high bell harmonics (2637Hz & 3951Hz - E7/B7)
   * - Secondary crystal sparkle (5274Hz)
   * - Holographic sub-bass impact (48Hz)
   */
  public playSoloLevelingNotificationChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // High crystalline bell tones
    const bellFrequencies = [2637.02, 3951.07, 5274.04];
    bellFrequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.025);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.025 + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 0.85);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.025);
      osc.stop(now + idx * 0.025 + 0.9);
    });

    // Holographic digital shimmer chord
    const shimmerNotes = [880, 1318.5, 1760];
    shimmerNotes.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.03);
      gain.gain.setValueAtTime(0.0001, now + 0.03);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + 0.03);
      osc.stop(now + 0.6);
    });

    // Deep sub-pulse anchor
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(58, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.52);
  }

  /**
   * SFX: Character Energy Aura Surge (Triggered per anime character scan)
   */
  public playAnimeCharacterVoiceBurst(characterId: string) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    switch (characterId) {
      case 'goku': {
        // Divine God Ki pulse & high frequency spark
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.42);
        break;
      }
      case 'gojo': {
        // Spatial distortion warp (Limitless spatial frequency bend)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(380, now);
        osc1.frequency.exponentialRampToValueAtTime(120, now + 0.4);
        osc2.frequency.setValueAtTime(385, now); // 5Hz beat frequency
        osc2.frequency.exponentialRampToValueAtTime(124, now + 0.4);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.46);
        osc2.stop(now + 0.46);
        break;
      }
      case 'saitama': {
        // Sub-bass physical shockwave & clean comical whoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.38);
        break;
      }
      case 'luffy': {
        // Drums of Liberation rhythmic double bounce
        [0, 0.12].forEach((offset) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now + offset);
          osc.frequency.exponentialRampToValueAtTime(70, now + offset + 0.1);
          g.gain.setValueAtTime(0.28, now + offset);
          g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
          osc.connect(g);
          g.connect(this.sfxGain!);
          osc.start(now + offset);
          osc.stop(now + offset + 0.13);
        });
        break;
      }
      case 'ichigo': {
        // Getsuga Tenshou metallic blade ring & spiritual pressure
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.32);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(6.0, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.36);
        break;
      }
      case 'gilgamesh': {
        // Gate of Babylon golden treasury ringing chimes
        [1567.98, 2093.0, 2793.83].forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.04);
          g.gain.setValueAtTime(0.18 / (i + 1), now + i * 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.4);
          osc.connect(g);
          g.connect(this.sfxGain!);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.42);
        });
        break;
      }
      case 'rimuru': {
        // Slime waterdrop ripple & synthesis sparkle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      default:
        this.playSystemChime();
        break;
    }
  }

  private systemCarrierOsc: OscillatorNode | null = null;
  private systemCarrierGain: GainNode | null = null;

  /**
   * Start subtle cybernetic vocoder carrier drone while Solo Leveling System Voice speaks
   */
  public startSystemVoiceCarrier() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.stopSystemVoiceCarrier();

    try {
      const now = this.ctx.currentTime;
      this.systemCarrierOsc = this.ctx.createOscillator();
      this.systemCarrierGain = this.ctx.createGain();

      this.systemCarrierOsc.type = 'sine';
      this.systemCarrierOsc.frequency.setValueAtTime(440, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(660, now);
      filter.Q.setValueAtTime(4.0, now);

      this.systemCarrierGain.gain.setValueAtTime(0.001, now);
      this.systemCarrierGain.gain.linearRampToValueAtTime(0.04, now + 0.05);

      this.systemCarrierOsc.connect(filter);
      filter.connect(this.systemCarrierGain);
      this.systemCarrierGain.connect(this.sfxGain);

      this.systemCarrierOsc.start();
    } catch {}
  }

  /**
   * Stop system voice carrier drone
   */
  public stopSystemVoiceCarrier() {
    if (this.systemCarrierGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.systemCarrierGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch {}
    }
    if (this.systemCarrierOsc) {
      try {
        this.systemCarrierOsc.stop(this.ctx ? this.ctx.currentTime + 0.06 : 0);
      } catch {}
      this.systemCarrierOsc = null;
      this.systemCarrierGain = null;
    }
  }

  /**
   * SFX: ARISE / Rank Promotion (Tectonic Shadow Boom + Ascending Monarch Choir)
   */
  public playArise() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Tectonic Sub-Bass Drop (120Hz down to 26Hz seismic impact)
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(120, now);
    boomOsc.frequency.exponentialRampToValueAtTime(26, now + 1.8);

    boomGain.gain.setValueAtTime(0.75, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(now);
    boomOsc.stop(now + 3.3);

    // 2. Rising Monarch Energy Surge (Ascending filter sweep)
    const sweepOsc = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(65, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(660, now + 2.2);

    const sweepFilter = this.ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(200, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(1600, now + 2.2);

    sweepGain.gain.setValueAtTime(0.01, now);
    sweepGain.gain.linearRampToValueAtTime(0.3, now + 1.9);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

    sweepOsc.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(this.sfxGain);
    sweepOsc.start(now);
    sweepOsc.stop(now + 3.5);

    // 3. Climax Monarch Chime Flare
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const peakNow = this.ctx.currentTime;
      const chords = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      chords.forEach((f, i) => {
        const o = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, peakNow);
        g.gain.setValueAtTime(0.001, peakNow);
        g.gain.linearRampToValueAtTime(0.14 / (i * 0.3 + 1), peakNow + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, peakNow + 2.8);
        o.connect(g);
        g.connect(this.sfxGain!);
        o.start(peakNow);
        o.stop(peakNow + 2.9);
      });
    }, 1800);
  }

  public playRankUp() {
    this.playArise();
  }

  /**
   * SFX: Call to Darkness (Deep Goggins Battle Siren)
   */
  public playCallToDarkness() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(118, now + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);

    g.gain.setValueAtTime(0.01, now);
    g.gain.linearRampToValueAtTime(0.4, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 2.1);
  }

  /**
   * SFX: System Penalty / Dread Warning (Subterranean Discord & Tritone Klaxon)
   */
  public playPenalty() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Deep ominous void drop (smooth sine waves, zero buzz or vibration)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 1.6);
    osc2.frequency.setValueAtTime(60, now);
    osc2.frequency.exponentialRampToValueAtTime(28, now + 1.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  }

  /**
   * SFX: Heartbeat Emergency (Cardiac Shutdown Sequence in Intro)
   */
  public playHeartbeat() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const pulse = (time: number, freq: number, vol: number) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(28, time + 0.16);

      g.gain.setValueAtTime(vol, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(time);
      osc.stop(time + 0.22);
    };

    pulse(now, 75, 0.5);
    pulse(now + 0.22, 60, 0.4);
  }

  public playRecoveryPulse() {
    this.playHeartbeat();
  }

  /**
   * SFX: Tactical Void Tap (Clean mechanical spatial micro-impact)
   */
  public playTap() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.028);

    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.035);
  }
}

export const spaceAudio = new SpaceSoundEngine();
