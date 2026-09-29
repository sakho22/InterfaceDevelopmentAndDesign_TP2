import { createApp } from "vue";
import App from "./src/App.vue";
import router from "./src/router/main.js";
import store from "./src/store/store.js";

createApp(App).use(router).use(store).mount("#app");
