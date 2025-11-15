import type { AppState } from "../types";
import EventBus from "./event-bus";
import type { Nullable } from "./types";

export enum StoreEvents {
  Updated = "Updated",
}

export class Store<T extends AppState = AppState> extends EventBus {
  private static __instance: Nullable<Store<AppState>> = null;
  private state!: AppState;

  constructor(defaultState: T) {
    if (Store.__instance) {
      return Store.__instance as Store<T>;
    }
    super();

    this.on(StoreEvents.Updated, () => {});
    this.set(defaultState);
    Store.__instance = this;
  }

  public getState(): T {
    return this.state as T;
  }

  public set(nextState: Partial<AppState>): void {
    const prevState = { ...this.state };

    this.state = { ...this.state, ...nextState };

    this.emit(StoreEvents.Updated, prevState, nextState);
  }
}
