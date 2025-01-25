import { MoreMath } from "./more-math.js";

export class ZoomManager {
  constructor(
    onZoom = null,
    tickRate = 16.67, // 16.67ms ~= 60hz
    zoomRate = 0.06
  ) {
    this.initialize();

    this.zoomRate = zoomRate;
    this.tickRate = tickRate; // Maximum frequency in milliseconds
    this.lastCallTime = 0;
    this.onZoom = onZoom;

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
    this.updateZoom(delta * this.zoomRate);
    event.preventDefault(); // Prevent page scroll
  }

  startPinch(event) {
    // Record initial distance between touches for pinch gesture
    if (event.touches.length === 2) {
      this.initialPinchDistance = this.getPinchDistance(event);
    }
  }

  handlePinch(event) {
    // Handle pinch gesture (calculate zoom based on pinch distance change)
    if (event.touches.length === 2 && this.initialPinchDistance !== null) {
      const currentDistance = this.getPinchDistance(event);
      const deltaDistance = currentDistance - this.initialPinchDistance;

      // If the pinch distance changes above some threshold, update zoom
      if (Math.abs(deltaDistance) > 5) {
        const zoomDelta = deltaDistance > 0 ? 1 : -1;
        this.updateZoom(zoomDelta * this.zoomRate);
        this.initialPinchDistance = currentDistance; // Update initial pinch distance
      }
    }
  }

  endPinch() {
    this.initialPinchDistance = null;
  }

  updateZoom(delta) {
    if (this.zoomBlocked) return;

    this.zoomOffset += delta;
    this.zoomOffset = MoreMath.clamp(this.zoomOffset, 0.1, 5);

    // Throttle the onZoom callback
    const now = performance.now();
    if (
      this.onZoom != null &&
      (!this.lastCallTime || now - this.lastCallTime >= this.tickRate)
    ) {
      this.onZoom();
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

  blockZoom() {
    this.zoomBlocked = true;
  }

  unblockZoom() {
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
    window.addEventListener("touchstart", this.startPinch.bind(this), {
      passive: false,
    });
    window.addEventListener("touchmove", this.handlePinch.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.endPinch.bind(this), {
      passive: false,
    });
  }
}
