import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index/Home",
  },
  {
    path: "/index",
    name: "index",
    component: () => import("../views/Index.vue"),

    //嵌套二级路由
    children: [
      {
        path: "/index/Home",
        name: "/index/Home",
        component: () => import("../views/modules/Home.vue"),
      },
      {
        path: "/index/MerkleTreeTest",
        name: "/index/MerkleTreeTest",
        component: () => import("../views/modules/MerkleTreeTest.vue"),
      },
      {
        path: "/index/MerkleTreeUs",
        name: "/index/MerkleTreeUs",
        component: () =>
          import("../views/modules/MerkleTreeTest/MerkleTreeUs.vue"),
      },
      {
        path: "/index/MerkleTreeUsPage",
        name: "/index/MerkleTreeUsPage",
        component: () =>
          import("../views/modules/MerkleTreeTest/MerkleTreeUsPage.vue"),
      },
      {
        path: "/index/WhiteListManagement",
        name: "/index/WhiteListManagement",
        component: () => import("../views/modules/WhiteListManagement.vue"),
      },
      {
        path: "/index/RootHash",
        name: "/index/RootHash",
        component: () =>
          import("../views/modules/WhiteListManagement/RootHash.vue"),
      },
      {
        path: "/index/ProofAndResults",
        name: "/index/ProofAndResults",
        component: () =>
          import("../views/modules/WhiteListManagement/ProofAndResults.vue"),
      },
      {
        path: "/index/Blindbox",
        name: "/index/Blindbox",
        component: () =>
          import("../views/modules/WhiteListManagement/Blindbox.vue"),
      },
      {
        path: "/index/PreSaleRootHash",
        name: "/index/PreSaleRootHash",
        component: () =>
          import("../views/modules/WhiteListManagement/PreSaleRootHash.vue"),
      },
      {
        path: "/index/WhiteListStore",
        name: "/index/WhiteListStore",
        component: () => import("../views/modules/WhiteListStore.vue"),
      },
      {
        path: "/index/OpenStore",
        name: "/index/OpenStore",
        component: () => import("../views/modules/OpenStore.vue"),
      },
      {
        path: "/index/PreSaleStore",
        name: "/index/PreSaleStore",
        component: () => import("../views/modules/PreSaleStore.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
