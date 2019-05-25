<template>
  <div class="root">
    <template v-if="auth">
      <el-container class="root">
        <el-header>
          Header
          <span @click="toFotos">toFotos</span>
        </el-header>
        <el-main>
          <el-tabs v-model="tabs.active" type tab-position="left">
            <el-tab-pane
              :key="item.name"
              v-for="(item) in tabs.items"
              :label="item.title"
              :name="item.name"
              :lazy="true"
            >
              <!-- container begin -->
              <el-container>
                <el-header height="40px" style="line-height: 40px;">
                  <span style="margin-right: 20px">{{ item.name }}</span>
                  <span style="font-size: 12px; color: #aaa">{{ item.desc }}</span>
                  <!-- <el-button icon="el-icon-search" circle></el-button> -->

                  <div style="float:right">
                    <el-button type="success" icon="el-icon-upload" circle @click="clickUpload"></el-button>
                    <el-button type="primary" icon="el-icon-edit" circle @click="clickEditCate"></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="dialog.visible = true"
                    ></el-button>
                  </div>
                </el-header>
                <el-main>
                  <div v-show="panelState == 'UPLOAD'">
                    <el-row>
                      <el-upload
                        ref="upload"
                        :action="uploadCfg.url"
                        list-type="picture-card"
                        :on-remove="handleRemove"
                        :auto-upload="false"
                        :file-list="uploadCfg.fileList"
                      >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-row>
                    <el-row style="margin-top: 20px;">
                      <el-button type="default" @click="panelState = 'FOTO'">返回</el-button>
                      <el-button type="primary" @click="submitUpload">上传</el-button>
                    </el-row>

                    <!-- <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt>
                    </el-dialog>-->
                  </div>
                  <div v-show="panelState == 'EDIT'">
                    <!-- <el-row> -->
                    <el-col :span="8">
                      <el-form ref="form" :model="editCateCfg" label-width="80px">
                        <el-form-item label="新的名称">
                          <el-input v-model="editCateCfg.name"></el-input>
                        </el-form-item>
                        <el-form-item label="新的描述">
                          <el-input type="textarea" v-model="editCateCfg.desc"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button @click="panelState = 'FOTO'">取消</el-button>
                          <el-button type="primary" @click="editCate">保存</el-button>
                        </el-form-item>
                      </el-form>
                    </el-col>
                    <!-- </el-row> -->
                  </div>
                  <div v-show="panelState == 'FOTO'">
                    <el-row :gutter="20">
                      <el-col
                        :span="6"
                        v-for="(foto, index) in fotos"
                        :key="index"
                        style="margin-bottom: 20px"
                      >
                        <div class="grid-content bg-purple">
                          <div
                            class="foto"
                            @mouseenter="mouseenterFoto"
                            @mouseleave="mouseleaveFoto"
                            :index="index"
                          >
                            <div class="foto-hover" :style="foto.style">
                              <el-button type="primary" icon="el-icon-edit" circle></el-button>
                              <el-button type="danger" icon="el-icon-delete" circle></el-button>
                            </div>
                            <div class="foto-text">
                              <div class="shadow">
                                <div class="text">
                                  <span class="name">{{foto.name}}</span>
                                  <span class="desc">{{foto.desc}}</span>
                                </div>
                              </div>
                            </div>
                            <el-image
                              style="width: 100%; height: 100%"
                              :src="foto.path"
                              fit="cover"
                            ></el-image>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 20px; float:right">
                      <el-pagination
                        background
                        layout="prev, pager, next"
                        :hide-on-single-page="true"
                        :page-size="8"
                        :total="40"
                        @current-change="clickPage"
                      ></el-pagination>
                    </el-row>
                  </div>
                </el-main>
              </el-container>
              <!-- container end -->
            </el-tab-pane>
            <el-tab-pane label="添加分类" name="add">
              <el-header height="40px">添加分类</el-header>
              <el-main>
                <!-- <el-row> -->
                <el-col :span="8">
                  <el-form ref="form" :model="newCateCfg" label-width="80px">
                    <el-form-item label="名称">
                      <el-input v-model="newCateCfg.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input type="textarea" v-model="newCateCfg.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="newCate">创建</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <!-- </el-row> -->
              </el-main>
            </el-tab-pane>
            <el-tab-pane label="waterfall" name="waterfall">
              <el-header height="40px">waterfall</el-header>
              <el-main>
                <Waterfall style="height: 400px"></Waterfall>
              </el-main>
            </el-tab-pane>
          </el-tabs>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>

      <el-dialog title="提示" :visible.sync="dialog.visible" width="30%">
        <span>{{tabs.active}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="danger" @click="delCate">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <template v-else>
      <div>auth</div>
    </template>
  </div>
</template>

<script>
import Waterfall from "./Waterfall";
export default {
  components: { Waterfall },
  data() {
    return {
      auth: null,
      fotos: [
        {
          name: "name 1",
          desc: "desc 1",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
          // src: require()
        },
        {
          name: "name 2",
          desc: "desc 2",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
        },
        {
          name: "name 1",
          desc: "desc 1",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
        },
        {
          name: "name 1",
          desc: "desc 1",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
        },
        {
          name: "name 2",
          desc: "desc 2",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
        },
        {
          name: "name 1",
          desc: "desc 1",
          path: "http://anjinshuo.tech/img/luv.29034d7e.jpg"
        }
      ],
      panelState: "FOTO", // "EDIT" "UPLOAD"
      uploadCfg: {
        url: "https://jsonplaceholder.typicode.com/posts/",
        fileList: []
      },
      editCateCfg: {
        // visible: false,
        name: null,
        desc: null
      },
      newCateCfg: {
        name: null,
        desc: null
      },
      dialog: {
        visible: false
      },
      tabs: {
        active: "waterfall",
        items: [
          {
            title: "11111",
            name: "11111",
            desc: "Tab 1 desc"
          },
          {
            title: "22",
            name: "22"
          },
          {
            title: "3",
            name: "3",
            desc: "Tab 333 desc"
          }
        ]
      }
    };
  },
  computed: {
    cateIndex() {
      let i = 0;
      for (i = 0; i < this.tabs.items.length; i++) {
        if (this.tabs.items[i].name == this.tabs.active) {
          // activeItem = this.tabs.items[i];
          break;
        }
      }
      return i;
    }
  },
  created() {},
  methods: {
    toFotos() {
      this.$emit("toFotos");
    },
    submitUpload() {
      this.$refs.upload[this.cateIndex].submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    mouseenterFoto(e) {
      let index = e.path[0].getAttribute("index");
      this.fotos[index].style = {
        opacity: 1
      };
      this.$forceUpdate();
    },
    mouseleaveFoto(e) {
      let index = e.path[0].getAttribute("index");
      this.fotos[index].style = {
        opacity: 0
      };
      this.$forceUpdate();
    },
    clickPage(p) {
      console.log("click to page:", p);
    },
    clickUpload() {
      this.panelState = "UPLOAD";
    },
    clickEditCate() {
      let activeItem = this.tabs.items[this.cateIndex];
      this.editCateCfg.name = activeItem.name;
      this.editCateCfg.desc = activeItem.desc;
      this.panelState = "EDIT";
    },
    editCate() {
      let i = this.cateIndex;
      console.log(this.editCateCfg);
      console.log(this.tabs);
      // invalid
      if (
        !this.editCateCfg.name ||
        (this.editCateCfg.name == this.tabs.items[i].name &&
          this.editCateCfg.desc == this.tabs.items[i].desc)
      ) {
        // tips
      } else {
        // update
        this.tabs.items[i].title = this.editCateCfg.name;
        this.tabs.items[i].name = this.editCateCfg.name;
        this.tabs.items[i].desc = this.editCateCfg.desc;
        this.tabs.active = this.editCateCfg.name;
        // this.editCateCfg.visible = false;
        this.panelState = "FOTO";
      }
    },
    newCate() {
      if (!this.newCateCfg.name) {
        // tips
      } else {
        this.newCateCfg.visible = false;
        let newTabName = this.newCateCfg.name;
        this.tabs.items.push({
          title: newTabName,
          name: newTabName,
          content: "New Tab content"
        });
        this.tabs.active = newTabName;
        this.newCateCfg.name = null;
      }
    },
    delCate() {
      this.dialog.visible = false;
      let targetName = this.tabs.active;
      let tabs = this.tabs.items;
      let activeName = this.tabs.active;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.tabs.active = activeName;
      this.tabs.items = tabs.filter(tab => tab.name !== targetName);
    }
  }
};
</script>
<style scoped>
.foto {
  position: relative;
}
.foto-hover {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.5s;
}
.foto-text {
  height: 100%;
  width: 100%;
}
.foto-text .shadow {
  height: 40%;
  background: linear-gradient(rgba(5, 5, 5, 0), rgba(180, 180, 180, 0.5));
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.foto-text .name {
  text-shadow: 0 0 10px black;
  display: block;
  text-align: center;
  color: #fff;
}
.foto-text .desc {
  text-shadow: 0 0 10px black;
  display: block;
  color: #fffa;
  text-align: center;
  font-size: 12px;
}
</style>
