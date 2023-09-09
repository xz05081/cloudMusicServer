const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const router = require("koa-router")();
const json = require("koa-json");
const onerror = require("koa-onerror");
// const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const { koaBody } = require("koa-body");
const path = require("path");

// 引入router实例
const carousel = require("./routes/carousel");
const login = require("./routes/login");
const playlist = require("./routes/playlist");
const blog = require("./routes/blog");

// error handler
onerror(app);

// middlewares
// app.use(
//   bodyparser({
//     enableTypes: ["json", "form", "text"],
//   })
// );
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "uploads"), // Directory to store uploaded files
      keepExtensions: true, // Keep the original file extensions
    },
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 路由
router.prefix("/api");
router.use(carousel.routes(), carousel.allowedMethods());
router.use(login.routes(), login.allowedMethods());
router.use(playlist.routes(), playlist.allowedMethods());
router.use(blog.routes(), blog.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
