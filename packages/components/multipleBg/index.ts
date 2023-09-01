import { App, Plugin } from "vue";
import MultipleBg from "./src/index.vue";

export const multipleBgPlugin: Plugin = {
  install(app: App) {
    app.component("sky-multiple-bg", MultipleBg);
  },
};

export { MultipleBg };
