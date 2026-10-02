(() => {
  "use strict";

  /**
   * Dynamic pacing helper for UI automation.
   *
   * The dynamic delays are intended to reduce server load, provide API
   * courtesy, and allow graceful UI/network transitions before each step.
   * Scheduling is entirely timeout-based and event-driven.
   *
   * Manifest v2 content scripts are classic scripts, so the ES6 class is
   * exposed through globalThis for direct use by the existing content script.
   */
  class PacedNav {
    constructor(minBufferMs = 1200, maxBufferMs = 4300) {
      if (!Number.isFinite(minBufferMs) || !Number.isFinite(maxBufferMs)) {
        throw new TypeError("Pacing bounds must be finite numbers.");
      }
      if (minBufferMs < 0 || maxBufferMs < minBufferMs) {
        throw new RangeError("Invalid pacing bounds.");
      }

      this.minBufferMs = minBufferMs;
      this.maxBufferMs = maxBufferMs;
      this._timer = null;
      this._resolve = null;
      this._cancelled = false;
    }

    /** Promise-based asynchronous sleep utility. */
    sleep(ms) {
      const delay = Math.max(0, Number(ms) || 0);
      return new Promise(resolve => {
        const timer = setTimeout(() => {
          if (this._timer === timer) {
            this._timer = null;
            this._resolve = null;
          }
          resolve(true);
        }, delay);
        this._timer = timer;
        this._resolve = resolve;
      });
    }

    /** Calculate a fresh pacing offset for every workflow step. */
    calculateBuffer() {
      const range = this.maxBufferMs - this.minBufferMs;
      return Math.round(this.minBufferMs + Math.random() * range);
    }

    /**
     * Wait for a base delay, then apply the dynamic courtesy buffer.
     * Returns false when cancelled before the next automated action.
     */
    async wait(baseDelayMs = 0) {
      this._cancelled = false;

      const baseDelay = Math.max(0, Number(baseDelayMs) || 0);
      const baseReady = await this.sleep(baseDelay);
      if (!baseReady || this._cancelled) return false;

      const bufferMs = this.calculateBuffer();
      const bufferReady = await this.sleep(bufferMs);
      return !!bufferReady && !this._cancelled;
    }

    /**
     * Schedule one future action after a dynamic offset.
     * The supplied base delay is followed by a fresh 1200–4300 ms buffer.
     */
    schedule(baseDelayMs = 0, callback) {
      if (typeof callback !== "function") {
        throw new TypeError("callback must be a function.");
      }

      this.cancel();
      this._cancelled = false;

      const baseDelay = Math.max(0, Number(baseDelayMs) || 0);
      const totalDelay = baseDelay + this.calculateBuffer();
      this._timer = setTimeout(() => {
        this._timer = null;
        this._resolve = null;
        if (this._cancelled) return;
        void Promise.resolve().then(callback);
      }, totalDelay);

      return totalDelay;
    }

    /** Cancel a pending scheduled step or pacing wait. */
    cancel() {
      this._cancelled = true;
      if (this._timer !== null) {
        clearTimeout(this._timer);
        this._timer = null;
      }
      if (this._resolve) {
        const resolve = this._resolve;
        this._resolve = null;
        resolve(false);
      }
    }
  }

  globalThis.PacedNav = PacedNav;
  globalThis.pacedSleep = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
})();
