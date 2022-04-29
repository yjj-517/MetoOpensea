<template>
  <div class="ProofAndResults">
    <div>{{ msg }}</div>
    <div class="ProofAndResults-box">
      <div class="ProofAndResults-box-tablearr" v-loading="loading">
        <p>白名单地址 :</p>
        <el-table
          :data="addArr"
          style="width: 100%"
          key="Date.now()"
          stripe
          height="260"
          border
        >
          <el-table-column prop="number" label="number" width="280">
          </el-table-column>
          <el-table-column prop="address" label="address">
            <template slot-scope="{ row }">
              <span id="copyCode">{{ row.address }}</span>
              <el-button
                @click="copySecretKey(row)"
                class="tag"
                type="success"
                plain
                >复制</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ProofAndResults-Btn-proof">
        <span>需要证明的地址 :</span>
        <el-input v-model="needAddress" clearable></el-input>
        <el-button type="primary" plain @click="createCorrectMerkle"
          >生成证明</el-button
        >
      </div>
      <el-divider></el-divider>
      <div class="ProofAndResults-Btn-table">
        <p>
          Proof of address : <span>{{ needAddress }}</span>
        </p>
        <div class="tablearr" v-loading="loading">
          <el-table
            :data="proof"
            style="width: 100%"
            key="Date.now()"
            stripe
            height="200"
            border
          >
            <el-table-column type="index" label="number" width="280">
            </el-table-column>
            <el-table-column label="address">
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="ProofAndResults-Btn-result">
        <div>
          <el-button
            @click="verifyMerkleProofOther"
            :disabled="verifyOtherStatus"
            type="warning"
            plain
            >验证别人的地址</el-button
          >
          <span>验证结果 :</span>
          <el-button
            disabled
            :style="{ color: colorOther, backgroundColor: bgColorOther }"
            >{{ resultOther }}</el-button
          >
        </div>
        <el-button plain type="success" @click="jumpBlindbox"
          >跳转到盲盒操作页面</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
//abi接口封装函数
import abiContract from "@/utils/abi.js";
// import { ethers } from "ethers"; //引入ethers.js
import Clipboard from "clipboard";
export default {
  name: "ProofAndResults",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to Proof And Results Page",
      proof: [], // 合法的证据
      verifyOtherStatus: true, // 验证别人的地址证据的禁用状态
      needAddress: "", // 需要证明的账户地址
      loading: false, //loading窗的状态
      resultOther: "暂未验证", // 验证别人账户的结果
      colorOther: "#aaa", // 验证别人账户结果的默认字体颜色
      bgColorOther: "#fff", // 验证别人账户结果后的背景颜色
      tree: "", // Merkle 树
      addArr: [], // 接收vuex中addArr的数据
      leafNodes: [],
      contractAddress: "", // 合约地址
      data: "", // abi文件
    };
  },
  // 方法
  methods: {
    // 点击生成证明
    async createCorrectMerkle() {
      if (this.needAddress) {
        // 生成参与 verifyMerkleProof 地址的 Merkle 证明
        let leaf = keccak256(this.needAddress);
        console.log(leaf);
        this.tree = new MerkleTree(this.leafNodes, keccak256, {
          sortPairs: true,
        });
        console.log(this.tree);
        let proof = this.tree.getHexProof(leaf);
        console.log(proof);
        this.proof = proof;
        this.$set(this, "proof", proof);
        console.log(`Proof of ${this.needAddress}: `, this.proof);
        this.verifyOtherStatus = false; // 解除验证别人的地址证据的禁用状态
        // 将验证结果的按钮复原
        this.colorOther = "#aaa";
        this.bgColorOther = "#fff";
        this.resultOther = "暂未验证";
      } else {
        this.$message({
          showClose: true,
          message: "请先输入需要验证的账户地址哦~",
          type: "warning",
        });
      }
    },

    // 验证别人的地址的Merkle证据
    async verifyMerkleProofOther() {
      // 定义封装的abiContract
      let contract = await new abiContract(this.contractAddress, this.data);
      // 调用智能合约验证Merkle证明
      let transaction = await contract.TmetoNFTContract.ownerVerifyMerkleProof(
        this.proof,
        this.needAddress
      );
      console.log(transaction);
      if (transaction == true) {
        this.resultOther = "正确";
        this.colorOther = "#fff";
        this.bgColorOther = "#67c23a";
      } else if (transaction == false) {
        this.resultOther = "错误";
        this.colorOther = "#fff";
        this.bgColorOther = "#f00";
      }
    },

    // 跳转到盲盒操作页面
    async jumpBlindbox() {
      this.$store.commit("setproof", this.proof);
      this.$router.push("/index/Blindbox");
    },

    // 复制
    copySecretKey(data) {
      let clipboard = new Clipboard(".tag", {
        text: function () {
          return data.address;
        },
      });
      clipboard.on("success", (e) => {
        console.log("复制成功", e);
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        console.log("复制失败", e);
        clipboard.destroy();
      });
    },
  },
  // 创建后
  created() {
    // 从vuex的数据库中取出数据
    this.addArr = this.$store.state.addArr;
    this.leafNodes = this.$store.state.leafNodes;
     // 读取本地存储的合约地址和abi
    this.contractAddress = JSON.parse(localStorage.cAddress);
    this.data = JSON.parse(localStorage.abi);
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
.ProofAndResults {
  width: 100%;
  height: 100%;
  .ProofAndResults-box {
    margin-top: 2rem;
    .ProofAndResults-box-tablearr {
      span {
        display: inline-block;
        width: 20rem;
      }
      p {
        margin-bottom: 1rem;
      }
      .tag {
        margin-left: 8rem;
      }
    }
    .ProofAndResults-Btn-proof {
      display: flex;
      align-items: center;
      margin-top: 2rem;
      .el-input {
        width: 25rem;
        margin: 0 1rem;
      }
    }
  }
  .ProofAndResults-Btn-table {
    display: flex;
    flex-direction: column;
    p {
      padding-bottom: 1rem;
      span {
        color: chocolate;
      }
    }
  }
  .ProofAndResults-Btn-result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      margin: 0 1rem;
    }
  }
}
</style>
