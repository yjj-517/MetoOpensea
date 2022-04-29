<template>
  <div class="MerkleTreeUs">
    <div>{{ msg }}</div>
    <div class="MerkleTreeUs-Btn">
      <p class="MerkleTreeUs-Btn-proof">
        <span>需要证明的地址 :</span>
        <el-input v-model="needAddress" clearable></el-input>
        <el-button type="primary" plain @click="createCorrectMerkle"
          >生成证据</el-button
        >
      </p>
      <el-divider></el-divider>
      <el-button @click="setMerkle" :disabled="setMstatus"
        >设置根哈希</el-button
      >
      <el-button @click="verifyMerkleProof" :disabled="verifystatus"
        >验证Merkle证据</el-button
      >
      <el-button @click="verifyMerkleProofOther" :disabled="verifyOtherStatus"
        >验证别人的地址</el-button
      >
    </div>
  </div>
</template>

<script>
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "ethers"; //引入ethers.js
import Web3Modal from "web3modal"; //引入Web3Modal
// TmetoNFT合约
import TmetoNFT from "@/contracts/TmetoNFT10_ABI.json"; // 引入abi
const tmetoNFTaddress = "0x777B3Ecad8363DfbBBecF14af782935805ACbC0C";

export default {
  name: "MerkleTreeUs",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to Merkle Tree Us Page",
      rootHash: "", // 根哈希
      proof: "", // 合法的证据
      setMstatus: true, // 设置根哈希的禁用状态
      verifystatus: true, // 验证Merkle证据的禁用状态
      verifyOtherStatus: true, // 验证别人的地址证据的禁用状态
      needAddress: "", // 需要证明的账户地址
    };
  },
  // 方法
  methods: {
    // 点击正确(合法)证据
    async createCorrectMerkle() {
      if (this.needAddress) {
        let whitelistAddresses = [
          "0x7a3e4ACB8E428cba0800A3518666Ba2Df071E711",
          "0xCED27893eeA69b3fF1E57b5Ce40F19662e9296F5",
          "0x299e3572a73765110200ede8cC73CDeaE1017E5C",
          "0xC0FB55B2afD71F4d25c758aE0dd98321D0D6f943",
        ];

        let leafNodes = whitelistAddresses.map((address) => keccak256(address));
        let tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

        console.log("Tree: ", tree.toString());
        const root = tree.getRoot();
        console.log("Root hash is: ", root.toString("hex")); // 得到根哈希
        // 赋值
        this.rootHash = "0x" + root.toString("hex");
        console.log(this.rootHash);

        // 生成参与 verifyMerkleProof 地址的 Merkle 证明
        let leaf = keccak256(this.needAddress);
        let proof = tree.getHexProof(leaf);
        this.proof = proof;
        console.log(`Proof of ${this.needAddress}: `, this.proof);
        this.setMstatus = false; // 解除设置根哈希的禁用状态
      } else {
        this.$message({
          showClose: true,
          message: "请先输入需要验证的账户地址哦~",
          type: "warning",
        });
      }
    },

    // 设置 Merkle 根哈希
    async setMerkle() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const TmetoNFTContract = new ethers.Contract(
        tmetoNFTaddress,
        TmetoNFT.abi,
        signer
      );
      // 调用智能合约设置Merkle的根哈希
      let transaction = await TmetoNFTContract.setSaleMerkleRoot(this.rootHash);
      let data = await transaction.wait();
      console.log(data);
      this.verifystatus = false; // 解除验证Merkle证据的禁用状态
      this.verifyOtherStatus = false; // 解除验证别人的地址证据的禁用状态
    },

    // 验证Merkle证据
    async verifyMerkleProof() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const TmetoNFTContract = new ethers.Contract(
        tmetoNFTaddress,
        TmetoNFT.abi,
        signer
      );
      // 调用智能合约验证Merkle证明
      let transaction = await TmetoNFTContract.verifyMerkleProof(this.proof);
      // let data = await transaction.wait();
      // console.log(data);
      console.log(transaction);
    },

    // 验证别人的地址的Merkle证据
    async verifyMerkleProofOther() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const TmetoNFTContract = new ethers.Contract(
        tmetoNFTaddress,
        TmetoNFT.abi,
        signer
      );
      // 调用智能合约验证Merkle证明
      let transaction = await TmetoNFTContract.ownerVerifyMerkleProof(
        this.proof,
        this.needAddress
      );
      // let data = await transaction.wait();
      // console.log(data);
      console.log(transaction);
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
.MerkleTreeUs {
  width: 100%;
  height: 100%;
}
.MerkleTreeUs-Btn {
  margin-top: 2rem;
  .MerkleTreeUs-Btn-proof {
    display: flex;
    align-items: center;
    .el-input {
      width: 22rem;
      margin: 0 1rem;
    }
  }
}
</style>
