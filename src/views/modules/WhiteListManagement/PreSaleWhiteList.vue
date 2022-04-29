<template>
  <div class="RootHash">
    <div>{{ msg }}</div>
    <div class="RootHash-Btn">
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
            <el-table-column prop="preorder" label="preorder">
            </el-table-column>
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
      <div class="RootHash-Btn-rootHash">
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
        <el-button @click="checking">验证证明</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { utils } from "ethers";
//abi接口封装函数
import abiContract from "@/utils/abi.js";
// 引入api接口文件
import { setWhiteList_api } from "@/api/setWhiteList.js";

export default {
  name: "First",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to PreSale WhiteList Page",
      rootHash: "", // 根哈希
      tree: "", // Merkle 树
      setMstatus: true, // 设置根哈希的禁用状态
      addArr: [], // 接收上传的数据
      addName: "导入文件", // Dialog的标题
      dialogVisible: false, // Dialog的状态
      files: "", // 得到的文件
      whitelistAddresses: [], // 存放白名单地址的数组
      loading: false, //loading窗的状态
      leafNodes: [], // 处理后的数组
      proof: [], // 生成的证明
      setArr: [], // 自定义数组
      contractAddress: "", // 合约地址
      data: "", // abi文件
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
        this.whitelistAddresses.push({
          address: v.address,
          preorder: v.preorder,
        });
      });
      // 第一步，生成白名单地址的 Merkle 树
      this.leafNodes = this.whitelistAddresses.map((x) =>
        utils.solidityKeccak256(["address", "uint256"], [x.address, x.preorder])
      );
      this.tree = new MerkleTree(this.leafNodes, keccak256, {
        sort: true,
      });
      const root = this.tree.getHexRoot();
      this.rootHash = root; // 赋值

      // 拼接成规定的数组对象，方便后面对应账号
      this.whitelistAddresses.map((v, i) => {
        this.setArr.push({
          address: this.whitelistAddresses[i].address,
          preorder: this.whitelistAddresses[i].preorder,
          leafNodes: this.leafNodes[i],
        });
      });

      // 存入本地
      // localStorage.diyArr = JSON.stringify(this.setArr);

      // 生成证明
      const leaf = this.leafNodes[0];
      this.proof = this.tree.getHexProof(leaf);
      this.setMstatus = false; // 解除设置根哈希按钮的禁用状态
    },

    // 设置 Merkle 根哈希
    async setMerkle() {
      try {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        // 调用智能合约设置Merkle的根哈希
        let transaction = await contract.TmetoNFTContract.setPreSellMklRoot(
          this.rootHash
        );
        let data = await transaction.wait();
        if (data) {
          // 将数据存入vuex的数据库中
          // this.$store.commit("setLeafNodes", this.leafNodes);
          // this.$store.commit("setAddArr", this.addArr);

          // 将数组转化为字符串
          let uint8 =
            JSON.stringify(this.leafNodes) + "-" + JSON.stringify(this.setArr);
          console.log(typeof uint8);
          // 调用接口存数据
          let res = await setWhiteList_api({
            id: 1,
            uint8,
            hash: this.rootHash,
          });
          if (res.data.code == 200) {
            this.$message("上传数据库成功!!!");
            this.$router.push("/index/Blindbox");
          } else {
            this.$message("上传数据库失败!!!");
          }
        }
      } catch (error) {
        // 错误弹窗处理
        let e = JSON.parse(JSON.stringify(error)).error.message.split(":");
        let erro = e[0] + ":" + e[1];
        this.$alert(erro, "提示", {
          confirmButtonText: "确定",
        });
      }
    },
    // 检验证明
    async checking() {
      try {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        // 调用智能合约设置Merkle的根哈希
        let transaction = await contract.Merkle_PrsContract.checkMerkleProof(
          this.whitelistAddresses[0].address,
          this.whitelistAddresses[0].preorder,
          this.proof
        );
        let data = await transaction.wait();
        console.log(
          data.events[0].args[0],
          data.events[0].args[1].toString(),
          data.events[0].args[2].toString()
        );
      } catch (error) {
        // 错误弹窗处理
        let e = JSON.parse(JSON.stringify(error)).error.message.split(":");
        let erro = e[0] + ":" + e[1];
        this.$alert(erro, "提示", {
          confirmButtonText: "确定",
        });
      }
    },
  },
  // 创建后
  created() {
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
.RootHash {
  width: 100%;
  height: 100%;
  .RootHash-Btn {
    margin-top: 2rem;
    .RootHash-Btn-proof {
      display: flex;
      align-items: center;
      .el-input {
        width: 25rem;
        margin: 0 1rem;
      }
    }
    .RootHash-Btn-rootHash {
      display: flex;
      align-items: center;
      margin-top: 2rem;
      span {
        margin-left: 1rem;
      }
      .el-input {
        width: 36rem;
        margin: 0 1rem;
      }
    }
  }
}
</style>
