/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export default class EventBus {
  private listeners: Record<string, Function[]>;
  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) {
      throw new Error(`No such event: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  emit<T extends unknown[] = []>(event: string, ...args: T) {
    if (!this.listeners[event]) {
      throw new Error(`No such event: ${event}`);
    }
    this.listeners[event].forEach(function (listener) {
      listener(...args);
    });
  }
}
