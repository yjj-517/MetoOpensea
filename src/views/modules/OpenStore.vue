<template>
  <div id="OpenStore">
    <h1>Welcome To BlindBox</h1>
    <h1>十二生肖盲盒官网 - 公开发售</h1>
    <!-- 图片 -->
    <div class="imgbox">
      <el-image
        v-for="i in 15"
        :key="i"
        :src="imgurl"
        @click="onButton"
        class="imgs"
      ></el-image>
      <!-- 点击弹框 -->
      <el-dialog
        title="购买盲盒"
        :visible.sync="dialogVisible"
        width="500px"
        v-loading="loading"
      >
        <div class="dialog_box">
          <el-image :src="imgurl"></el-image>
          <p>
            单价:&emsp;<span>{{ money2 }}</span
            >&emsp;ETH
          </p>
        </div>
        <div class="dialog_btn">
          <el-input-number
            v-model="num"
            :min="1"
            label="描述文字"
          ></el-input-number>
          <el-button type="primary" plain @click="onMint(1)">Buy Now</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //引入ethers.js
//abi接口封装函数
import abiContract from "../../utils/abi";
export default {
  name: "OpenStore",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      loading: false, //加载
      accountId: "", //账号
      dialogVisible: false, //弹框
      imgurl:
        "https://ipfs.io/ipfs/bafybeifwzs5grbtl2efjzch5moisiztwvdqig3pjobovsdpqk7ffjwv5au/PrBlind.png", //图片地址
      state: "", //盲盒状态
      money1: "", // 白名单盲盒价格
      money2: "", //公开盲盒价格
      erro: "", // 报错信息
      num: "", // 购买的数量
      contractAddress: "", // 合约地址
      data: "", // abi文件
    };
  },
  // 方法
  methods: {
    // connect() {
    //   //判断账号
    //   // 封装了一个获取MetaMask钱包并有一系列操作的函数
    //   //判断用户是否安装MetaMask钱包插件
    //   if (typeof window.ethereum === "undefined") {
    //     //没安装MetaMask钱包进行弹框提示
    //     this.$alert("请安装MetaMask", "提示", {
    //       confirmButtonText: "确定",
    //     });
    //   } else {
    //     //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
    //     window.ethereum
    //       .enable()
    //       .catch(function (reason) {
    //         //如果用户拒绝了登录请求
    //         if (reason === "User rejected provider access") {
    //           // 用户拒绝登录后执行语句；
    //           alert("你拒接了登录!!!");
    //         } else {
    //           // 本不该执行到这里，但是真到这里了，说明发生了意外
    //           alert("There was a problem signing you in");
    //         }
    //       })
    //       .then(async (accounts) => {
    //         // 判断是否连接以太
    //         if (window.ethereum.networkVersion !== "4") {
    //           this.$alert("请先将钱包连接到对应的以太网!", "提示", {
    //             confirmButtonText: "确定",
    //           });
    //         } else {
    //           this.accountId = accounts.join();
    //           console.log(this.accountId);
    //           this.blindboxInfo();
    //         }
    //       });
    //   }
    // },
    // 获取盲盒个数
    async blindboxInfo() {
      let contract = await new abiContract(this.contractAddress, this.data);
      // 获取当前是否开启盲盒的状态
      await contract.TokenContract._revealed().then((res) => {
        this.state = res;
        if (res == true) {
          this.$message("盲盒已开启");
        } else if (res == false) {
          this.$message("盲盒未开启");
        }
      });
      // 盲盒单价
      await contract.TokenContract.getMintPrice().then((res) => {
        // 白名单价格
        this.money1 = ethers.utils.formatUnits(res[0].toString(), "ether");
        // 公开价格
        this.money2 = ethers.utils.formatUnits(res[1].toString(), "ether");
      });
    },
    // // 点击图片
    // async onButton() {
    //   // this.connect();
    //   if (this.accountId) {
    //     this.dialogVisible = true;
    //   } else {
    //     this.$alert("请先登录你的钱包账号或者切换至正确的以太网!", "提示", {
    //       confirmButtonText: "确定",
    //     });
    //   }
    // },

    // 点击图片
    async onButton() {
      this.dialogVisible = true;
      this.blindboxInfo();
    },

    // mint盲盒
    async onMint() {
      try {
        this.loading = true;
        // 定义封装的abiContract
        let contract = await new abiContract(this.contractAddress, this.data);
        let price1 = this.money2 * this.num;
        const price = ethers.utils.parseUnits(price1.toString(), "ether")  ;
        
        // 估计gasLimit
        let gsl = await contract.TmetoNFTContract.estimateGas.mintTokensRemain(
          this.num,
          {
            value: price, //需要就传,不需要就不传
          }
        );
        console.log(gsl.toString());
        //gasLimit需要乘以后台传入的上涨幅度并取整
        gsl = Math.ceil(gsl.toString() * 1.4);
        try {
          var transaction = await contract.TmetoNFTContract.mintTokensRemain(
            this.num,
            {
              gasLimit: gsl.toString(),
              value: price,
            }
          );
        } catch (error) {
          // 错误弹窗处理
          if (error.data) {
            this.erro = error.data.message.substring(
              error.data.message.indexOf(":") + 1
            );
          } else {
            this.erro = error.message.substring(error.message.indexOf(":") + 1);
          }
          this.loading = false;
          this.dialogVisible = false;
          this.$alert(this.erro, "提示", {
            confirmButtonText: "确定",
          });
        }
        console.log(transaction);
        await transaction
          .wait()
          .then((res) => {
            console.log(res);
            this.dialogVisible = false;
            this.$message("mint成功");
            // window.open("https://opensea.io/account", "_blank");
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.$alert("交易失败!", "提示", {
              confirmButtonText: "确定",
            });
          });
      } catch (error) {
        console.log(error);
        if (error) {
          // 错误弹窗处理
          let e = JSON.parse(JSON.stringify(error)).error.message.split(":");
          let erro = e[0] + ":" + e[1];
          this.$message(erro);
          this.loading = false;
          this.dialogVisible = false;
        }
      }
    },
  },
  // 创建后
  created() {
    // this.connect();
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
#OpenStore {
  overflow-y: auto;
  background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
  h1 {
    padding: 4rem 0 0;
    text-align: center;
    color: #fff;
  }
  .imgbox {
    margin: 4rem 16rem 6rem;
    .el-image {
      margin: 1rem;
      width: 10rem;
      height: 10rem;
      border-radius: 10%;
      &:hover {
        transform: scale(1.12);
      }
    }
    .el-dialog {
      .dialog_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-image {
          margin-bottom: 3rem;
        }
        p {
          margin-bottom: 2rem;
          font-size: 18px;
          span {
            color: #9a3acf;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
      .dialog_btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
}
</style>
