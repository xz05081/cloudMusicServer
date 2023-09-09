const router = require("koa-router")();
const getAccessToken = require("../utils/getAccessToken.js");
const utils = require("../utils/utils.js");
const axios = require("axios");
// 云开发的环境id
const ENV = "music-2g3d1quo10152d9a";
router.prefix("/playlist");

// 获取歌单列表
router.get("/list", async (ctx) => {
  // 获取access_token
  const access_token = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`;
  // 获取歌单列表的数据条数---方便全部获取数据
  let resCount = await axios({
    method: "post",
    url,
    data: {
      $url: "total",
    },
  });
  let count = JSON.parse(resCount.data.resp_data);
  // 获取歌单列表的数据
  let res = await axios({
    method: "post",
    url,
    data: {
      $url: "palylist",
      start: 0,
      count: count.total,
    },
  });
  //   将获取的数据进行处理
  let newRes = JSON.parse(res.data.resp_data);
  //   返回数据
  ctx.body = utils.success(newRes.data);
});

// 数据处理操作
router.post("/process", async (ctx) => {
  const { _id, name, action } = ctx.request.body;
  // 获取access_token
  const access_token = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`;
  try {
    // 用于存储返回的信息
    let info = "";
    // 编辑的实现
    if (action == "edit") {
      await axios({
        method: "post",
        url,
        data: {
          $url: "processEdit",
          _id,
          name,
        },
      });
      info = "编辑成功";
    } else {
      console.log("_id====>>>", _id);
      // 删除的实现
      let res = await axios({
        method: "post",
        url,
        data: {
          $url: "processDelete",
          _id,
        },
      });
      info = "删除成功";
    }
    // 返回数据
    ctx.body = utils.success("", info);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
