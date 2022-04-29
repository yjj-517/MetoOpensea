<template>
  <div id="CastWhiteList">
    <h1>Welcome To BlindBox</h1>
    <h1>十二生肖盲盒官网 - 预售付尾款</h1>
    <!-- 图片 -->
    <div class="imgbox">
      <el-image
        v-for="i in 15"
        :key="i"
        :src="imgurl"
        @click="dialogVisible = true"
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
            单价:&emsp;<span>{{ money3 }}</span
            >&emsp;ETH
          </p>
        </div>
        <div class="dialog_btn">
          <el-button type="primary" plain @click="onMint()">BUY</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
// 引入api接口文件
import { getWhiteList_api } from "@/api/getWhiteList.js";

//abi接口封装函数
import abiContract from "../../utils/abi";
export default {
  name: "CastWhiteList",
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
      proof: [], // 白名单证明
      money1: "", // 白名单价格
      money2: "", // 公开发售价格
      money3: "", // 预售尾款价格
      account: "", // 当前选中账号
      leafNodes: [], // 证明需用数组
      verification: [], // 验证账号是否对应的数组
      verificationAddress: "", // 验证数组的账号
      // show: false, // 判断展示消息提示
      // shows: false, // 判断展示消息提示
      amount: "", // 购买数量
      contractAddress: "", // 合约地址
      data: "", // abi文件
    };
  },
  // 方法
  methods: {
    // 获取盲盒信息
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
      await contract.TokenContract.getMintPrice().then((res) => {
        // 白名单价格
        this.money1 = ethers.utils.formatUnits(res[0].toString(), "ether");
        // 公开价格
        this.money2 = ethers.utils.formatUnits(res[1].toString(), "ether");
        // 预售尾款价格
        this.money3 = ethers.utils.formatUnits(res[2].toString(), "ether");
      });
    },

    // 铸造(限定)
    async onMint() {
      try {
        this.loading = true;
        // 获取当前用户选中的账号
        this.account = window.ethereum.selectedAddress;
        // 从后台获取数据
        let res = await getWhiteList_api({ id: 1 });
        if (res.data.code === 200) {
          // 数据处理
          let datas = res.data.datas.uint8.split("-");
          this.leafNodes = JSON.parse(datas[0]);
          // 生成参与 verifyMerkleProof 地址的 Merkle 证明
          this.verification = JSON.parse(datas[1]);
          await this.verification.map(async (v) => {
            // 判断钱包的账号地址与对应验证数组里的地址是否一致
            if (this.account.toLowerCase() == v.address.toLowerCase()) {
              const leaf = v.leafNodes;
              // 生成树
              this.tree = new MerkleTree(this.leafNodes, keccak256, {
                sort: true,
              });
              // 生成证明
              let proof = this.tree.getHexProof(leaf);
              this.proof = proof;
              this.$set(this, "proof", proof);
              // 获取预订数量
              this.amount = v.preorder;
              try {
                // 定义封装的abiContract;
                let contract = await new abiContract(
                  this.contractAddress,
                  this.data
                );
                let price1 = this.money3 * this.amount;
                const price = ethers.utils.parseUnits(
                  price1.toString(),
                  "ether"
                );
                console.log(price1,(price.toString()).length);
                // 估计gasLimit
                let gsl =
                  await contract.TmetoNFTContract.estimateGas.mintPreSellList(
                    this.proof,
                    this.amount,
                    {
                      value: price, //需要就传,不需要就不传
                    }
                  );
                console.log(gsl.toString());
                //gasLimit需要乘以后台传入的上涨幅度并取整
                gsl = Math.ceil(gsl.toString() * 1.4);
                // 调用智能合约验证Merkle证明;
                let transaction =
                  await contract.TmetoNFTContract.mintPreSellList(
                    this.proof,
                    this.amount,
                    { gasLimit: gsl.toString(), value: price }
                  );
                // this.loading = true;
                console.log(transaction);
                let data = await transaction.wait();
                console.log(data);
                if (data) {
                  this.loading = false;
                  this.dialogVisible = false;
                  //   //   // window.open("https://testnets.opensea.io/account", "_blank"); // opensea测试网
                  //   //   // window.open("https://opensea.io/account", "_blank"); // opensea正式网
                }
              } catch (error) {
                let e = JSON.parse(JSON.stringify(error));
                this.$message(e.error.message);
                this.loading = false;
                this.dialogVisible = false;
              }
            } else if (this.account.toLowerCase() != v.address.toLowerCase()) {
              this.$message("此账号不在白名单内");
              this.loading = false; // 关闭loading弹窗
              this.dialogVisible = false; // 关闭dialogVisible弹窗
            }
          });
        }
      } catch (error) {
        console.log(error);
        // 错误弹窗处理
        if (error.data) {
          this.erro = error.data.message.substring(
            error.data.message.indexOf(":") + 1
          );
        } else {
          this.erro = error.message.substring(error.message.indexOf(":") + 1);
        }
        this.loading = false;

        this.$alert(this.erro, "提示", {
          confirmButtonText: "确定",
        });
      }
    },
  },
  // 创建后
  created() {
    // 从vuex的数据库中取出数据
    // this.leafNodes = this.$store.state.leafNodes;
    // console.log(this.leafNodes);
    // 从本地取出做账号验证的数据
    // this.verification = JSON.parse(localStorage.diyArr);
    // console.log(this.verification);
    // 读取本地存储的合约地址和abi
    this.contractAddress = JSON.parse(localStorage.cAddress);
    this.data = JSON.parse(localStorage.abi);
    this.blindboxInfo();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>
<style lang="less" scoped>
#CastWhiteList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
  // background-image: linear-gradient(to right, #85e96c, pink);
  // background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
  background-image: linear-gradient(to right, #ebbba7 0%, #cfc7f8 100%);
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
        justify-content: center;
        .el-button {
          width: 10rem;
        }
      }
    }
  }
}
</style>
