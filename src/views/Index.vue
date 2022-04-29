<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside width="260px">
      <el-menu
        @select="selectMenu"
        :default-active="activePath"
        background-color="#303030"
        text-color="#fff"
        active-text-color="#a4da89"
        unique-opened
        router
      >
        <div v-for="obj in treelist" :key="obj.index">
          <!-- 可展开的菜单儿子 -->
          <el-submenu v-if="obj.children" :index="obj.index">
            <template slot="title">
              <i :class="obj.i"></i>
              <span>{{ obj.text }}</span>
            </template>

            <!-- 儿子，应该循环当前数据的obj.children数组 -->
            <el-menu-item
              v-for="child in obj.children"
              :key="child.index"
              :index="child.index"
              >{{ child.text }}</el-menu-item
            >
          </el-submenu>

          <el-menu-item v-else :index="obj.index">
            <i :class="obj.i"></i>
            <span slot="title">{{ obj.text }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>

    <!-- 右侧 -->
    <el-container>
      <!-- 右-头 -->
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadList" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!-- 右-身 -->
      <el-main>
        <el-card>
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      treelist: [
        {
          index: "/index/Home",
          i: "el-icon-s-home",
          text: "Home",
          bread: ["Home"],
        },
        {
          index: "/index/MerkleTreeTest",
          i: "el-icon-success",
          text: "MerkleTreeTest",
          children: [
            {
              index: "/index/MerkleTreeUs",
              text: "Merkle Tree Us",
              bread: ["MerkleTreeTest", "MerkleTreeUs"],
            },
            {
              index: "/index/MerkleTreeUsPage",
              text: "Merkle Tree Us Page",
              bread: ["MerkleTreeTest", "MerkleTreeUsPage"],
            },
          ],
        },
        {
          index: "/index/WhiteListManagement",
          i: "el-icon-s-platform",
          text: "White List Management",
          children: [
            {
              index: "/index/RootHash",
              text: "WhiteList Root Hash",
              bread: ["WhiteListManagement", "WhiteListRootHash"],
            },
            {
              index: "/index/ProofAndResults",
              text: "WhiteList Proof And Results",
              bread: ["WhiteListManagement", "WhiteListProofAndResults"],
            },
            {
              index: "/index/PreSaleRootHash",
              text: "PreSale Root Hash",
              bread: ["WhiteListManagement", "PreSaleRootHash"],
            },
            {
              index: "/index/Blindbox",
              text: "Blind Box Manage",
              bread: ["WhiteListManagement", "BlindBoxManage"],
            },
          ],
        },
        {
          index: "/index/WhiteListStore",
          i: "el-icon-s-shop",
          text: "White List Store",
          bread: ["WhiteListStore"],
        },
        {
          index: "/index/OpenStore",
          i: "el-icon-office-building",
          text: "Open Store",
          bread: ["OpenStore"],
        },
        {
          index: "/index/PreSaleStore",
          i: "el-icon-alarm-clock",
          text: "PreSale Store",
          bread: ["PreSaleStore"],
        },
      ],
      breadList: [], // 面包屑数组
      activePath: "", // 当前激活哈希
    };
  },
  methods: {
    // 选中菜单
    selectMenu(index) {
      let bread = [];
      for (let obj of this.treelist) {
        // 判断是否有children,有则循环儿子
        if (obj.children) {
          for (let child of obj.children) {
            if (child.index == index) {
              bread = child.bread;
            }
          }
        } else {
          // 没有儿子，直接判断索引
          if (obj.index == index) bread = obj.bread;
        }
      }
      this.breadList = bread;
    },
  },
  mounted() {
    this.activePath = this.$route.path;
    this.selectMenu(this.activePath); // 找到当前选项卡的面包屑数组
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}

.el-container {
  width: 100%;
  height: 100%;

  .el-aside {
    background-color: #303030;
  }

  .el-header {
    background-color: #a4da89;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /deep/ .el-breadcrumb__inner {
      color: #fff;
      font-size: 16px;
    }
    /deep/ .el-breadcrumb__separator {
      color: #fff;
    }
  }
}
</style>
