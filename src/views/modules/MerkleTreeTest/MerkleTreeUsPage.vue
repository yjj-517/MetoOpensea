<template>
  <div class="MerkleTreeUsPage">
    <div>{{ msg }}</div>
    <div class="MerkleTreeUsPage-Btn">
      <div>
        <el-button
          @click="importFile"
          type="info"
          round
          style="margin-bottom: 2rem"
          plain
          >导入白名单账户</el-button
        >
        <div class="tablearr" v-loading="loading">
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
            <el-table-column prop="address" label="address"> </el-table-column>
          </el-table>
        </div>
        <el-dialog :title="addName" :visible.sync="dialogVisible" width="500px">
          <div
            class="add-file-right"
            style="display: flex; flex-direction: column; height: 8rem"
          >
            <div
              class="add-file-right-img"
              style="margin-left: 6rem; text-align: center"
            >
              <span>上传文件:</span>
              <input
                type="file"
                ref="clearFile"
                @change="getFile($event)"
                multiple="multiplt"
                class="add-file-right-input"
                style="margin-left: 0.5rem"
                accept=".docx,.doc,.pdf,.xlsx"
              />
            </div>
            <span
              class="add-file-right-more"
              style="margin: 2rem; text-align: center"
              >支持扩展名:.doc .docx .pdf .xlsx
            </span>
            <div slot="footer" class="dialog-footer" style="text-align: right">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
              >
            </div>
          </div>
        </el-dialog>
      </div>
      <el-divider></el-divider>
      <div class="MerkleTreeUsPage-Btn-rootHash">
        <el-button type="primary" plain @click="createRootHash"
          >生成根哈希</el-button
        >
        <span>Root hash is :</span>
        <el-input disabled v-model="rootHash"></el-input>
        <el-button
          @click="setMerkle"
          :disabled="setMstatus"
          type="success"
          plain
          >设置根哈希</el-button
        >
      </div>
      <el-divider></el-divider>
      <div class="MerkleTreeUsPage-Btn-proof">
        <span>需要证明的地址 :</span>
        <el-input v-model="needAddress" clearable></el-input>
        <el-button
          type="primary"
          plain
          @click="createCorrectMerkle"
          :disabled="setProofStatus"
          >生成证明</el-button
        >
      </div>
      <el-divider></el-divider>
      <div class="MerkleTreeUsPage-Btn-table">
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
      <div class="MerkleTreeUsPage-Btn-result">
        <el-button
          @click="verifyMerkleProof"
          :disabled="verifystatus"
          type="warning"
          plain
          >验证Merkle证明</el-button
        >
        <span>验证结果 :</span>
        <el-button
          class="MerkleTreeUsPage-Btn-result-btn"
          :style="{ color: colorMy, backgroundColor: bgColorMy }"
          disabled
          >{{ resultMy }}</el-button
        >
      </div>
      <el-divider></el-divider>
      <div class="MerkleTreeUsPage-Btn-result">
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
  name: "MerkleTreeUsPage",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to Merkle Tree Us Page",
      rootHash: "", // 根哈希
      proof: [], // 合法的证据
      setMstatus: true, // 设置根哈希的禁用状态
      setProofStatus: true, // 设置生成证据的禁用状态
      verifystatus: true, // 验证Merkle证据的禁用状态
      verifyOtherStatus: true, // 验证别人的地址证据的禁用状态
      needAddress: "", // 需要证明的账户地址
      addArr: [], // 接收上传的数据
      addName: "导入文件", // Dialog的标题
      dialogVisible: false, // Dialog的状态
      files: "", // 得到的文件
      whitelistAddresses: [], // 存放白名单地址的数组
      loading: false, //loading窗的状态
      resultMy: "暂未验证", // 验证自己账户的结果
      resultOther: "暂未验证", // 验证别人账户的结果
      colorMy: "#aaa", // 验证自己账户结果的默认字体颜色
      colorOther: "#aaa", // 验证别人账户结果的默认字体颜色
      bgColorMy: "#fff", // 验证自己账户结果后的背景颜色
      bgColorOther: "#fff", // 验证别人账户结果后的背景颜色
      tree: "", // Merkle 树
    };
  },
  // 方法
  methods: {
    // 导入按钮
    importFile() {
      // 打开Dialog
      this.dialogVisible = true;
    },

    // 文件上传
    getFile(event) {
      var file = event.target.files;
      console.log(file);
      for (var i = 0; i < file.length; i++) {
        // 上传类型判断
        var imgName = file[i].name;
        var idx = imgName.lastIndexOf(".");
        if (idx != -1) {
          var ext = imgName.substr(idx + 1).toUpperCase();
          ext = ext.toLowerCase();
          if (ext != "pdf" && ext != "doc" && ext != "docx" && ext != "xlsx") {
            this.$message({
              showClose: true,
              message: "文件格式不符合",
              type: "warning",
            });
          } else {
            // 调用函数处理xlsx文件的数据
            this.handle(file[i]);
            this.dialogVisible = false; // 关闭Dialog窗
          }
        } else {
          this.$message({
            showClose: true,
            message: "文件后缀不符合",
            type: "warning",
          });
        }
      }
    },

    // 传入文件数据处理
    handle(fileTemp) {
      console.log(fileTemp);
      let _this = this;
      // 通过DOM取文件数据
      var file = fileTemp;
      var rABS = false; //是否将文件读取为二进制字符串
      var f = file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        // var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function () {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            // wb = XLSX.read(btoa(fixdata(binary)), {
            //   //手动转化
            //   type: "base64",
            // });
            console.log("需要手动转化base64");
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          _this.addArr = outdata;
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    // 点击生成根哈希
    async createRootHash() {
      // 循环将addArr数组中的数据push进whitelistAddresses数组中
      this.addArr.map((v) => {
        this.whitelistAddresses.push(v.address);
      });
      console.log(this.whitelistAddresses);
      // 第一步，生成白名单地址的 Merkle 树
      let leafNodes = this.whitelistAddresses.map((address) =>
        keccak256(address)
      );
      this.tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

      console.log("Tree: ", this.tree.toString());
      const root = this.tree.getRoot();
      console.log("Root hash is: ", root.toString("hex")); // 得到根哈希
      // 赋值
      this.rootHash = "0x" + root.toString("hex"); // 手动添加"0x"
      console.log(this.rootHash);
      this.setMstatus = false; // 解除设置根哈希按钮的禁用状态
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
      this.setProofStatus = false; // 解除生成证明的禁用状态
    },

    // 点击生成证明
    async createCorrectMerkle() {
      if (this.needAddress) {
        // 生成参与 verifyMerkleProof 地址的 Merkle 证明
        let leaf = keccak256(this.needAddress);
        console.log(this.tree);
        let proof = this.tree.getHexProof(leaf);
        this.proof = proof;
        this.$set(this, "proof", proof);
        console.log(`Proof of ${this.needAddress}: `, this.proof);
        this.verifystatus = false; // 解除验证Merkle证据的禁用状态
        this.verifyOtherStatus = false; // 解除验证别人的地址证据的禁用状态
      } else {
        this.$message({
          showClose: true,
          message: "请先输入需要验证的账户地址哦~",
          type: "warning",
        });
      }
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
      console.log(transaction);
      if (transaction == true) {
        this.resultMy = "正确";
        this.colorMy = "#fff";
        this.bgColorMy = "#67c23a";
      } else if (transaction == false) {
        this.resultMy = "错误";
        this.colorMy = "#fff";
        this.bgColorMy = "#f00";
      }
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
.MerkleTreeUsPage {
  width: 100%;
  height: 100%;
}
.MerkleTreeUsPage-Btn {
  margin-top: 2rem;
  .MerkleTreeUsPage-Btn-proof {
    display: flex;
    align-items: center;
    .el-input {
      width: 25rem;
      margin: 0 1rem;
    }
  }
  .MerkleTreeUsPage-Btn-rootHash {
    display: flex;
    align-items: center;
    span {
      margin-left: 1rem;
    }
    .el-input {
      width: 36rem;
      margin: 0 1rem;
    }
  }
  .MerkleTreeUsPage-Btn-table {
    display: flex;
    flex-direction: column;
    p {
      padding-bottom: 1rem;
      span {
        color: chocolate;
      }
    }
  }
  .MerkleTreeUsPage-Btn-result {
    display: flex;
    align-items: center;
    span {
      margin: 0 1rem;
    }
  }
}
</style>
