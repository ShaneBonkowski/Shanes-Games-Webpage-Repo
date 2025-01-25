export class DragManager {
  constructor(
    onStartDrag = null,
    onDrag = null,
    onStopDrag = null,
    tickRate = 16.67, // 16.67ms ~= 60hz
    dragRate = 0.5
  ) {
    this.initialize();

    this.dragRate = dragRate;
    this.tickRate = tickRate; // Maximum frequency in milliseconds
    this.lastCallTime = 0;
    this.onStartDrag = onStartDrag;
    this.onDrag = onDrag;
    this.onStopDrag = onStopDrag;

    this.attachListeners();
  }

  resetDrag() {
    this.initialize();
  }

  initialize() {
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.isDragging = false;
    this.dragBlocked = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragTarget = null;
  }

  startDrag(event) {
    // Only start drag if there's exactly 1 touch (finger) or 1 pointer event
    if (this.dragBlocked || (event.touches && event.touches.length !== 1))
      return;

    this.isDragging = true;
    const { clientX, clientY } = this.getEventPosition(event);
    this.dragStartX = clientX;
    this.dragStartY = clientY;

    // Store the clicked element
    this.dragTarget = event.target;

    if (this.onStartDrag != null) {
      this.onStartDrag();
    }
  }

  drag(event) {
    // Only handle drag if there's exactly 1 touch (finger) or 1 pointer event
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

    // Throttle the onDrag callback
    const now = performance.now();
    if (
      this.onDrag != null &&
      (!this.lastCallTime || now - this.lastCallTime >= this.tickRate)
    ) {
      this.onDrag();
      this.lastCallTime = now;
    }

    // // Optionally, notify of changes (e.g., update UI)
    // console.log(`OffsetX: ${this.dragOffsetX}, OffsetY: ${this.dragOffsetY}`);
  }

  stopDrag() {
    this.isDragging = false;
    this.dragTarget = null;

    if (this.onStopDrag != null) {
      this.onStopDrag();
    }
  }

  blockDrag() {
    this.dragBlocked = true;
  }

  unblockDrag() {
    this.dragBlocked = false;
  }

  getEventPosition(event) {
    if (event.touches && event.touches[0]) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  }

  attachListeners() {
    window.addEventListener("pointerdown", this.startDrag.bind(this));
    window.addEventListener("pointermove", this.drag.bind(this));
    window.addEventListener("pointerup", this.stopDrag.bind(this));
  }

  detachListeners() {
    window.removeEventListener("pointerdown", this.startDrag.bind(this));
    window.removeEventListener("pointermove", this.drag.bind(this));
    window.removeEventListener("pointerup", this.stopDrag.bind(this));
  }
}
