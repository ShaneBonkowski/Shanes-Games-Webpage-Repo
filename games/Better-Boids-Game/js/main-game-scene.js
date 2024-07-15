/**
 * @module BoidMainGameScene
 *
 * @author Shane Bonkowski
 */

import { instantiateBoids, boidEventNames } from "./boid-utils.js";
import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { rigidBody2DEventNames } from "../../Shared-Game-Assets/js/rigid-body-2d.js";
import { createFunctionButtonContainer } from "/Main-Website-Assets/js/buttons.js";
import { showMessage } from "../../Shared-Game-Assets/js/phaser-message.js";
import { GameObject } from "../../Shared-Game-Assets/js/game-object.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";

// Used to determine if pointer is held down
const holdThreshold = 0.1; // seconds
let pointerDownTime = 0;
let holdTimer = null;

// Export so other scripts can access this
export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });
    this.boids = [];
    this.lastKnownWindowSize = new Vec2(0, 0);

    // Bind "this" to refer to the scene for necc. functions
    this.onClickMuteSound = this.onClickMuteSound.bind(this);
  }

  preload() {
    // Images
    this.load.image("Bad Boid", "./webps/Bad-Boid.webp");
    this.load.image("Good Boid", "./webps/Good-Boid.webp");
    this.load.image("Leader Boid", "./webps/Leader-Boid.webp");

    // Spritesheets
    this.load.spritesheet(
      "Bad Boid Anim",
      "./webps/Bad-Boid-Anim-Spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Good Boid Anim",
      "./webps/Good-Boid-Anim-Spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Leader Boid Anim",
      "./webps/Leader-Boid-Anim-Spritesheet.webp",
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

    // Observe window resizing with ResizeObserver since it seems
    // to be more responsive to quick snaps and changes.
    // NOTE: We store the last known window size so we can update boids positions etc.
    // based on this as the screen size changes
    this.lastKnownWindowSize = new Vec2(window.innerWidth, window.innerHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try
    // to handle edge cases that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );

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
      // Physics update at a slower rate
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

      // Graphics update will occur every frame
      for (let boid of this.boids) {
        boid.updateGraphic();
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
    // If a boid screenEdgeCollision occurs:
    document.addEventListener(
      rigidBody2DEventNames.screenEdgeCollision,
      (event) => {
        const { gameObjectId, direction } = event.detail;

        // Find the GameObject by ID
        const collidedObject = GameObject.getById(gameObjectId);

        // If the object is found and its name is "Boid", call onCollideScreenEdge
        if (collidedObject && collidedObject.name === "Boid") {
          collidedObject.onCollideScreenEdge(direction);
        }
      }
    );

    // Event listener for ui menu open / closed
    document.addEventListener(
      genericGameEventNames.uiMenuOpen,
      function (event) {
        if (this.uiMenuOpen == false) {
          this.uiMenuOpen = true;

          // Play sound!
          this.playDesiredSound("Button Click");
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance
    document.addEventListener(
      genericGameEventNames.uiMenuClosed,
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
      genericGameEventNames.mute,
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
              document.dispatchEvent(
                new Event(boidEventNames.pointerholdclick)
              );
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
        let new_x =
          (boid.physicsBody2D.position.x / this.lastKnownWindowSize.x) *
          screenWidth;
        let new_y =
          (boid.physicsBody2D.position.y / this.lastKnownWindowSize.y) *
          screenHeight;

        // handle re-sizing etc. of boid
        boid.handleWindowResize(new_x, new_y);
      }
      // Main boid only:
      else {
        // handle re-sizing etc. of boid ONLY... no new position like other boids
        boid.handleWindowResize(
          boid.physicsBody2D.position.x,
          boid.physicsBody2D.position.y
        );
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }
}
