import { MoreMath } from "./more-math.js";

export class GestureManager {
  constructor(dragRate = 0.5, zoomRate = 0.06) {
    this.activePointers = {};
    this.dragRate = dragRate;
    this.zoomRate = zoomRate;

    this.initializeDrag();
    this.initializeZoom();

    this.addEventListeners();
  }

  resetDrag() {
    this.initializeDrag();
  }

  initializeDrag() {
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.isDragging = false;
    this.dragBlocked = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
  }

  resetZoom() {
    this.initializeZoom();
  }

  initializeZoom() {
    this.zoomOffset = 1;

    this.isZooming = false;
    this.zoomBlocked = false;
    this.initialPinchDistance = null;
  }

  addEventListeners() {
    // Mouse wheel for zoom
    window.addEventListener(
      "wheel",
      this.handleWheel.bind(this),
      // passive = false informs the event that we might call preventDefault() inside it
      {
        passive: false,
      }
    );

    // Touch events for all other clicks touches etc.
    window.addEventListener(
      "pointerdown",
      (event) => this.handlePointerDown(event),
      { passive: false }
    );
    window.addEventListener(
      "pointermove",
      (event) => this.handlePointerMove(event),
      { passive: false }
    );
    window.addEventListener(
      "pointerup",
      (event) => this.handlePointerUp(event),
      {
        passive: false,
      }
    );
    window.addEventListener(
      "pointercancel",
      (event) => this.handlePointerUp(event),
      { passive: false }
    );
  }

  handlePointerDown(event) {
    // Add to active pointers
    this.activePointers[event.pointerId] = {
      x: event.clientX,
      y: event.clientY,
    };

    // 1 finger down, then pointer down means drag
    if (Object.keys(this.activePointers).length == 1) {
      this.startDrag(event);
    }
    // Otherwise, 2 fingers down means zoom
    else if (Object.keys(this.activePointers).length == 2) {
      this.startZoom(event);
    }
  }

  handlePointerMove(event) {
    // If this is a pointer in the pointer dictionary, update it's location
    if (this.activePointers[event.pointerId]) {
      this.activePointers[event.pointerId].x = event.clientX;
      this.activePointers[event.pointerId].y = event.clientY;

      if (this.isZooming) {
        this.handleZoom(event);
      } else if (this.isDragging) {
        this.handleDrag(event);
      }
    }
  }

  handlePointerUp(event) {
    // Remove pointer from the set of active pointers
    delete this.activePointers[event.pointerId];

    if (this.isZooming) {
      this.stopZoom(event);
    } else if (this.isDragging) {
      this.stopDrag(event);
    }
  }

  startDrag(event) {
    // Only start drag if there's exactly 1 touch (finger).
    if (this.dragBlocked || Object.keys(this.activePointers).length !== 1)
      return;

    this.isDragging = true;
    const { clientX, clientY } = this.getEventPosition();
    this.dragStartX = clientX;
    this.dragStartY = clientY;
  }

  handleDrag(event) {
    // Only handle drag if there's exactly 1 touch (finger).
    if (
      this.dragBlocked ||
      !this.isDragging ||
      Object.keys(this.activePointers).length !== 1
    )
      return;

    const { clientX, clientY } = this.getEventPosition();
    const deltaX = (clientX - this.dragStartX) * this.dragRate;
    const deltaY = (clientY - this.dragStartY) * this.dragRate;

    this.dragOffsetX += deltaX;
    this.dragOffsetY += deltaY;

    // Update the drag start position
    this.dragStartX = clientX;
    this.dragStartY = clientY;
  }

  stopDrag(event) {
    this.isDragging = false;
  }

  blockDrag() {
    this.dragBlocked = true;
  }

  unblockDrag() {
    this.dragBlocked = false;
  }

  getEventPosition() {
    const pointerLocations = Object.values(this.activePointers);
    return {
      clientX: pointerLocations[0].x,
      clientY: pointerLocations[0].y,
    };
  }

  startZoom(event) {
    // Record initial distance between touches for pinch gesture
    if (this.zoomBlocked || Object.keys(this.activePointers).length !== 2) {
      return;
    }

    this.isZooming = true;
    this.initialPinchDistance = this.getPinchDistance();
  }

  handleWheel(event) {
    // Wheel does not care if it "isZooming" because it doesnt rely on pointer events
    if (this.zoomBlocked) {
      return;
    }

    const delta = event.deltaY > 0 ? -1 : 1; // Scroll down is negative, up is positive
    this.updateZoom(delta * this.zoomRate);
    event.preventDefault(); // Prevent page scroll
  }

  handleZoom(event) {
    // Handle pinch gesture (calculate zoom based on pinch distance change)
    if (
      this.zoomBlocked ||
      !this.isZooming ||
      this.initialPinchDistance == null ||
      Object.keys(this.activePointers).length !== 2
    ) {
      return;
    }

    const currentDistance = this.getPinchDistance();
    const deltaDistance = currentDistance - this.initialPinchDistance;

    // If the pinch distance changes above some threshold, update zoom
    if (Math.abs(deltaDistance) > 5) {
      const zoomDelta = deltaDistance > 0 ? 1 : -1;
      this.updateZoom(zoomDelta * this.zoomRate);
      this.initialPinchDistance = currentDistance; // Update initial pinch distance
    }
  }

  updateZoom(delta) {
    if (this.zoomBlocked) return;

    this.zoomOffset += delta;
    this.zoomOffset = MoreMath.clamp(this.zoomOffset, 0.1, 5);

    // console.log(`Zoom Offset: ${this.zoomOffset}`);
  }

  stopZoom(event) {
    this.isZooming = false;
    this.initialPinchDistance = null;
  }

  getPinchDistance() {
    const pointerLocations = Object.values(this.activePointers);
    const dx = pointerLocations[1].x - pointerLocations[0].x;
    const dy = pointerLocations[1].y - pointerLocations[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  blockZoom() {
    this.zoomBlocked = true;
  }

  unblockZoom() {
    this.zoomBlocked = false;
  }
}
