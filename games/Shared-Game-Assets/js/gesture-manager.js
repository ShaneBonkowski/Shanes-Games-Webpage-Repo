import { MoreMath } from "./more-math.js";

export class GestureManager {
  constructor(dragRate = 0.5, zoomRate = 0.06) {
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
  }

  handlePointerDown(event) {
    // If it is a computer (aka event.touches is null), or a phone with 1 finger down, then
    // pointer down means drag
    if (!event.touches || event.touches.length === 1) {
      this.startDrag(event);
    }
    // Otherwise, 2 fingers down on phone means zoom
    else if (event.touches && event.touches.length === 2) {
      this.startZoom(event);
    }
  }

  handlePointerMove(event) {
    if (this.isZooming) {
      this.zoom(event);
    } else if (this.isDragging) {
      this.drag(event);
    }
  }

  handlePointerUp(event) {
    if (this.isZooming) {
      this.stopZoom(event);
    } else if (this.isDragging) {
      this.stopDrag(event);
    }
  }

  startDrag(event) {
    // Only start drag if there's exactly 1 touch (finger) for phone.
    if (this.dragBlocked || (event.touches && event.touches.length !== 1))
      return;

    this.isDragging = true;
    const { clientX, clientY } = this.getEventPosition(event);
    this.dragStartX = clientX;
    this.dragStartY = clientY;

    // Block zooming while dragging
    this.blockZoom();
  }

  drag(event) {
    // Only handle drag if there's exactly 1 touch (finger) for phone
    if (
      this.dragBlocked ||
      !this.isDragging ||
      (event.touches && event.touches.length !== 1)
    )
      return;

    const { clientX, clientY } = this.getEventPosition(event);
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
    this.dragTarget = null;

    // Allow zooming when dragging is done
    this.unblockZoom();
  }

  blockDrag(event = null) {
    this.dragBlocked = true;
  }

  unblockDrag(event = null) {
    this.dragBlocked = false;
  }

  getEventPosition(event) {
    if (event.touches && event.touches.length == 1) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  }

  startZoom(event) {
    // Record initial distance between touches for pinch gesture
    if (this.zoomBlocked || (event.touches && event.touches.length !== 2)) {
      return;
    }

    this.initialPinchDistance = this.getPinchDistance(event);

    // Block dragging while zooming
    this.blockDrag();
  }

  handleWheel(event) {
    const delta = event.deltaY > 0 ? -1 : 1; // Scroll down is negative, up is positive
    this.updateZoom(event, delta * this.zoomRate);
    event.preventDefault(); // Prevent page scroll
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

  updateZoom(event, delta) {
    if (this.zoomBlocked) return;

    this.zoomOffset += delta;
    this.zoomOffset = MoreMath.clamp(this.zoomOffset, 0.1, 5);

    // console.log(`Zoom Offset: ${this.zoomOffset}`);
  }

  stopZoom(event) {
    this.initialPinchDistance = null;

    // Allow dragging when zooming is done
    this.unblockDrag();
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
  }

  unblockZoom(event = null) {
    this.zoomBlocked = false;
  }
}
