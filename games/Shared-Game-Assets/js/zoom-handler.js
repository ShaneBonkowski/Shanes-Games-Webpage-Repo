import { MoreMath } from "./more-math.js";

export class ZoomManager {
  constructor(
    onStartZoom = null,
    onZoom = null,
    onStopZoom = null,
    tickRate = 16.67, // 16.67ms ~= 60hz
    zoomRate = 0.06
  ) {
    this.initialize();

    this.zoomRate = zoomRate;
    this.tickRate = tickRate; // Maximum frequency in milliseconds
    this.lastCallTime = 0;

    this.onStartZoom = onStartZoom;
    this.onZoom = onZoom;
    this.onStopZoom = onStopZoom;

    this.attachListeners();
  }

  resetZoom() {
    this.initialize();
  }

  initialize() {
    this.zoomOffset = 1;
    this.zoomBlocked = false;
    this.initialPinchDistance = null;
  }

  handleWheel(event) {
    const delta = event.deltaY > 0 ? -1 : 1; // Scroll down is negative, up is positive
    this.updateZoom(event, delta * this.zoomRate);
    event.preventDefault(); // Prevent page scroll
  }

  startZoom(event) {
    // Record initial distance between touches for pinch gesture
    if (this.zoomBlocked || (event.touches && event.touches.length !== 2)) {
      return;
    }

    this.initialPinchDistance = this.getPinchDistance(event);

    if (this.onStartZoom != null) {
      this.onStartZoom(event);
    }
  }

  handleZoom(event) {
    // Handle pinch gesture (calculate zoom based on pinch distance change)
    if (
      this.zoomBlocked ||
      this.initialPinchDistance == null ||
      (event.touches && event.touches.length !== 2)
    ) {
      return;
    }

    const currentDistance = this.getPinchDistance(event);
    const deltaDistance = currentDistance - this.initialPinchDistance;

    // If the pinch distance changes above some threshold, update zoom
    if (Math.abs(deltaDistance) > 5) {
      const zoomDelta = deltaDistance > 0 ? 1 : -1;
      this.updateZoom(event, zoomDelta * this.zoomRate);
      this.initialPinchDistance = currentDistance; // Update initial pinch distance
    }
  }

  stopZoom(event) {
    this.initialPinchDistance = null;

    if (this.onStopZoom != null) {
      this.onStopZoom(event);
    }
  }

  updateZoom(event, delta) {
    if (this.zoomBlocked) return;

    this.zoomOffset += delta;
    this.zoomOffset = MoreMath.clamp(this.zoomOffset, 0.1, 5);

    // Throttle the onZoom callback
    const now = performance.now();
    if (
      this.onZoom != null &&
      (!this.lastCallTime || now - this.lastCallTime >= this.tickRate)
    ) {
      this.onZoom(event);
      this.lastCallTime = now;
    }

    // console.log(`Zoom Offset: ${this.zoomOffset}`);
  }

  getPinchDistance(event) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  blockZoom(event = null) {
    this.zoomBlocked = true;

    if (event != null) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  unblockZoom(event = null) {
    this.zoomBlocked = false;
  }

  attachListeners() {
    // Mouse wheel for zoom
    window.addEventListener(
      "wheel",
      this.handleWheel.bind(this),
      // passive = false informs the event that we might call preventDefault() inside it
      {
        passive: false,
      }
    );

    // Touch events for pinch-to-zoom
    window.addEventListener("touchstart", this.startZoom.bind(this), {
      passive: false,
    });
    window.addEventListener("touchmove", this.handleZoom.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.stopZoom.bind(this), {
      passive: false,
    });
  }
}
