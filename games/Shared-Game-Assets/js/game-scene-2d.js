export const genericGameEventNames = {
  uiMenuOpen: "uiMenuOpen",
  uiMenuClosed: "uiMenuClosed",
  mute: "mute",
};

// Export so other scripts can access this
export class Generic2DGameScene extends Phaser.Scene {
  /**
   * Create a new Generic2DGameScene instance.
   * Initializes UI state and sound settings.
   */
  constructor() {
    // Inherit all Phaser scene attrs
    super();

    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?
    this.uiMenuOpen = false;

    this.sound_array = [];
    this.audioMuted = true; // Audio muted to start!

    // Bind "this" to refer to the scene for necessary functions
    this.toggleMuteAllAudio = this.toggleMuteAllAudio.bind(this);
    this.playDesiredSound = this.playDesiredSound.bind(this);
  }

  /**
   * Play a sound based on the given sound key.
   * Checks if the sound is currently playing and manages playback accordingly.
   * @param {string} soundKey - The key identifier for the desired sound.
   */
  playDesiredSound(soundKey) {
    let soundObj = this.sound.get(soundKey);
    if (soundObj) {
      // Prevent sound from playing multiple times in succession
      if (
        !soundObj.isPlaying ||
        (soundObj.isPlaying && soundObj.seek / soundObj.duration > 0.15)
      ) {
        soundObj.stop();
        soundObj.play();
      }
    } else {
      console.error(`Sound with key "${soundKey}" not found.`);
    }
  }

  /**
   * Toggle mute for all audio in the scene.
   * If audio is muted, stop all sounds; if unmuted, resume background sounds.
   */
  toggleMuteAllAudio() {
    this.sound_array.forEach((sound_obj) => {
      if (this.audioMuted) {
        sound_obj["sound"].mute = true;
        sound_obj["sound"].stop();
      } else {
        sound_obj["sound"].mute = false;

        if (sound_obj["type"] === "background") {
          sound_obj["sound"].play();
        }
      }
    });
  }

  // Disable scrolling
  disableScroll() {
    document.addEventListener("touchmove", this.preventDefault.bind(this), {
      passive: false,
    });

    document.addEventListener(
      "mousewheel",
      this.preventDefault.bind(this), // Bind 'this' to refer to the class instance
      {
        passive: false,
      }
    );
  }

  // Enable scrolling
  enableScroll() {
    //document.body.style.overflow = "";
    document.removeEventListener("touchmove", preventDefault);
    document.removeEventListener("mousewheel", preventDefault);
  }

  // Prevent default behavior of events (used in this case for disabling scroll)
  preventDefault(event) {
    //event.preventDefault();
  }
}
