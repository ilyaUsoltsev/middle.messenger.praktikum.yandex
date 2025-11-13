import Handlebars from "handlebars";
import type { HelperOptions } from "handlebars";

export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper(
    "if_eq",
    function (this: unknown, a: unknown, b: unknown, options: HelperOptions) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  );

  Handlebars.registerHelper("get_avatar_url", function (this: unknown, avatarPath: string) {
    if (!avatarPath) {
      return "";
    }
    return `https://ya-praktikum.tech/api/v2/resources${avatarPath}`;
  });

  // format time 2025-11-10T19:41:40+00:00 to HH:MM
  Handlebars.registerHelper("format_time", function (this: unknown, timeString: string) {
    const date = new Date(timeString);
    const now = new Date();
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " today";
    }
    return date.toLocaleDateString();
  });
};
