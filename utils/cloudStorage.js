/**
 * 云存储的方法
 */
const axios = require("axios");
const utils = require("../utils/utils");
const getAccessToken = require("../utils/getAccessToken");
const fs = require("fs");
const FormData = require("form-data");

const cloudStorage = {
  // 上传的功能
  upload: async (ctx) => {
    // 获取access_token
    const access_token = await getAccessToken();
    const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`;
    // 获取文件的信息
    const file = ctx.request.files.file;
    // 上传的路径
    const path = `carousel/${Date.now}-${Math.random()}-${file.newFilename}`;
    // 发请求
    let res = await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        path,
      },
    });

    // 上传的formData参数
    const form = new FormData();
    form.append("key", path);
    form.append("Signature", res.data.authorization);
    form.append("x-cos-security-token", res.data.token);
    form.append("x-cos-meta-fileid", res.data.cos_file_id);
    form.append("file", fs.createReadStream(file.filepath));

    // 上传图片的路径
    const uri = res.data.url;
    // 上传图片的请求头
    const headers = form.getHeaders();
    form.getLength(async (err, length) => {
      if (err) {
        return;
      }
      //设置content-length属性
      headers["content-length"] = length;
      await axios.post(uri, form, { headers });
    });
    // 返回file_id
    return res.data.file_id;
  },
  // 下载的功能
  download: async (file_list) => {
    // 获取access_token
    const access_token = await getAccessToken();
    //   下载云存储的图片文件
    const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`;
    //   获取下载的数据---发请求
    return await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        file_list,
      },
    });
  },
  // 删除的功能
  batchDeleteFile: async (fileid_list) => {
    // 获取access_token
    const access_token = await getAccessToken();
    //   下载云存储的图片文件
    const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`;
    return await axios({
      method: "post",
      url,
      data: {
        env: utils.ENV,
        fileid_list,
      },
    });
  },
};

module.exports = cloudStorage;
