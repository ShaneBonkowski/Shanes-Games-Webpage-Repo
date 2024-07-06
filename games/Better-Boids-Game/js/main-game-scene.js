/**
 * @module BoidMainGameScene
 *
 * @author Shane Bonkowski
 */

import { instantiateBoids } from "./boid-utils.js";
import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { createFunctionButtonContainer } from "/Main-Website-Assets/js/buttons.js";
import { showMessage } from "../../Shared-Game-Assets/js/phaser_message.js";

// Used to determine if pointer is held down
const holdThreshold = 0.1; // seconds
let pointerDownTime = 0;
let holdTimer = null;

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.boids = [];
    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?
    this.uiMenuOpen = false;
    this.sound_array = [];
    this.audioMuted = true; // audio muted to start!

    // Store the last known window size so we can update boids positions etc.
    // based on this as the screen size changes
    this.lastKnownWindowSize = new Vec2(0, 0);

    // Bind "this" to refer to the scene for necc. functions
    this.onClickMuteSound = this.onClickMuteSound.bind(this);
    this.toggleMuteAllAudio = this.toggleMuteAllAudio.bind(this);
    this.playDesiredSound = this.playDesiredSound.bind(this);
  }

  preload() {
    // Images
    this.load.image("Bad Boid", "./webps/Bad_Boid.webp");
    this.load.image("Good Boid", "./webps/Good_Boid.webp");
    this.load.image("Leader Boid", "./webps/Leader_Boid.webp");

    // Spritesheets
    this.load.spritesheet(
      "Bad Boid Anim",
      "./webps/Bad_Boid_Anim_Spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Good Boid Anim",
      "./webps/Good_Boid_Anim_Spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Leader Boid Anim",
      "./webps/Leader_Boid_Anim_Spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );

    // Audio
    this.load.audio("Background music", [
      "/games/Shared-Game-Assets/audio/birds-chirping.mp3",
    ]);
    this.load.audio("Button Click", [
      "/games/Shared-Game-Assets/audio/ui-button-click.mp3",
    ]);
  }

  create() {
    setZOrderForMainGameElements(this.game);
    this.initSounds();

    // Observe window resizing with ResizeObserver since it works
    // better than window.addEventListener("resize", this.handleWindowResize.bind(this));
    // Seems to be more responsive to quick snaps and changes.
    this.lastKnownWindowSize = new Vec2(window.innerWidth, window.innerHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    this.subscribeToEvents();
    this.disableScroll();

    // Spawn in x random boids as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    instantiateBoids(this, 40).then((boids) => {
      this.boids = boids;

      // Continue with other initialization logic after boids are instantiated:
      // more code here eventually ...

      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
    });
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Check if it's time to perform a physics update
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // Handle the boid physics
        for (let boid of this.boids) {
          boid.handlePhysics(this.boids);
        }
      }
    }
  }

  // Sounds
  initSounds() {
    // Background sounds
    let backgroundMusicSound = this.sound.add("Background music");
    backgroundMusicSound.setLoop(true);
    backgroundMusicSound.setVolume(1.0);
    backgroundMusicSound.mute = true; // mute to start
    backgroundMusicSound.play();
    this.sound_array.push({ sound: backgroundMusicSound, type: "background" });

    // UI Button sound
    let uiButtonClickSound = this.sound.add("Button Click");
    uiButtonClickSound.setVolume(0.1);
    uiButtonClickSound.mute = true; // mute to start
    this.sound_array.push({ sound: uiButtonClickSound, type: "UI" });
  }

  onClickMuteSound() {
    // Toggle mute
    this.audioMuted = !this.audioMuted;
    this.toggleMuteAllAudio();

    if (!this.audioMuted) {
      showMessage(this, "May need to turn off silent mode to hear audio!");
    }

    // Update icon of mute button based on state
    const muteSoundButtonContainer = document.querySelector(
      ".mute-button-container"
    );
    const muteSoundButton =
      muteSoundButtonContainer.querySelector(".info-button");
    const muteSoundButtonIcon = muteSoundButton.querySelector(".fas");

    muteSoundButtonIcon.classList.remove("fa-volume-xmark", "fa-volume-high");
    if (!this.audioMuted) {
      muteSoundButtonIcon.classList.add("fa-volume-high");
    } else {
      muteSoundButtonIcon.classList.add("fa-volume-xmark");
    }

    // Play sound!
    this.playDesiredSound("Button Click");
  }

  playDesiredSound(soundKey) {
    let soundObj = this.sound.get(soundKey);
    if (soundObj) {
      // Checking to prevent sound from playing a bunch of times in a row,
      // pretty much needs to be either not playing or a little ways in already
      // before it can play
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

  subscribeToEvents() {
    // Event listener for ui menu open / closed
    document.addEventListener(
      "uiMenuOpen",
      function (event) {
        if (this.uiMenuOpen == false) {
          this.uiMenuOpen = true;

          // Play sound!
          this.playDesiredSound("Button Click");
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance
    document.addEventListener(
      "uiMenuClosed",
      function (event) {
        if (this.uiMenuOpen == true) {
          this.uiMenuOpen = false;

          // Play sound!
          this.playDesiredSound("Button Click");
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

    // Mute button event listener
    document.addEventListener(
      "mute",
      function (event) {
        this.onClickMuteSound();
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

    // Event listener to detect when the user interacts with the game
    document.addEventListener(
      "pointerdown",
      function () {
        this.isInteracting = true;
      }.bind(this),
      { capture: true }
    );

    document.addEventListener(
      "pointerup",
      function () {
        this.isInteracting = false;
      }.bind(this),
      { capture: true }
    ); // Bind 'this' to refer to the class instance

    // Custom event that fires whenever pointer is held down longer than threshold during a click.
    // Pretty much for any "long" click tasks, like hold for this long to call this function.
    document.addEventListener(
      "pointerdown",
      function () {
        // Define holdTimer if it is not already (note that it gets cleared on pointerup below)
        pointerDownTime = Date.now();
        if (!holdTimer) {
          // Check holdThreshold seconds from now if we are still holding down pointer.
          holdTimer = setTimeout(() => {
            // If we are still holding down, dispatch pointerholdclick to tell the event listeners that we are held down
            let holdDuration = Date.now() - pointerDownTime;
            if (holdDuration >= holdThreshold) {
              document.dispatchEvent(new Event("pointerholdclick"));
            }

            // Reset holdTimer after it's triggered
            holdTimer = null;
          }, holdThreshold * 1000); // sec -> millisec
        }

        // When the pointer is released, clear the hold timer
        const pointerUpListener = () => {
          // Reset holdTimer when pointer is released
          clearTimeout(holdTimer);
          holdTimer = null;

          // Remove the event listener so that we only listen for pointerup once.
          // For reference, we re-listen for pointerup each time we hold down again.
          document.removeEventListener("pointerup", pointerUpListener);
        };
        document.addEventListener("pointerup", pointerUpListener, {
          once: true,
        });
      },
      { capture: true }
    );
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Get the new screen dimensions
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // Update positions of all boids based on new screen dimensions.
    // We want to retain the general location of the boid, so we try to position it
    // the same screen % it was before on the new screen.
    for (let boid of this.boids) {
      // Everything but main boid:
      if (boid.mainBoid == false) {
        // Calculate new position based on percentage of old position
        let new_x = (boid.graphic.x / this.lastKnownWindowSize.x) * screenWidth;
        let new_y =
          (boid.graphic.y / this.lastKnownWindowSize.y) * screenHeight;

        // handle re-sizing etc. of boid
        boid.handleWindowResize(new_x, new_y);
      }
      // Main boid only:
      else {
        // handle re-sizing etc. of boid ONLY... no new position like other boids
        boid.handleWindowResize(boid.graphic.x, boid.graphic.y);
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }
}
