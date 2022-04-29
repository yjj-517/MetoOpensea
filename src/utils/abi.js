// 相关文件
// import { ethers } from "ethers"; //引入ethers.js
// import Web3Modal from "web3modal"; //引入web3modal
// // NFT合约
// import TmetoNFT from "../contracts/TmetoNFT10_ABI.json"; // 引入abi
// // import TmetoNFT from "../contracts/Tmeto10_Rmx_ABI.json"; // 引入abi
// // const tmetoNFTaddress = "0x98962045875Af5Feba47a840e44F2eaF6b8B59CF"; // 私链
// // const tmetoNFTaddress = "0x8C2De33C1d7d3f7FdBb301d2A0dC7A231Ae0862D"; // Rinkeby 测试网
// const tmetoNFTaddress = "0x2f459eab0d6a07282e6C3DF4b4a9615Cff579458"; // Rinkeby 测试网
// async function abiContract() {
//   //连接钱包，获取签名
//   const web3Modal = new Web3Modal({
//     network: "mainnet",
//     cacheProvider: true,
//   });
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();
//   return {
//     //连接合约与对应的abi接口，使其可以调用abi接口
//     //nft
//     TmetoNFTContract: new ethers.Contract(tmetoNFTaddress, TmetoNFT.abi, signer),
//     TokenContract: new ethers.Contract(tmetoNFTaddress, TmetoNFT.abi, provider),
//     tmetoNFTaddress: "0x2f459eab0d6a07282e6C3DF4b4a9615Cff579458",
//   }
// }
// export default abiContract;


//调用智能合约abi接口
import { ethers } from "ethers"; //引入ethers.js
import Web3Modal from "web3modal"; //引入web3modal
async function abiContract(nftaddress, NFT) {
  //连接钱包，获取签名
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const providers = new ethers.providers.Web3Provider(connection);
  const signers = providers.getSigner();
  if (nftaddress && NFT) {
    var nftContracts = new ethers.Contract(nftaddress, NFT, signers);
    var tokenContracts = new ethers.Contract(nftaddress, NFT, providers);}
  // } else {
  //   var nftContracts = null;
  //   var tokenContracts = null;
  // }
  return {
    provider: providers,
    signer: signers,
    //连接合约与对应的abi接口，使其可以调用abi接口
    TmetoNFTContract: nftContracts,
    TokenContract: tokenContracts,
  }
}
export default abiContract;