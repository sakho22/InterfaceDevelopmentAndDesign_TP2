import { createStore } from "vuex";
import userModule from "./user";
import flowerModule from "./flower";
const store = createStore({
    modules: {
        user: userModule,
        flower: flowerModule,
    },
});

export default store;
