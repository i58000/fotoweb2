// const config = require("../../frontend/src/config");

const express = require("express");
const router = express.Router();
var path = require("path");
var fs = require("fs");

var bodyparser = require("body-parser");
router.use(bodyparser.json()); // 使用bodyparder中间件，
router.use(bodyparser.urlencoded({ extended: true }));

const TEMP_DIR = "fotos-temp/";
const FOTO_DIR = "fotos/";
var multer = require("multer");
var upload = multer({ dest: TEMP_DIR });

var session = require("express-session");
router.use(
    session({
        name: "foto-session-name",
        secret: "secret", // 对session id 相关的cookie 进行签名
        resave: true,
        saveUninitialized: false, // 是否保存未初始化的会话
        cookie: {
            maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
            secure: false
        }
    })
);

router.all("*", function (req, res, next) {
    let port = process.env.NODE_ENV == "prod" ? "80" : "8080";
    let frontHost = "http://" + global.config.host + ":" + port;
    console.log(frontHost);
    res.header("Access-Control-Allow-Origin", frontHost);
    res.header("Access-Control-Allow-Credentials", "true"); //划重点
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
    );
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
    // if (req.method == "OPTIONS") {
    //     res.send(200); /*让options请求快速返回*/
    // } else {
    //     next();
    // }
});

// 用户登录
router.post("/login", function (req, res) {
    // console.log(req.body);
    // auto login
    if (req.body.password == null) {
        // console.log("++++++++", req.session.username);
        res.send(req.session.username);
    }
    // login
    else {
        if (req.body.username == "admin" && req.body.password == "admin") {
            req.session.username = req.body.username; // 登录成功，设置 session
            res.send("success");
            // console.log(req.session);
        } else {
            res.send("fail");
        }
    }
});
router.get("/logout", function (req, res) {
    delete req.session.username;
    res.send("success");
});

router.get("/hi", function (req, res, next) {
    res.send("hello from fotos");
    console.log(req.session);
    next();
});
router.get("/cates", function (req, res, next) {
    let backend = path.resolve(__dirname, "../../");
    let dir = backend + "/fotos";
    let result = [];
    function find(p, json, catename) {
        let files = fs.readdirSync(p);
        files.forEach(function (item, index) {
            let fPath = path.join(p, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                let cate = {
                    name: item,
                    imgs: []
                };
                json.push(cate);
                find(fPath, cate.imgs, cate.name);
            }
            if (stat.isFile() === true) {
                let imgPath =
                    "http://" +
                    global.config.host +
                    ":" +
                    global.config.port +
                    "/fotos/fotos/" +
                    catename +
                    "/" +
                    item;
                json.push(imgPath);
            }
        });
    }
    find(dir, result);
    res.send(result);
    next();
});

router.get("/fotos/*", function (req, res) {
    let backend = path.resolve(__dirname, "../../");
    let urlDecoded = decodeURI(req.url)
    res.header("Content-Type", "image/png");
    res.sendFile(backend + "/" + urlDecoded);
    // console.log("Request url:" + req.url + " --" + urlDecoded);
});

router.post("/admin/*", function (req, res, next) {
    console.log("in admin");
    if (req.session.username == "admin") {
        next();
    } else {
        res.send("auth");
    }
});
router.post("/admin/newCate", function (req, res, next) {
    console.log(req.body);
    var newDir = FOTO_DIR + req.body.name;
    fs.mkdir(newDir, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("目录创建成功。");
            res.send("success");
        }
    });
});
router.post("/admin/deleteCate", function (req, res, next) {
    console.log(req.body);
    var name = FOTO_DIR + req.body.cate;
    console.log(name);
    function deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
    deleteFolderRecursive(name);
    res.send("success");
});
router.post("/admin/editCate", function (req, res, next) {
    var oldname = FOTO_DIR + req.body.cate;
    let newname = FOTO_DIR + req.body.newname;
    fs.rename(oldname, newname, function (err) {
        if (err) {
            console.log("rename failure.");
        } else {
            res.send("success");
        }
    });
});
router.post("/admin/editFoto", function (req, res, next) {
    // console.log(req.body);
    let cateDir = req.body.cate + "/";
    var oldname = FOTO_DIR + cateDir + req.body.oldname;
    let newname =
        FOTO_DIR +
        cateDir +
        req.body.newname +
        path.parse(req.body.oldname).ext;
    // console.log(oldname, newname);
    fs.rename(oldname, newname, function (err) {
        if (err) {
            console.log("rename failure.");
        } else {
            res.send("success");
        }
    });
});
router.post("/admin/deleteFoto", function (req, res, next) {
    // console.log(req.body);
    let cateDir = req.body.cate + "/";
    var name = FOTO_DIR + cateDir + req.body.name;
    // console.log(name);
    fs.unlink(name, function (err) {
        if (err) {
            console.log("delete failure");
        } else {
            // console.log("文件删除成功");
            res.send("success");
        }
    });
});
router.post("/admin/upload", upload.array("foto"), function (req, res, next) {
    // console.log(req.files);
    // console.log(req.body);
    // console.log(req.session);
    // console.log("-----", req.session.username);
    let cateDir = req.body.cate + "/";
    for (var i = 0; i < req.files.length; i++) {
        var newName = FOTO_DIR + cateDir + req.files[i].originalname;
        // req.files[i].path + path.parse(req.files[i].originalname).ext;
        fs.rename(req.files[i].path, newName, function (err) {
            if (err) {
                console.log("rename failure.");
            } else {
                console.log("rename success.");
            }
        });
    }
    res.send("success");
});

module.exports = router;
