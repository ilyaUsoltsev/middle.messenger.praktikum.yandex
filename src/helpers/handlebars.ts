import Handlebars from "handlebars";
import type { HelperOptions } from "handlebars";

export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper(
    "if_eq",
    function (this: unknown, a: unknown, b: unknown, options: HelperOptions) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  );
};
