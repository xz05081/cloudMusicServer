const router = require("koa-router")();
const utils = require("../utils/utils");
const cloudStorage = require("../utils/cloudStorage");
const cloudDB = require("../utils/cloudDB");

// 下载云存储的有效时长
const MAX_AGE = 7200;

router.prefix("/carousel");

// 获取轮播图的数据列表
router.get("/list", async (ctx) => {
  // 查询条件
  const query = `db.collection("carousel").get()`;
  let res = await cloudDB.selectData(query);
  // 将数据的json格式转化为正常的对象模式---并且整理数据为下载云存储文件的数据
  let file_list = res.data.data.map((item) => {
    return {
      fileid: JSON.parse(item).fileId,
      max_age: MAX_AGE,
    };
  });
  //   获取下载的数据
  let filelistRes = await cloudStorage.download(file_list);
  //   整理数据返回给前端
  let data = filelistRes.data.file_list.map((item) => {
    return {
      fileId: item.fileid,
      download_url: item.download_url,
    };
  });
  ctx.body = utils.success(data);
});

// 增加轮播图的数据
router.post("/add", async (ctx) => {
  let file_id = await cloudStorage.upload(ctx);
  const query = `db.collection("carousel").add({
    data: {
      fileId: "${file_id}"
    }
  })`;
  await cloudDB.databaseAdd(query);
  ctx.body = utils.success("", "添加成功");
});

// 轮播图的删除功能
router.post("/delete", async (ctx) => {
  // 获取参数
  const { fileid } = ctx.request.body;
  // 云数据库的删除语句
  const query = `db.collection("carousel").where({fileId: "${fileid}"}).remove()`;
  // 执行云数据库删除的方法
  await cloudDB.databaseDelete(query);
  // 整理云存储的参数
  const fileid_list = [fileid];
  await cloudStorage.batchDeleteFile(fileid_list);
  ctx.body = utils.success("");
});

module.exports = router;
