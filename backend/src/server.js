const config = require("../../frontend/src/config");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const history = require("connect-history-api-fallback");

const fotos = require("./routes/fotos");
app.use("/fotos", fotos);

app.get("/hi", function (req, res, next) {
    res.send("hello");
    next();
});

app.use(history());
app.use(express.static("../frontend/dist"));

// app.listen(80);
// server.listen(global.config.port, function listening() {
server.listen("80", function listening() {
    console.log(
        // '服务器启动成功：' + global.config.host + ':' + global.config.port
        "服务器启动成功：" + "localhost" + ":" // + global.config.port
    );
});
