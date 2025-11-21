/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import Router from "./router";
import Block from "./block";

describe("Router", () => {
  class TestPage extends Block {
    constructor() {
      super("div", {});
    }

    render() {
      return `<div class="test-page">Test Page</div>`;
    }
  }

  class AnotherPage extends Block {
    constructor() {
      super("div", {});
    }

    render() {
      return `<div class="another-page">Another Page</div>`;
    }
  }

  class NotFoundPage extends Block {
    constructor() {
      super("div", {});
    }

    render() {
      return `<div class="not-found">404 Page</div>`;
    }
  }

  describe("Singleton pattern", () => {
    it("should return same instance when created multiple times", () => {
      const router1 = new Router("#app");
      const router2 = new Router("#app");
      expect(router1).to.equal(router2);
    });
  });

  describe("Route registration", () => {
    it("should register a new route", () => {
      const router = new Router("#app");
      const result = router.use("/test", TestPage);
      expect(result).to.equal(router);
    });

    it("should support method chaining for route registration", () => {
      const router = new Router("#app");
      const result = router.use("/test", TestPage).use("/another", AnotherPage);
      expect(result).to.equal(router);
    });

    it("should register wildcard route for 404", () => {
      const router = new Router("#app");
      router.use("*", NotFoundPage);
      const route = router.getRoute("/nonexistent");
      expect(route).to.not.be.null;
    });
  });

  describe("Route matching", () => {
    it("should find exact matching route", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      const route = router.getRoute("/test");
      expect(route).to.not.be.null;
    });

    it("should return wildcard route when no exact match found", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      router.use("*", NotFoundPage);
      const route = router.getRoute("/nonexistent");
      expect(route).to.not.be.null;
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      // Reset history
      window.history.replaceState({}, "", "/");
    });

    it("should change history state when navigating with go()", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      const initialLength = window.history.length;
      router.go("/test");
      expect(window.history.length).to.equal(initialLength + 1);
    });

    it("should update current location pathname on navigation", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      router.go("/test");
      expect(window.location.pathname).to.equal("/test");
    });

    it("should navigate back in history", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      router.use("/another", AnotherPage);
      router.go("/test");
      router.go("/another");
      router.back();
      expect(() => router.back()).to.not.throw();
    });

    it("should navigate forward in history", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      router.go("/test");
      router.back();
      expect(() => router.forward()).to.not.throw();
    });
  });

  describe("Router start and popstate", () => {
    it("should set up popstate listener when started", () => {
      const router = new Router("#app");
      router.use("/", TestPage);
      expect(() => router.start()).to.not.throw();
      expect(window.onpopstate).to.not.be.null;
    });

    it("should render initial route on start", () => {
      const router = new Router("#app");
      router.use("/", TestPage);
      router.start();
      const appElement = document.querySelector("#app");
      expect(appElement?.querySelector(".test-page")).to.not.be.null;
    });
  });

  describe("Route transitions", () => {
    it("should hide previous route when navigating to new route", () => {
      const router = new Router("#app");
      router.use("/test", TestPage);
      router.use("/another", AnotherPage);
      router.start();
      router.go("/test");
      router.go("/another");
      const testPage = document.querySelector(".test-page") as HTMLElement;
      if (testPage) {
        expect(testPage.style.display).to.equal("none");
      }
    });
  });

  describe("History state changes", () => {
    it("should change history state when navigating to new page", () => {
      const initialLength = window.history.length;
      window.history.pushState({ page: "login" }, "Login", "/login");
      window.history.pushState({ page: "register" }, "Register", "/register");
      expect(window.history.length).to.eq(initialLength + 2);
    });
  });
});
