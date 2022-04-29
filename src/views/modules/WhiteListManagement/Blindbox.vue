<template>
  <div id="Blindbox">
    <div class="blind_Box">
      <span> 注意:更换操作只有智能合约拥有者有权限,否则会失败!!!</span>
    </div>
    <!-- 开启盲盒 -->
    <div class="blind_Box blind_Box_span">
      <span>当前盲盒状态:</span>
      <el-input placeholder="" v-model="state" :disabled="true"> </el-input>
      <el-button type="primary" @click="onState">更换状态</el-button>
    </div>
    <!-- 当前盲盒链接 -->
    <div class="blind_Box blind_Box_span">
      <span>当前盲盒链接:</span>
      <el-input
        placeholder=""
        class="blind_Box_input3"
        v-model="nowBindboxUrl"
        :disabled="true"
      >
      </el-input>
    </div>
    <!-- 当前盲盒链接 -->
    <div class="blind_Box blind_Box_span">
      <span>当前开盒链接:</span>
      <el-input
        placeholder=""
        class="blind_Box_input3"
        v-model="nowOpenboxUrl"
        :disabled="true"
      >
      </el-input>
    </div>
    <!-- 设置盲盒链接 -->
    <div class="blind_Box blind_Box_span">
      <span>设置盲盒链接:</span>
      <el-input placeholder="" class="blind_Box_input3" v-model="bindboxUrl">
      </el-input>
      <el-button type="primary" @click="setBlindUri">确定设置</el-button>
    </div>
    <!-- 设置开盒链接 -->
    <div class="blind_Box blind_Box_span">
      <span>设置开盒链接:</span>
      <el-input placeholder="" class="blind_Box_input3" v-model="openboxUrl">
      </el-input>
      <el-button type="primary" @click="setBaseURI">确定设置</el-button>
    </div>
    <!-- 设置价格 -->
    <div class="blind_Box blind_Box_span">
      <div>
        <div class="blind_Box blind_Box_span">
          <span>填写公开发售价格:</span>
          <el-input
            placeholder=""
            v-model="openPrice"
            clearable
            class="blind_Box_input4"
          >
          </el-input>
          <p>当前价格:</p>
          <el-input
            placeholder=""
            v-model="nowOprice"
            disabled
            class="blind_Box_input4"
          >
          </el-input>
        </div>
        <div class="blind_Box blind_Box_span">
          <span>填写白名单价格:</span>
          <el-input
            placeholder=""
            v-model="wtPrice"
            clearable
            class="blind_Box_input4"
          >
          </el-input>
          <p>当前价格:</p>
          <el-input
            placeholder=""
            v-model="nowWtPrice"
            disabled
            class="blind_Box_input4"
          >
          </el-input>
        </div>
        <div class="blind_Box blind_Box_span">
          <span>填写预售付尾款价格:</span>
          <el-input
            placeholder=""
            v-model="preSellPrice"
            clearable
            class="blind_Box_input4"
          >
          </el-input>
          <p>当前价格:</p>
          <el-input
            placeholder=""
            v-model="nowPsPrice"
            class="blind_Box_input4"
            disabled
          >
          </el-input>
        </div>
      </div>
      <div class="blind_Box blind_Box_btn">
        <span type="primary" @click="onchangemoney">更改价格</span>
      </div>
    </div>
    <div class="blind_Box blind_Box_span">
      <div>
        <!-- 激活限定发售 -->
        <div class="blind_Box blind_Box_span">
          <span>限定发售状态:</span>
          <el-input v-model="saleState" :disabled="true"> </el-input>
        </div>
        <!-- 激活公开发售 -->
        <div class="blind_Box blind_Box_span">
          <span>公开发售状态:</span>
          <el-input v-model="remainState" :disabled="true"> </el-input>
        </div>
        <!-- 激活预售付尾款 -->
        <div class="blind_Box blind_Box_span">
          <span>预售付尾款状态:</span>
          <el-input v-model="preSaleState" :disabled="true"> </el-input>
        </div>
      </div>
      <div class="blind_Box blind_Box_btn">
        <span type="primary" @click="active">更换状态</span>
      </div>
    </div>
    <!-- 激活预售付尾款 -->
    <div class="blind_Box blind_Box_span">
      <span>查询购买的NFT数量:</span>
      <el-input
        v-model="address"
        placeholder="请输入需要查询的账号"
        clearable
        class="blind_Box_input"
      ></el-input>
      <el-button type="primary" plain @click="query">查询</el-button>
      <el-input
        v-model="amount"
        :disabled="true"
        placeholder="num"
        class="blind_Box_input2"
      ></el-input>
    </div>
    <!-- 设置账号 -->
    <div class="blind_Box blind_Box_span">
      <span>设置账号:</span>
      <el-input
        v-model="needSetAddress"
        placeholder="请输入需要设置的账号(只有合约发布者可以设置)"
        class="blind_Box_input"
        clearable
      ></el-input>
      <el-button @click="setReceiver" type="primary">设置</el-button>
    </div>
    <!-- MINT -->
    <div class="blind_Box blind_Box_span">
      <span>官方MINT:</span>
      <el-input
        v-model="mintNum"
        placeholder="请输入数量"
        class="blind_Box_input4"
        clearable
      ></el-input>
      <el-input
        v-model="mintPrice"
        placeholder="请设置价格"
        class="blind_Box_input5"
        clearable
      ></el-input>
      <div class="blind_Box_div">ETH</div>
      <el-button @click="mint" type="warning">MINT</el-button>
    </div>
    <!-- 修改合约地址 -->
    <div class="blind_Box blind_Box_span">
      <span>合约地址:</span>
      <el-button @click="openChange" type="info" plain>更换</el-button>
      <el-input
        v-model="contractAddress"
        placeholder="请输入需要更换的合约地址"
        class="blind_Box_input"
        clearable
        :disabled="disabled"
      ></el-input>
      <p>合约ABI:</p>
      <el-button type="primary" plain>
        <input
          class="Upload_box_input"
          ref="file"
          type="file"
          name="file"
          @change.stop="changesData"
        />
        <p>(仅支持json格式上传)</p>
      </el-button>
      <el-button @click="change" type="success" :disabled="isChange"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
// 引入相关文件
import { ethers } from "ethers"; //引入ethers.js
//abi接口封装函数
import abiContract from "../../../utils/abi.js";
export default {
  // inject: ["reload"], //注入App里的reload方法
  name: "Blindbox",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      state: "", //盲盒状态
      nowBindboxUrl: "", // 当前盲盒链接
      nowOpenboxUrl: "", // 当前开盒链接
      bindboxUrl: "", // 盲盒链接
      openboxUrl: "", // 开盒链接
      openPrice: "", // 公开发售价格
      wtPrice: "", // 白名单价格
      preSellPrice: "", // 预售付尾款价格
      nowOprice: "", // 当前公开发售价格
      nowWtPrice: "", // 当前白名单价格
      nowPsPrice: "", // 当前预售付尾款价格
      saleState: "", // 限量发售激活状态
      remainState: "", // 公开发售激活状态
      preSaleState: "", // 预售付尾款状态
      address: "", // 要查询的账号
      amount: "", // 购买的数量
      mintNum: "", // mint数量
      mintPrice: "", // mint价格
      contractAddress: "", // 合约地址
      data: "", // abi文件
      disabled: true, // 合约地址禁用状态
      isChange: true, // 确定更换按钮禁用状态
      needSetAddress: "", // 需要设置的账号
    };
  },
  // 方法
  methods: {
    // 获取盲盒详情
    async blindboxnum() {
      let contract = await new abiContract(this.contractAddress, this.data);
      // 获取当前是否开启盲盒的状态
      await contract.TokenContract._revealed().then((res) => {
        if (res == false) {
          this.state = "未开启";
        } else if (res == true) {
          this.state = "已开启";
        } else {
          this.state = "错误";
        }
      });
      // 获取当前盲盒链接
      await contract.TokenContract.getBlindUri().then((res) => {
        this.nowBindboxUrl = res;
      });
      // 获取当前开盒链接
      await contract.TokenContract.getBaseURI().then((res) => {
        this.nowOpenboxUrl = res;
      });
      // 获取当前价格
      await contract.TokenContract.getMintPrice().then((res) => {
        // 白名单价格
        this.nowWtPrice =
          ethers.utils.formatUnits(res[0].toString(), "ether") + " " + "ETH";
        // 公开价格
        this.nowOprice =
          ethers.utils.formatUnits(res[1].toString(), "ether") + " " + "ETH";
        // 预售尾款价格
        this.nowPsPrice =
          ethers.utils.formatUnits(res[2].toString(), "ether") + " " + "ETH";
      });
    },

    // 改变盲盒状态
    async onState() {
      try {
        let contract = await new abiContract(this.contractAddress, this.data);
        // 改变状态
        let transaction = await contract.TmetoNFTContract.flipReveal();
        await transaction.wait().then((res) => {
          console.log(res);
          this.blindboxnum();
          this.$message("改变盲盒成功");
        });
      } catch (error) {
        // 错误弹窗处理
        let e = JSON.parse(JSON.stringify(error)).error.message.split(":");
        let erro = e[0] + ":" + e[1];
        this.$alert(erro, "提示", {
          confirmButtonText: "确定",
        });
      }
    },

    // 设置盲盒链接
    async setBlindUri() {
      if (this.bindboxUrl != "") {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        let transaction = await contract.TmetoNFTContract.setBlindUri(
          this.bindboxUrl
        );
        await transaction.wait().then((res) => {
          console.log(res);
          this.blindboxnum();
          this.$message("设置盲盒链接成功");
          this.bindboxUrl = ""; // 清空
        });
      } else {
        this.$message("请先设置盲盒链接");
      }
    },
    // 设置开盒链接
    async setBaseURI() {
      if (this.openboxUrl != "") {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        let transaction = await contract.TmetoNFTContract.setBaseURI(
          this.openboxUrl
        );
        await transaction.wait().then((res) => {
          console.log(res);
          this.blindboxnum();
          this.$message("设置开盒链接成功");
          this.openboxUrl = ""; // 清空
        });
      } else {
        this.$message("请先设置开盒链接");
      }
    },

    // 更换价格
    async onchangemoney() {
      if (this.openPrice > 0 && this.wtPrice > 0 && this.preSellPrice > 0) {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        let price1 = ethers.utils.parseUnits(
          this.openPrice.toString(),
          "ether"
        );
        let price2 = ethers.utils.parseUnits(this.wtPrice.toString(), "ether");
        let price3 = ethers.utils.parseUnits(
          this.preSellPrice.toString(),
          "ether"
        );
        let transaction = await contract.TmetoNFTContract.setMintPrice(
          price1,
          price2,
          price3
        );
        await transaction.wait().then((res) => {
          console.log(res);
          // 重绘
          this.blindboxnum();
          this.$message("改变单价成功");
          // 清空
          this.openPrice = "";
          this.wtPrice = "";
          this.preSellPrice = "";
        });
      } else {
        this.$message("请设置正确价格");
      }
    },

    // 激活
    async active() {
      try {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        // 调用智能合约激活盲盒
        let transaction = await contract.TmetoNFTContract.flipSaleActive();
        console.log(transaction);
        let data = await transaction.wait();
        if (data) {
          this.sale(); // 重绘
          this.$message("限定发售激活状态已改变");
        }
        console.log(data);
      } catch (error) {
        // 错误弹窗处理
        let e = JSON.parse(JSON.stringify(error)).error.message.split(":");
        let erro = e[0] + ":" + e[1];

        // 错误弹窗处理
        // let erro = error.data.message.substring(
        //   error.data.message.indexOf(":") + 1
        // );
        this.$alert(erro, "提示", {
          confirmButtonText: "确定",
        });
      }
    },

    // 查询激活状态
    async sale() {
      // 定义封装的abiContract
      let contract = await new abiContract(this.contractAddress, this.data);
      await contract.TokenContract.getSaleActive().then((res) => {
        if (res == true) {
          this.saleState = "已激活";
          this.remainState = "已激活";
          this.preSaleState = "已激活";
        } else if (res == false) {
          this.saleState = "未激活";
          this.remainState = "未激活";
          this.preSaleState = "未激活";
        }
      });
    },

    // 查询购买的NFT数量
    async query() {
      if (this.address != "") {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        await contract.TokenContract.balanceOf(this.address).then((res) => {
          console.log(res);
          this.amount = res.toString() + " " + "个";
        });
      } else {
        this.$message("请先输入正确的账号");
      }
    },

    // 设置账号
    async setReceiver() {
      if (this.needSetAddress != "") {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        await contract.TmetoNFTContract.setReceiver(this.needSetAddress).then(
          (res) => {
            console.log(res);
            this.needSetAddress = ""; // 清空
          }
        );
      } else {
        this.$message("请先输入需要设置的账号");
      }
    },

    // 官方自定义铸造
    async mint() {
      if (this.mintNum > 0) {
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        let price = ethers.utils.parseUnits(this.mintPrice.toString(), "ether");
        console.log(price, price.toString());
        await contract.TmetoNFTContract.mintByOfficial(this.mintNum, {
          value: price,
        }).then((res) => {
          console.log(res);
          this.mintNum = ""; // 清空
          this.mintPrice = ""; // 清空
        });
      } else {
        this.$message("请先输入铸造的数量");
      }
    },

    // 解除禁用
    async openChange() {
      this.disabled = false;
      this.isChange = false;
    },

    // 更换合约地址
    async change() {
      if (this.contractAddress != "" && this.data != "") {
        // 把合约地址存入本地
        localStorage.cAddress = JSON.stringify(this.contractAddress);
        // 把合约abi存入本地
        localStorage.abi = JSON.stringify(this.data);
        this.$message({
          message: "更换成功!!!",
          type: "success",
        });
        setTimeout(() => {
          this.$router.go(0);
        }, 500);
        // this.reload();
        this.disabled = true;
        this.isChange = true;
      } else {
        this.$message("请先输入正确的合约地址和选择正确的ABI文件");
      }
    },

    //上传文件
    changesData(e) {
      this.data = "";
      const fileList = e.target.files[0];
      let reader = new FileReader();
      if (fileList.type == "application/json") {
        // 判断文件格式
        reader.readAsText(fileList);
        reader.onload = (e) => {
          // 获取bytecode
          const { abi } = JSON.parse(e.target.result);
          if (abi) {
            this.data = abi;
          } else {
            this.$message.error("文件上传错误!!!");
          }
        };
      } else {
        this.$message.warning("请上传JSON格式文件!");
      }
    },
  },
  // 创建后
  created() {
    // 读取本地存储的合约地址和abi
    this.contractAddress = JSON.parse(localStorage.cAddress);
    this.data = JSON.parse(localStorage.abi);
    this.blindboxnum();
    this.sale();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#Blindbox {
  .blind_Box {
    display: flex;
    margin-bottom: 2rem;
    .el-input {
      width: 5rem;
      margin-right: 1rem;
    }
  }
  .blind_Box_span {
    display: flex;
    align-items: center;
    span {
      width: 10rem;
    }
    p {
      width: 5rem;
      margin-left: 1rem;
    }
    .blind_Box_input {
      width: 26rem;
    }
    .blind_Box_input2 {
      width: 4rem;
    }
    .blind_Box_input3 {
      width: 40rem;
    }
    .blind_Box_input4 {
      width: 8rem;
    }
    .blind_Box_input5{
      width: 8rem;
      margin-right: 0;
    }
    .blind_Box_div{
      margin:0 1.5rem 0 0.5rem;
    }
    .el-button {
      margin-right: 1rem;
    }
    .Upload_box_input {
      width: 9rem;
      padding-bottom: 0.2rem;
    }
  }
  .blind_Box_btn {
    margin-left: 1.4rem;
    span {
      height: 9.5rem;
      width: 1rem;
      background-color: #ecf5ff;
      color: #40a9ff;
      border: 0.1rem solid #b3d8ff;
      padding: 1rem;
      display: flex;
      align-items: center;
      border-radius: 0.3rem;
    }
    span:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
