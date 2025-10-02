class AudioManager {
  private audioContext: AudioContext | null = null;
  private isUnlocked = false;
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  // Must be called from a user gesture (e.g., a click event) to unlock audio.
  public init() {
    if (this.isUnlocked || typeof window === 'undefined') {
      return;
    }
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
        return;
      }
    }
    // On some browsers, the AudioContext starts in a 'suspended' state
    // and must be resumed by a user gesture.
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.isUnlocked = true;
  }
  private async loadSound(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) {
      console.error("AudioContext not initialized.");
      return null;
    }
    if (this.audioBufferCache.has(url)) {
      return this.audioBufferCache.get(url)!;
    }
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBufferCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load or decode sound: ${url}`, error);
      return null;
    }
  }
  public async playSound(url: string) {
    if (!this.isUnlocked || !this.audioContext) {
      // If not unlocked, we can't play sound. The init() must be called first.
      console.warn("Audio is not unlocked. Call init() from a user gesture.");
      return;
    }
    const audioBuffer = await this.loadSound(url);
    if (!audioBuffer) {
      return;
    }
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error(`Error playing sound: ${url}`, error);
    }
  }
}
export const audioManager = new AudioManager();