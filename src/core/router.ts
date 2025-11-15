import Route from "./route";
import Block from "./block";
import type { BlockProps, Nullable } from "./types";

type BlockConstructor = new () => Block<BlockProps>;

// Responsible for changing URL and calling Route
class Router {
  private static __instance: Nullable<Router> = null;
  private routes!: Route[];
  private history!: History;
  private _currentRoute!: Nullable<Route>;
  private _rootQuery!: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  // register a new route with path and block
  use(pathname: string, block: BlockConstructor): Router {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  // starts the router on popstate event
  start(): void {
    // Реагируем на изменения в адресной строке и вызываем перерисовку
    window.onpopstate = (event: PopStateEvent): void => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      console.error(`Route not found: ${pathname}`);
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  // goes to specified path and renders block
  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  // goes back in history and renders corresponding block
  back(): void {
    this.history.back();
  }

  // goes forward in history and renders corresponding block
  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Nullable<Route> {
    const route = this.routes.find((route) => route.match(pathname)) || null;
    if (!route) {
      return this.routes.find((route) => route.match("*")) || null;
    }
    return route;
  }
}

export default Router;
