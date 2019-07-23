<template>
  <div class="fotos">
    <div class="header font">
      <div class="title">CAIJIAPEI</div>
      <div class="menu-block">
        <div class="sub-title">{{cates[whichCate] && getCateDisplayName(cates[whichCate].name)}}</div>
        <div class="menu-btn" @click="onClickMenu"></div>
      </div>
    </div>
    <div class="main">
      <About v-show="isAbout" style="font-size: 8px"></About>
      <Waterfall
        v-show="!isAbout"
        ref="waterfall"
        class="waterfall"
        :gap="10"
        :col="2"
        @show="showFoto"
      />
    </div>
    <!-- <div class="footer">footer</div> -->
    <div :class="classMenu" class="menu-shade" @click="onClickMenuShade">
      <div class="menu font">
        <div
          v-for="(item, index) in cates"
          :key="index"
          class="menu-item"
          :class="index === whichCate? 'menu-item-active':''"
          @click="onClickMenuItem($event, index)"
        >{{getCateDisplayName(item.name)}}</div>
        <!-- <div class="menu-item" @click="onClickMenuItem">ABOUT</div>
        <div class="menu-item" @click="onClickMenuItem">ABOUT</div>
        <div class="menu-item menu-item-active" @click="onClickMenuItem">ABOUT</div>-->
      </div>
    </div>
    <!-- showfoto -->
    <Showfoto ref="showfoto" no-arrow @next="showNext" @prev="showPrev"></Showfoto>

    <!-- message -->
    <Message ref="message"></Message>
  </div>
</template>

<script>
import Waterfall from "./Waterfall.vue";
import Showfoto from "./Showfoto.vue";
import Message from "./Message.vue";
import About from "./About.vue";

import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  components: { Waterfall, Showfoto, Message, About },
  data() {
    return {
      url: global.config.context + "fotos/",
      // "http://" + global.config.host + ":" + global.config.port + "/fotos/",
      whichFoto: 0,
      whichCate: 0,
      cates: [],
      classMenu: ""
    };
  },
  computed: {
    isAbout() {
      let c = this.cates[this.whichCate];
      return !c || c.type === "about";
    }
  },
  watch: {
    whichCate() {
      if (this.isAbout) {
        // debugger;
      } else {
        let imgs = this.cates[this.whichCate].imgs;
        if (!imgs || imgs.length == 0) {
          // get cates
          this.reload([]);
        } else {
          this.reload(this.cates[this.whichCate].imgs);
        }
      }
    }
  },
  created() {
    this.getCates();
  },
  methods: {
    getCateDisplayName(str) {
      let arr = str.split(global.FOTOS_SEP);
      return arr[arr.length - 1];
    },
    onClickMenuItem(e, i) {
      console.log("onClickMenuItem", e, i);
      this.whichCate = i;
      // e.stopPropagation();
    },
    onClickMenuShade(e) {
      console.log("onClickMenuShade", e);
      this.classMenu = "";
    },
    onClickMenu(e) {
      console.log("onClickMenu", e);
      this.classMenu = "menu-active";
    },
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
          this.cates.push({ name: "ABOUT", type: "about" });
        })
        .catch(error => {
          this.cates.push({ name: "ABOUT", type: "about" });
          console.log(error);
        });
    },
    getCateDisplayName(str) {
      let arr = str.split(global.FOTOS_SEP);
      return arr[arr.length - 1];
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
.header {
  height: 48px;
  float: left;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.main {
  width: calc(100% - 30px);
  height: calc(100% - 48px);
  margin-left: 20px;
  margin-right: 10px;
  float: left;
}
.title {
  font-size: 18px;
  line-height: 48px;
  margin-left: 15px;
}
.font {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
}
.menu-block {
  height: 44px;
  /* width: 200px; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}
.menu-btn {
  width: 18px;
  height: 2px;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  background-color: #000;
  padding: 4px 0;
  background-clip: content-box;
}
.menu-shade {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
.menu {
  background: white;
  box-shadow: 0 0 20px #0003;
  border-radius: 5px;
  width: fit-content;
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  min-width: 40px;
  min-height: 40px;
}
.menu-item {
  height: 20px;
  margin: 10px;
  line-height: 20px;
  letter-spacing: 1px;
  font-weight: lighter;
  font-size: 12px;
  text-align: right;
}
.menu-item-active {
  font-weight: bold;
}
.sub-title {
  font-weight: lighter;
  line-height: 48px;
  font-size: 12px;
  margin-right: 12px;
}
.menu-active {
  visibility: visible;
  opacity: 1;
}
</style>
