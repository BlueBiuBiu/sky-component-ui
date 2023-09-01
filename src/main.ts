import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "normalize.css";
import "./assets/css/index.less";
import "element-plus/dist/index.css";
import "@arco-design/web-vue/dist/arco.less";
import MyComponent from "../packages";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

const app = createApp(App);
app.use(MyComponent);
app.use(router);
app.use(ArcoVueIcon);
app.mount("#app");
