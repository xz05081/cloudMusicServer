const router = require("koa-router")();
const utils = require("../utils/utils");
const cloudDB = require("../utils/cloudDB");

router.prefix("/blog");

// 获取博客的评论列表
router.get("/list", async (ctx) => {
  // 查询全部数据的数量的语句
  const query2 = `db.collection("blog-comment").count()`;
  //   获取数据的总量
  let totalRes = await cloudDB.databaseCount(query2);
  //   查询的次数
  let selectNum = Math.ceil(totalRes.data.count / 10);
  //   全部数据
  let blogCommentList = [];
  //   分次查询获取数据
  for (let i = 0; i < selectNum; i++) {
    // 查询数据的语句
    let query = `db.collection("blog-comment")
    .skip(${i * 10}).limit(10).orderBy("createTime", "desc").get()`;
    //   查询的结果
    let res = await cloudDB.selectData(query);
    // 将数据整理到一起
    blogCommentList = [...blogCommentList, ...res.data.data];
  }
  //   将获取到的数据的json格式转化为对象形式
  let newBlogCommentList = blogCommentList.map((item) => {
    return JSON.parse(item);
  });
  ctx.body = utils.success(newBlogCommentList);
});

// 删除博客的评论列表
router.post("/delete", async (ctx) => {
  // 获取参数
  const { _id } = ctx.request.body;
  //   删除的语句
  const query = `db.collection("blog-comment").doc("${_id}").remove()`;
  //   删除的实现
  await cloudDB.databaseDelete(query);
  ctx.body = utils.success("");
});

module.exports = router;
