function InitGame() {
  // Initialize Phaser Game
  var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Set the width of the game canvas
    height: window.innerHeight, // Set the height of the game canvas
    scale: {
      mode: Phaser.Scale.RESIZE,
      // parent: "phaser-example",
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
      preload: preload,
      create: create,
    },
  };

  var game = new Phaser.Game(config);

  // Preload assets
  function preload() {
    // Load the background image
    this.load.image(
      "game-background",
      "../../Shared-General-Assets/jpgs/Test_Image.jpg"
    );
  }

  // Create game objects
  function create() {
    // Add the background image to the scene
    let backgroundImage = this.add.image(0, 0, "game-background").setOrigin(0);
    backgroundImage.setSize(window.innerWidth, window.innerHeight);

    // Add a listener such that the background auto-sizes on resize
    this.scale.on("resize", function (gameSize) {
      // Resize the background image to fill the entire game canvas
      backgroundImage.setSize(gameSize.width, gameSize.height);
    });

    // Create a test box in the middle of the screen
    var graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1); // White color
    graphics.fillRect(0, 0, 100, 100);

    // Make the box follow the mouse
    this.input.on("pointermove", function (pointer) {
      graphics.x = pointer.worldX;
      graphics.y = pointer.worldY;
    });

    // Set the depth of the game canvas to be all the way in the back
    game.canvas.style.position = "absolute";
    game.canvas.style.left = "0";
    game.canvas.style.top = "0";
    game.canvas.style.zIndex = "1";

    // Get a reference to the css objects we want to position
    var gameHeader = document.querySelector(".game-header-banner");
    var helloWorldBox = document.querySelector(".hello-world-box ");

    // Set the z-index property for all other objs
    gameHeader.style.zIndex = "2";
    helloWorldBox.style.zIndex = "3";
  }
}
