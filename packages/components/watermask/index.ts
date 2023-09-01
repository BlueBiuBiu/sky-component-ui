import { App, Plugin } from "vue";
import Watermask from "./src/index.vue";

export const watermaskPlugin: Plugin = {
  install(app: App) {
    app.component("sky-watermask", Watermask);
  },
};

export { Watermask };
