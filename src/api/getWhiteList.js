// 获取白名单信息
import request from "@/utils/request.js";

export const getWhiteList_api = (params) =>
  request({
    method: "get",
    url: "api/whiteList/getWhiteList",
    params,
  });
