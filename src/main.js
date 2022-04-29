import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

import { message } from "./utils/message"; //引用message要在Vue.use(ElementUI)后面，不然没有效果
Vue.prototype.$message = message;

// 引入样式重置表
import "../src/assets/css/reset.css";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
