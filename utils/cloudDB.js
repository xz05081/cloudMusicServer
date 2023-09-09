/**
 * 云数据库的方法
 */
const axios = require("axios");
const utils = require("../utils/utils");
const getAccessToken = require("../utils/getAccessToken");

const cloudDB = {
  // 查询云数据的数据
  selectData: async (query) => {
    // 获取access_token
    const access_token = await getAccessToken();
    // 查询地址
    const url = `https://api.weixin.qq.com/tcb/databasequery?access_token=${access_token}`;
    //   从云数据库中获取
    return await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        query,
      },
    });
  },
  //   插入数据
  databaseAdd: async (query) => {
    // 获取access_token
    const access_token = await getAccessToken();
    // 查询地址
    const url = `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`;
    return await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        query,
      },
    });
  },
  // 删除数据
  databaseDelete: async (query) => {
    // 获取access_token
    const access_token = await getAccessToken();
    // 查询地址
    const url = `https://api.weixin.qq.com/tcb/databasedelete?access_token=${access_token}`;
    return await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        query,
      },
    });
  },
};

module.exports = cloudDB;
