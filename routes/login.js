// 登录接口的处理方法
const router = require("koa-router")();

router.post("/login", async (ctx) => {
  // 获取参数
  const { userName, userPwd } = ctx.request.body;
});

module.exports = router;
