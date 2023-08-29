const router = require("koa-router")();
const utils = require("../utils/utils");

router.prefix("/carousel");
router.get("/string", async (ctx) => {
  ctx.body = utils.success("hello carousel");
});

module.exports = router;
