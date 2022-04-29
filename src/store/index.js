import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addArr: [], // 存放白名单地址的数组
    proofArr: [], // 存放证明的数组
    leafNodes: [], // 存放tree数组
  },
  mutations: {
    setAddArr(state, data) {
      state.addArr = data;
    },
    setproof(state, data) {
      state.proofArr = data;
    },
    setLeafNodes(state, data) {
      state.leafNodes = data;
    },
  },
  actions: {},
  modules: {},
});
