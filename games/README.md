## Developing a New Game for Shane's Games

Games in this repository are built using Phaser.js, a lightweight library to build games in JavaScript!

### Step 0.) Duplicate and rename the `games/Generic-Game-Blueprint`

This blueprint exists in order to initialize an html file, as well as the general structure
used to create a phaser.js game canvas. This will `Game Name` and other placeholder values can
be filled in with one's actual name of their game etc.

Main points to consider in this framework are the following:

- The `GameName.html` is the entry point into the game from the Shane's Games website. This will initialize
  neccesary variables and call the functions that enter into the game loop. The comments contained in this
  file should be helpful in explaining what each portion of the code is doing.
- `z-ordering.js` is helpful for dictating the z-positioning of elements on the page. As new elements are added,
  be sure to update this file!
- `main-game-scene.js`, as the name suggests defines the main game scene for which gameplay takes place. Phaser.js
  works using a "scene" framework. One may consider having for example a "main menu" scene, a "main game" scene,
  or even multiple scenes where there is one scene per level in a game.
- `game.js` is the brains of the operation, and determines how and when to load in different scenes.

### Step 1.) Create a Content Box that will appear on the main page of the website.

This content box will be where players click to be directed to the page with the game. To add a new content box,
simply go into the `content-box.js` file and add to the `const contentBoxes` array. This requires a link to the html
file for the game, as well as a url to the cover image for the game.

### Step 2.) Add and modify as you see fit!

This framework is not intended to confine a developer to a specific type of game. Feel free to modify
and make suggestions! The only real requirements are centered around the game header existing so that a
user can make it back to the main website, and the content box existing so that a user can find the game!

## A note on artwork and image formats

All references to images in the code should be to .webp images in the webp folder. More detail on why this is
neccesary can be found in the `Image-Guidelines-Documentation/README.md` file. A good workflow, also touched on
in the same README referenced, is to start by creating a png image of any size and then use the Python
functions provided to downsize the image and convert to .webp in order to optimize the website assets.

The only images that are required to be a specific size are the logo image and the content box cover image.

- Logo Image: 200 by 200 pixels
- Cover Image: 500 by 422 pixels
