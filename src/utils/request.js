// 用来封装axios的工具js文件
import axios from "axios"; //引入axios

// 1.设置默认地址
axios.defaults.baseURL = 'http://192.168.11.60:8888';
// axios.defaults.baseURL = 'http://192.168.11.60:8888/v2/api-docs';
export default axios