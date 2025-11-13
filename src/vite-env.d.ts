/// <reference types="vite/client" />

import type Router from "./core/router";
import type { Store } from "./core/store";

declare global {
  interface Window {
    router: Router;
    store: Store;
  }
}
