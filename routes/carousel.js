const router = require("koa-router")();

router.prefix("/playlist");
router.get("/string", async (ctx) => {
  ctx.body = "hello carousel";
});

module.exports = router;
