const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const sync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const webp = require("gulp-webp");
const babel = require("gulp-babel");
const ttf2woff2 = require("gulp-ttf2woff2");

function indexHtml() {
  return src("src/index.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("build/"));
}

function html() {
  return src("src/pages/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("build/pages/"));
}

function scss() {
  return src("src/style/**.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("build/style/"));
}

function image() {
  return src("src/images/*.{png,jpg,svg,jpeg,jfif,gif,webp}")
    .pipe(webp())
    .pipe(dest("build/images/"));
}

function js() {
  return src("src/js/**.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest("build/js/"));
}

function fonts() {
  return src("src/fonts/**.{ttf,ttf2}")
    .pipe(ttf2woff2())
    .pipe(dest("build/fonts/"));
}

function clear() {
  return src("build").pipe(clean({ force: true }));
}

function serve() {
  sync.init({
    server: "./build",
  });
  watch("./src/pages/**.html", series(indexHtml)).on("change", sync.reload);
  watch("./src/style/**.scss", series(scss)).on("change", sync.reload);
  watch("./src/pages/**.html", series(html)).on("change", sync.reload);
  watch("./src/js/**.js", series(js)).on("change", sync.reload);
  watch("./src/fonts/**.{ttf,ttf2}", series(fonts)).on("change", sync.reload);
}

exports.del = clear;
exports.default = series(scss, indexHtml, image, html, js, fonts, serve);
