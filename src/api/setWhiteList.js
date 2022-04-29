// 录入白名单信息
import request from "@/utils/request.js";

// 引入Qs
import Qs from "qs";

// function setWhiteList_api(data){
//   request({
//     method: "post",
//     url: "/whiteList/setWhiteList",
//     data: Qs.stringify(data),
//   })
// }
// export default setWhiteList_api

export const setWhiteList_api = (data) =>
  request({
    method: "post",
    url: "api/whiteList/setWhiteList",
    data: Qs.stringify(data),
  });
