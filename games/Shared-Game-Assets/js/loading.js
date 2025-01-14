/**
 * @module Loading
 *
 * @author Shane Bonkowski
 */

/**
 * Handles animations for the entry loading screen for a game html file.
 */
export function gamesEntryHtmlLoadingScreenAnimations() {
  const gameLoadInOverlay = document.getElementById("game-load-in-overlay");
  const gameLoadingContentImg = document.getElementById(
    "game-loading-content-img"
  );

  let hasLoadedAnimPlayed = false;
  function playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay) {
    if (hasLoadedAnimPlayed) {
      console.log("played already");
      return;
    }

    gameLoadingContentImg.classList.remove(
      "game-loading-content-play-loading-anim"
    );
    gameLoadingContentImg.classList.add(
      "game-loading-content-play-loaded-anim"
    );
    gameLoadInOverlay.classList.add("game-load-in-overlay-play-anim");

    // Mark the animation as played
    hasLoadedAnimPlayed = true;
  }

  const timeout = setTimeout(() => {
    // Set a timeout to call the desired function after the specified duration,
    // if the event listeners for animationiteration() do not catch it. Since the loading
    // animation is only 0.6 seconds long, give it maximum 0.6 seconds to "catch up" which
    // assumes worse case. If it doesnt catch up by this point, then just proceed with
    // the next animation without trying to sync them up.
    console.log("Timeout reached, ending loading anim");
    playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay);
  }, 600); // ms

  gameLoadingContentImg.addEventListener("animationiteration", function () {
    playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay);
    clearTimeout(timeout); // Clear the timeout since the event fired
  });
  gameLoadingContentImg.addEventListener(
    "webkitAnimationIteration", // For Safari pre-9 or other browser compatibility
    function () {
      playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay);
      clearTimeout(timeout); // Clear the timeout since the event fired
    }
  );
  gameLoadingContentImg.addEventListener(
    "animationend", // Backup, this will fire when an animation or cycle of animation has ended
    function () {
      playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay);
      clearTimeout(timeout); // Clear the timeout since the event fired
    }
  );
  gameLoadingContentImg.addEventListener(
    "webkitAnimationEnd", // More backup, this will fire when an animation or cycle of animation has ended
    function () {
      playLoadedAnim(gameLoadingContentImg, gameLoadInOverlay);
      clearTimeout(timeout); // Clear the timeout since the event fired
    }
  );
}
