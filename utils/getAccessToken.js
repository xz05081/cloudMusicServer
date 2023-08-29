/**
 * 获取微信小程序的accessToken
 */
const axios = require("axios");
const fs = require("fs");
const path = require("path");
// 写入的文件地址
const fileName = path.resolve(__dirname, "./access_token");
// 小程序ID
const AppId = "wxe4044d00f0ba51f3";
// 小程序密钥
const AppSecret = "2e7ebd4ab01c5736e495de8f44349d75";

// 定义一个获取微信小程序的access_token的方法
const updateAccessToken = async () => {
  let res = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppId}&secret=${AppSecret}`
  );
  // 判断有无数据,有则写入文件，没有则重新获取
  if (res.data.access_token) {
    // 写入文件中保存
    fs.writeFileSync(
      fileName,
      JSON.stringify({
        access_token: res.data.access_token,
        createTime: new Date(),
      })
    );
  } else {
    // 没有获取到数据的时候，再次获取
    await updateAccessToken();
  }
};

// 从写入的文件中获取access_token
const getAccessToken = async () => {
  try {
    // 读取数据
    let readRes = fs.readFileSync(fileName, "utf8");
    // 将字符串形式转换为对象形式
    let readObj = JSON.parse(readRes);
    // 获取当前文件的最新access_token的创建时间的时间戳
    let createTime = new Date(readObj.createTime).getTime();
    // 获取当前时间的时间戳
    let nowTime = new Date().getTime();
    // 判断当前时间与创建时间是否大于2小时，防止服务器宕机，定时器的时间没有完整使用
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken();
      await getAccessToken();
    }
    return readObj.access_token;
  } catch (error) {
    await updateAccessToken();
    await getAccessToken();
  }
};

// 每两小时更新一下access_token信息
setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000);

// 暴露获取accesstoken的方法
module.exports = getAccessToken;
