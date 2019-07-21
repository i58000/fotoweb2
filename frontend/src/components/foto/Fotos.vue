<template>
  <div class="fotos">
    <div class="left">
      <div class="left-in">
        <div class="title">JANANA</div>
        <!-- <div class="title" style="font-size: 30px">STUDIUM</div>
        <div class="title" style="font-size: 30px">PUNCTUM</div> -->
        <div class="title-sub" v-for="(item, index) in cates" :key="index">
          <div class="text-prefix" :class="getClass('text-prefix-active', index)"></div>
          <!-- name or edit name -->
          <input
            v-if="whichCateEdit == index"
            type="text"
            class="input-cate"
            :placeholder="item.name"
            v-model="editCateName"
            spellcheck="false"
          />
          <!-- onkeydown="if(event.keyCode==32) return false" -->
          <div
            v-else
            class="text"
            :class="getClass('text-active', index)"
            @click="whichCate = index"
          >{{ getCateDisplayName(item.name) }}</div>
          <!-- edit or ok/cancel -->
          <template v-if="username == 'admin'">
            <div v-if="whichCateEdit == index" class="ok-cancel">
              <div class="text text-edit text-sub" @click="editCateOK(index)">OK</div>
              <div class="text text-edit text-sub" @click="editCateCancel">CANCEL</div>
            </div>
            <div v-else style="display: inline-block">
              <div class="text text-edit text-sub" @click="editCate(index)">EDIT</div>
              <div class="text text-edit text-sub" @click="showDeleteCate(index)">X</div>
              <div class="text text-edit text-sub" @click="showUpload(index)">UPLOAD</div>
            </div>
          </template>
        </div>
        <div class="title-sub" v-if="username == 'admin'">
          <div class="text-prefix-plus text-sub">+</div>
          <template v-if="whichCateEdit == -1">
            <input
              type="text"
              class="input-cate input-cate-new"
              placeholder="NEW"
              v-model="newCateName"
              spellcheck="false"
              onkeydown="if(event.keyCode==32) return false"
            />
            <div class="ok-cancel">
              <div class="text text-edit text-sub" @click="newCateOK">OK</div>
              <div class="text text-edit text-sub" @click="editCateCancel">CANCEL</div>
            </div>
          </template>
          <div v-else class="text-new text text-sub" @click="newCate">NEW</div>
        </div>
        <div class="info">
          <!-- Powered by ANJINSHUO -->
          <br />Contact via
          <span class="wechat">
            WECHAT
            <img class="wechat-qrcode" src="./imgs/qrcode.png" />
          </span>
          <br />
          <span v-if="username" class="admin" @click="logout">Logout</span>
          <span v-else class="admin" @click="showLogin">Login as admin</span>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-in">
        <Waterfall
          ref="waterfall"
          class="waterfall"
          :gap="20"
          :col="5"
          @show="showFoto"
          @showDeleteFoto="showDeleteFoto"
          @editFoto="editFoto"
        />
      </div>
    </div>

    <!-- showfoto -->
    <Showfoto ref="showfoto" @next="showNext" @prev="showPrev"></Showfoto>

    <!-- message -->
    <Message ref="message"></Message>

    <!-- dialog -->
    <Dialog ref="dialogLogin">
      <div class="login">
        <template v-if="username">
          <div class="login-success"></div>
        </template>
        <template v-else>
          <div class="text">LOGIN AS ADMIN</div>
          <input type="password" v-model="password" @keydown.enter="login" />
          <button @click="login">
            <div class="arrow"></div>
          </button>
        </template>
      </div>
    </Dialog>
    <Dialog ref="dialogUpload" @close="uploadCateIndex = null">
      <div class="upload">
        <div
          class="text"
          style="margin:0"
        >Upload to {{cates[uploadCateIndex] ?cates[uploadCateIndex].name:""}}</div>
        <input
          type="file"
          class="input-file"
          id="file"
          ref="file"
          name="file"
          multiple
          accept="image/gif, image/jpeg, image/png, image/jpg"
        />
        <button @click="upload">
          <div class="arrow"></div>
        </button>
      </div>
    </Dialog>
    <Dialog ref="dialogDeleteCate" @close="deleteCateIndex = null">
      <div class="deletecate" v-if="deleteCateIndex!=null">
        <div class="text">Delete {{cates[deleteCateIndex].name}} ?</div>
        <button @click="deleteCate(deleteCateIndex)">
          <div class="ok"></div>
        </button>
      </div>
    </Dialog>
    <Dialog ref="dialogDeleteFoto" @close="deleteFotoIndex = null">
      <div class="deletecate" v-if="deleteFotoIndex!=null">
        <div class="text">Delete {{this.$refs.waterfall.imgList[this.deleteFotoIndex].name}} ?</div>
        <button @click="deleteFoto">
          <div class="ok"></div>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Waterfall from "./Waterfall.vue";
import Showfoto from "./Showfoto.vue";
import Message from "./Message.vue";
import Dialog from "./Dialog.vue";

import axios from "axios";
axios.defaults.withCredentials = true;

const UPLOAD = {
  MAX_HEIGHT: 800,
  MAX_WIDTH: 1200
};

export default {
  components: { Waterfall, Showfoto, Message, Dialog },
  data() {
    return {
      postconfig: {
        headers: {
          "Content-Type": "application/json"
        }
      },
      uploadCateIndex: null,
      deleteFotoIndex: null,
      deleteCateIndex: null,
      newCateName: null,
      editCateName: null,
      whichCateEdit: null,
      url:
        "http://" + global.config.host + ":" + global.config.port + "/fotos/",
      username: null,
      password: null,
      whichFoto: 0,
      whichCate: 0,
      cates: [
        // {
        //   name: "APPLE",
        //   imgs: [
        //     require("./imgs/1.png"),
        //     require("./imgs/2.png"),
        //     require("./imgs/3.png"),
        //     require("./imgs/4.png"),
        //     require("./imgs/5.png"),
        //     require("./imgs/6.png"),
        //     require("./imgs/7.png"),
        //     require("./imgs/8.png"),
        //     require("./imgs/1.png"),
        //     require("./imgs/2.png"),
        //     require("./imgs/3.png"),
        //     require("./imgs/4.png"),
        //     require("./imgs/5.png"),
        //     require("./imgs/6.png"),
        //     require("./imgs/7.png"),
        //     require("./imgs/8.png"),
        //     require("./imgs/1.png"),
        //     require("./imgs/2.png"),
        //     require("./imgs/3.png"),
        //     require("./imgs/4.png"),
        //     require("./imgs/5.png"),
        //     require("./imgs/6.png"),
        //     require("./imgs/7.png"),
        //     require("./imgs/8.png"),
        //     require("./imgs/1.png"),
        //     require("./imgs/2.png"),
        //     require("./imgs/3.png"),
        //     require("./imgs/4.png"),
        //     require("./imgs/5.png"),
        //     require("./imgs/6.png"),
        //     require("./imgs/7.png"),
        //     require("./imgs/8.png")
        //   ]
        // },
        // {
        //   name: "BANANA",
        //   imgs: [
        //     require("./imgs/1.png"),
        //     require("./imgs/2.png"),
        //     require("./imgs/3.png"),
        //     require("./imgs/4.png")
        //   ]
        // },
        // {
        //   name: "WATERFALL",
        //   imgs: []
        // }
      ]
    };
  },
  watch: {
    whichCate() {
      let imgs = this.cates[this.whichCate].imgs;
      if (!imgs || imgs.length == 0) {
        // get cates
        this.reload([]);
      } else {
        this.reload(this.cates[this.whichCate].imgs);
      }
    },
    username() {
      if (this.username == "admin") {
        this.$refs.waterfall.admin = true;
      } else {
        this.$refs.waterfall.admin = false;
      }
    }
  },
  created() {
    this.getCates();
    this.login();
  },
  methods: {
    reload(imgs) {
      this.$refs.waterfall.reload(imgs, this.cates[this.whichCate].name);
    },
    getCates() {
      let url = this.url + "cates";
      axios
        .get(url)
        .then(response => {
          console.log(response);
          this.cates = response.data;
          this.reload(this.cates[this.whichCate].imgs);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCateDisplayName(str) {
      let arr = str.split(global.FOTOS_SEP);
      return arr[arr.length - 1];
    },
    upload() {
      let files = this.$refs.file.files;
      console.log(files);
      let pArr = [];
      for (let i = 0; i < files.length; i++) {
        var p = new Promise(resolve => {
          var filename = files[i].name;
          var reader = new FileReader();
          reader.onloadend = e => {
            let data = e.target.result;
            console.log(files[i]);
            let img = new Image();
            img.src = data;
            img.style.position = "absolute";
            img.style.top = "-9999px";
            img.style.visibility = "hidden";
            document.body.append(img);
            this.$nextTick(() => {
              console.log(img.height);
              console.log(img.width);
              let h1, w1, h2, w2, height, width;
              if (img.height > UPLOAD.MAX_HEIGHT) {
                h1 = UPLOAD.MAX_HEIGHT;
                w1 = (UPLOAD.MAX_HEIGHT / img.height) * img.width;
              }
              if (img.width > UPLOAD.MAX_WIDTH) {
                w2 = UPLOAD.MAX_WIDTH;
                h2 = (UPLOAD.MAX_WIDTH / img.width) * img.height;
              }
              // 长宽均超标
              if (h1 && w2) {
                if (h1 < h2) {
                  height = h1;
                  width = w1;
                } else {
                  height = h2;
                  width = w2;
                }
              }
              // 长宽有一超标或均未超标
              else {
                height = h1 || h2 || img.height;
                width = w1 || w2 || img.width;
              }
              console.log("hw", height, width);
              var canvas = document.createElement("canvas");
              var context = canvas.getContext("2d");
              canvas.width = width;
              canvas.height = height;
              context.drawImage(img, 0, 0, width, height);
              canvas.toBlob(blob => {
                resolve({ blob: blob, filename: filename });
              });
            });
          };
          reader.readAsDataURL(files[i]);
        });
        pArr.push(p);
      }
      Promise.all(pArr).then(result => {
        console.log(result);
        let fd = new FormData(); //创建form对象
        fd.append("cate", this.cates[this.uploadCateIndex].name);
        for (let i = 0; i < result.length; i++) {
          fd.append("foto", result[i].blob, result[i].filename); //通过append向form对象添加数据
        }
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        }; //添加请求头
        let url = this.url + "admin/upload";
        axios
          .post(url, fd, config)
          .then(response => {
            console.log(response.data);
            this.$refs.message.alert("Upload success");
            this.$refs.dialogUpload.close();
            this.getCates();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    editFoto(i, name) {
      let srcArr = this.$refs.waterfall.imgList[i].src.split("/");
      let oldname = srcArr[srcArr.length - 1];
      let url = this.url + "admin/editFoto";
      axios
        .post(
          url,
          {
            cate: this.cates[this.whichCate].name,
            oldname: oldname,
            newname: name
          },
          this.postconfig
        )
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            this.$refs.waterfall.editFotoDone(i, name);
            this.$refs.message.alert("Update success");
            // this.getCates();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showDeleteCate(index) {
      this.deleteCateIndex = index;
      this.$refs.dialogDeleteCate.show();
    },
    showDeleteFoto(index) {
      this.deleteFotoIndex = index;
      this.$refs.dialogDeleteFoto.show();
    },
    deleteFoto() {
      let srcArr = this.$refs.waterfall.imgList[this.deleteFotoIndex].src.split(
        "/"
      );
      let oldname = srcArr[srcArr.length - 1];
      let url = this.url + "admin/deleteFoto";
      axios
        .post(
          url,
          {
            cate: this.cates[this.whichCate].name,
            name: oldname
          },
          this.postconfig
        )
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            this.$refs.waterfall.deleteFoto(this.deleteFotoIndex);
            this.$refs.message.alert("Delete success");
            this.$refs.dialogDeleteFoto.close();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteCate(index) {
      let url = this.url + "admin/deleteCate";
      axios
        .post(
          url,
          {
            cate: this.cates[index].name
          },
          this.postconfig
        )
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            this.cates.splice(index, 1);
            this.editCateCancel();
            this.$refs.message.alert("Delete success");
            this.$refs.dialogDeleteCate.close();
            if (this.whichCate == index) {
              let cate = this.cates[this.whichCate];
              let imgs = cate ? cate.imgs : [];
              this.reload(imgs);
            } else if (this.whichCate > index) {
              this.whichCate--;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    newCateOK() {
      for (let i = 0; i < this.cates.length; i++) {
        if (this.newCateName == this.cates[i].name) {
          this.$refs.message.alert("Already exist");
          return;
        }
      }
      if (this.newCateName) {
        let url = this.url + "admin/newCate";
        axios
          .post(
            url,
            {
              name: this.newCateName
            },
            this.postconfig
          )
          .then(response => {
            console.log(response);
            if (response.data == "success") {
              // this.cates[this.cates.length] = {
              //   name: this.newCateName
              // };
              this.editCateCancel();
              this.$refs.message.alert("Create success");
              this.getCates();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    newCate() {
      this.whichCateEdit = -1;
      // this.newCateName = "NEW";
    },
    showUpload(index) {
      console.log("showUpload", index);
      this.uploadCateIndex = index;
      this.$refs.dialogUpload.show();
    },
    editCateOK(index) {
      if (this.editCateName == this.cates[index].name) {
        this.$refs.message.alert("Nothing changed");
      } else if (this.editCateName) {
        let url = this.url + "admin/editCate";
        axios
          .post(
            url,
            {
              cate: this.cates[index].name,
              newname: this.editCateName
            },
            this.postconfig
          )
          .then(response => {
            console.log(response);
            if (response.data == "success") {
              this.cates[index].name = this.editCateName;
              this.editCateCancel();
              this.$refs.message.alert("Update success");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    editCateCancel() {
      this.whichCateEdit = null;
      this.editCateName = null;
      this.newCateName = null;
    },
    editCate(index) {
      this.whichCateEdit = index;
      this.editCateName = this.cates[index].name;
    },
    logout() {
      let url = this.url + "logout";
      axios
        .get(url)
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            this.username = null;
            this.$refs.message.alert("Logout success");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    login() {
      let url = this.url + "login";
      axios
        .post(
          url,
          { username: "admin", password: this.password },
          this.postconfig
        )
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            this.username = "admin";
            setTimeout(() => {
              this.$refs.dialogLogin.close();
            }, 500);
          } else if (response.data == "fail") {
            this.$refs.message.alert("Wrong");
          } else if (response.data == "") {
            console.log("auto login fail");
          } else {
            this.username = response.data;
            this.$refs.message.alert("Login as:" + this.username);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.password = null;
    },
    showLogin() {
      this.$refs.dialogLogin.show();
    },
    showFoto(i) {
      this.whichFoto = i;
      let src = this.cates[this.whichCate].imgs[i];
      this.$refs.showfoto.show(src);
    },
    showNext() {
      let i = this.whichFoto + 1;
      if (i < this.cates[this.whichCate].imgs.length) {
        this.showFoto(i);
        this.whichFoto = i;
      } else {
        this.$refs.message.alert("This is the last one.");
      }
    },
    showPrev() {
      let i = this.whichFoto - 1;
      if (i >= 0) {
        this.showFoto(i);
        this.whichFoto = i;
      } else {
        this.$refs.message.alert("This is the first one.");
      }
    },
    getClass(classname, index) {
      if (index == this.whichCate) {
        return classname;
      } else {
        return "";
      }
    }
  }
};
</script>

<style scoped>
.fotos {
  height: 100%;
  width: 100%;
  /* background: #111; */
}

.left {
  height: 100%;
  width: 20%;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  /* overflow: hidden; */
}
.left-in {
  left: 20%;
  /* width: 60%; */
  height: 90%;
  position: relative;
}
.right {
  height: 100%;
  width: 80%;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-in {
  width: 80%;
  height: 90%;
}
.waterfall {
  height: 100%;
}
.title {
  letter-spacing: 2px;
  font-size: 50px;
  /* color: #fff; */
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
}
.title-sub {
  letter-spacing: 2px;
  font-size: 16px;
  line-height: 26px;
  /* color: #ddd; */
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
/* .title-sub:hover {
  cursor: pointer;
} */
.title-sub .text:hover {
  text-decoration-line: underline;
  cursor: pointer;
}
.text-prefix {
  border-radius: 5px;
  height: 5px;
  width: 5px;
  margin: 3px;
  position: relative;
  display: inline-block;
}
.text-prefix-active {
  /* background: #fff; */
  background: black;
}
.text {
  display: inline-block;
  height: 20px;
  margin: 0 5px;
}
.text-active {
  /* color: #fff; */
  font-weight: bold;
}
.info {
  letter-spacing: 1px;
  color: #aaa;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  margin-left: 16px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.wechat {
  color: #19a219;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  text-decoration-line: underline;
}
.wechat-qrcode {
  cursor: default;
  transition: all 0.5s;
  /* display: none; */
  visibility: hidden;
  opacity: 0;
  height: 100px;
  width: 100px;
  position: absolute;
  top: -130px;
  left: calc(50% - 60px);
  padding: 10px;
  /* background: #3336; */
  border-radius: 5px;
  box-shadow: 0 0 40px #0003;
}
.wechat:hover .wechat-qrcode {
  /* display: unset; */
  visibility: visible;
  opacity: 1;
}
.admin {
  text-decoration-line: underline;
  cursor: pointer;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 160px;
}
.login input {
  /* background: #fff; */
  position: absolute;
  top: 60px;
  border: 0;
  outline: 0;
  padding: 5px 10px;
  width: 100px;
  border-radius: 50px;
  font-size: 20px;
  height: 20px;
  text-align: center;
}
.login button {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 120px;
  background: #fff;
  border-radius: 50px;
  border: 0;
  outline: 0;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login button .arrow {
}
.login button .arrow::after {
  content: "";
  width: 8px;
  height: 8px;
  border-bottom: 5px solid #000;
  border-left: 5px solid #000;
  position: absolute;
  left: 12px;
  top: 14px;
  transform: rotate(-135deg);
}
.login button:hover {
  background: #19a219;
  transition: background 0.2s;
}
.login .text {
  color: #fff;
  text-decoration-line: none;
  position: absolute;
  top: 10px;
}
.login .login-success {
  height: 80px;
  width: 80px;
  background: #19a219;
  border-radius: 50px;
  position: relative;
}
.login .login-success::before {
  content: "";
  width: 24px;
  /* height: 8px; */
  border-top: 8px solid #000;
  position: absolute;
  left: 18px;
  top: 42px;
  transform: rotate(-135deg);
}
.login .login-success::after {
  content: "";
  width: 40px;
  /* height: 8px; */
  border-top: 8px solid #000;
  position: absolute;
  left: 27px;
  top: 36px;
  transform: rotate(-45deg);
}
.text-prefix-plus {
  display: inline-block;
  width: 10px;
  position: relative;
}
.text-new {
}
.text-edit {
  margin: 0 5px;
  /* line-height: 26px; */
}
.text-sub {
  color: #999;
  font-size: 12px;
}
.input-cate {
  font-size: 16px;
  background: transparent;
  border: 0;
  outline: 0;
  /* color: #ddd; */
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  width: 90%;
  letter-spacing: 2px;
  display: inline-block;
  height: 20px;
  margin-left: 5px;
  /* border-bottom: #fff solid 1px; */
  border-bottom: #000 solid 1px;
}
.input-cate-new {
  font-size: 12px;
}
.ok-cancel {
  margin-bottom: 15px;
  padding-left: 10px;
}

.deletecate {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100px;
}
.deletecate .text {
  color: #fff;
  text-decoration-line: none;
  position: absolute;
  top: 10px;
}
.deletecate button {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 55px;
  background: #fff;
  border-radius: 50px;
  border: 0;
  outline: 0;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.deletecate button:hover {
  background: #da3b3b;
  transition: background 0.2s;
}
.deletecate button .ok {
}
.deletecate button .ok::after {
  content: "";
  width: 14px;
  height: 8px;
  border-left: 5px solid #000;
  border-bottom: 5px solid #000;
  position: absolute;
  left: 11px;
  top: 11px;
  transform: rotate(-45deg);
}
.upload {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 160px;
}
.input-file {
  color: #fff;
  width: 80%;
  outline: 0;
}
.upload .text {
  color: #fff;
  text-decoration-line: none;
  position: absolute;
  top: 10px;
}

.upload button {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 120px;
  background: #fff;
  border-radius: 50px;
  border: 0;
  outline: 0;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload button .arrow {
}
.upload button .arrow::after {
  content: "";
  width: 8px;
  height: 8px;
  border-bottom: 5px solid #000;
  border-left: 5px solid #000;
  position: absolute;
  left: 14px;
  top: 16px;
  transform: rotate(135deg);
}
.upload button:hover {
  background: #19a219;
  transition: background 0.2s;
}
</style>
