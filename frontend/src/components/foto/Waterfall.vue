<template>
  <div class="waterfall">
    <div class="imgs" @scroll="onScroll">
      <div
        class="item"
        v-for="(item, index) in imgList"
        :key="index"
        :style="item.style"
        v-show="!item.delete"
      >
        <img :src="item.src" @load="onloadImg(index,$event)" :cate="cate" />
        <div class="cover">
          <div class="op">
            <div class="show" @click="show(index)"></div>
            <div class="text" v-if="admin">
              <div class="text-in">
                <template v-if="whichFotoEdit == index">
                  <span style="margin-right:10px" @click="editFotoOK(index)">OK</span>
                  <span style="margin-left:10px" @click="editFotoCancel">CANCEL</span>
                </template>
                <template v-else>
                  <span style="margin-right:10px" @click="editFoto(index)">EDIT</span>
                  <span style="margin-left:10px" @click="showDeleteFoto(index)">X</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="shade">
          <input
            v-if="whichFotoEdit == index"
            type="text"
            class="input-foto"
            :placeholder="item.name"
            v-model="editFotoName"
            spellcheck="false"
            onkeydown="if(event.keyCode==32) return false"
          />
          <div class="text" v-else>{{getFotoDisplayName(item.name)}}</div>
        </div>
      </div>
      <template v-if="showDone">
        <slot name="done">
          <div class="done" :style="style.done">THERE IS NO MORE...</div>
        </slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    col: Number,
    gap: Number,
    imgs: Array
  },
  data() {
    return {
      cate: null,
      admin: false,
      whichFotoEdit: null,
      editFotoName: null,
      config: {
        col: 3,
        gap: 10
      },
      fallTo: [],
      imgList: [],
      imgSrc: [],
      imgWidth: 100,
      style: {
        done: {},
        cover: {}
      },
      loadTo: 0,
      loaded: [],
      scrolling: false,
      dom: {
        imgs: null
      },
      loadDone: false,
      showDone: false,
      deleting: false,
      sorting: false,
      loadingCount: 0,
      showTo: 0
    };
  },
  computed: {
    fallToMin() {
      let min = this.fallTo[0];
      let i = 0;
      for (let j = 1; j < this.fallTo.length; j++) {
        let cur = this.fallTo[j];
        cur < min ? ((min = cur), (i = j)) : null;
      }
      return {
        value: min,
        index: i
      };
    }
  },
  watch: {
    fallTo() {
      if (this.showDone == true) {
        console.log("top:", Math.max.apply(null, this.fallTo));
        this.style.done.top = Math.max.apply(null, this.fallTo) + "px";
        // debugger
        // this.style.done.height
      }
    },
    showDone() {
      if (this.showDone == true) {
        console.log("top:", Math.max.apply(null, this.fallTo));
        this.style.done.top = Math.max.apply(null, this.fallTo) + "px";
        // for gen scroll
        let h =
          this.dom.imgs.clientHeight -
          parseInt(this.style.done.top) -
          60 +
          1 +
          "px";
        this.style.done.height = h;
        // debugger
      } else {
        console.log("showDone watch exception");
      }
    }
  },
  created() {
    console.log(this);
  },
  methods: {
    deleteFoto(index) {
      console.log("deleteFoto", index);
      this.deleting = true;
      this.imgList[index].delete = true;
      this.$forceUpdate();
      this.refall();
    },
    refall() {
      let imgs = this.imgList;
      for (let i = 0; i < this.config.col; i++) {
        this.$set(this.fallTo, i, 0);
      }
      console.log(this.fallTo);
      console.log(imgs);
      for (let i = 0, j = 0; i < imgs.length; i++) {
        if (!imgs[i].delete) {
          this.showMoreOne(i, j);
        } else {
          j++;
        }
      }
      // this.sorting = false;
      this.deleting = false;
      this.loadMore();
    },
    showDeleteFoto(index) {
      this.$emit("showDeleteFoto", index);
    },
    editFotoCancel() {
      this.whichFotoEdit = null;
    },
    editFoto(index) {
      this.whichFotoEdit = index;
      this.editFotoName = this.imgList[index].name;
    },
    editFotoOK(index) {
      // console.log("11111", index);
      this.$emit("editFoto", index, this.editFotoName);
    },
    editFotoDone(index, name) {
      let oldsrc = this.imgList[index].src;
      let arr1 = oldsrc.split(".");
      let ext = arr1[arr1.length - 1];
      let arr2 = oldsrc.split("/");
      arr2[arr2.length - 1] = [name, ext].join(".");
      let newsrc = arr2.join("/");
      console.log("ns;", newsrc);

      this.imgList[index].name = name;
      this.imgList[index].src = newsrc;

      // this.sorting = true;
      this.imgList.sort((a, b) => {
        console.log("com", a.name, b.name);
        return a.name.localeCompare(b.name);
      });
      this.editFotoCancel();
      // this.$forceUpdate();
      this.refall();
    },
    reload(imgs, cate) {
      this.cate = cate;
      // ===
      this.loadingCount = 0;
      this.showTo = 0;
      this.loaded = [];
      this.loadDone = false;
      this.showDone = false;
      this.loadTo = 0;
      this.style.done = {};
      this.config.col = this.col || this.config.col;
      this.config.gap = this.gap || this.config.gap;
      this.fallTo = [];
      for (let i = 0; i < this.config.col; i++) {
        this.fallTo.push(0);
      }
      this.imgSrc = imgs || [];
      this.imgList = [];

      if (imgs.length != 0) {
        this.$nextTick(() => {
          this.dom.imgs = this.$el.querySelector(".imgs");
          this.imgWidth =
            (this.dom.imgs.clientWidth + this.config.gap - 10) /
              this.config.col -
            this.config.gap;
          this.loadMore();
        });
      } else {
        this.showDone = true;
      }
    },
    show(i) {
      this.$emit("show", i);
    },
    loadMore() {
      let interval = setInterval(() => {
        if (this.loadDone) {
          clearInterval(interval);
          console.log("all loaded");
        }
        // scroll to bottom, load more one
        else if (
          this.dom.imgs.clientHeight + this.dom.imgs.scrollTop >
          this.fallToMin.value
        ) {
          this.loadMoreOne();
        }
        //
        else {
          clearInterval(interval);
        }
      }, 50);
    },
    onScroll() {
      // not in scrolling and not be done yet
      if (!this.scrolling && !this.loadDone) {
        this.scrolling = true;
        setTimeout(() => {
          this.loadMore();
          this.scrolling = false;
        }, 100);
      }
    },
    onloadImg(i, e) {
      // debugger;
      // if (e.path[0].getAttribute("cate") != this.cate) {
      if (e.target.getAttribute("cate") != this.cate) {
        return;
      }
      if (this.loaded.indexOf(i) > -1) return;
      this.loaded.push(i);
      // let h = e.path[0].height;
      // let w = e.path[0].width;
      let h = e.target.height;
      let w = e.target.width;
      let imgHeight = (h / w) * this.imgWidth;
      this.imgList[i].imgHeight = imgHeight;
      this.showMoreOne(i);
    },
    showMoreOne(i, dis) {
      // this.showTo++;
      this.loadingCount--;
      // debugger;
      console.log("---", this.showTo, i);
      let d = dis ? dis : 0;
      let top =
        this.fallToMin.value +
        (this.showTo++ - d < this.config.col ? 0 : this.config.gap);
      let col = this.fallToMin.index;
      this.imgList[i].style.height = this.imgList[i].imgHeight + "px";
      this.imgList[i].style.top = top + "px";
      this.imgList[i].style.left =
        col * (this.imgWidth + this.config.gap) + "px";
      this.imgList[i].style.display = "";
      this.imgList[i].style.opacity = 1;
      // set fallTo
      this.$set(this.fallTo, col, top + this.imgList[i].imgHeight);
      // 最后一张
      if (i == this.imgSrc.length - 1) {
        this.showDone = true;
      }
    },
    getFotoDisplayName(str) {
      if (str) {
        let arr = str.split(global.FOTOS_SEP);
        return arr[arr.length - 1];
      }
    },
    getFotoNameFromSrc(src) {
      if (src) {
        let arr = src.split("/");
        let name = arr[arr.length - 1].split(".")[0];
        return name;
      }
    },
    loadMoreOne() {
      if (this.loadingCount >= 3) {
        return;
      } else {
        this.loadingCount++;
      }
      let src = this.imgSrc[this.loadTo];
      // let arr = src.split("/");
      // let name = arr[arr.length - 1].split(".")[0];
      let name = this.getFotoNameFromSrc(src);
      // console.log(name);
      this.imgList.push({
        src: src,
        style: {
          width: this.imgWidth + "px",
          display: "none"
        },
        name: name
      });
      this.loadTo++;
      if (this.loadTo >= this.imgSrc.length) {
        this.loadDone = true;
      }
    }
  }
};
</script>

<style scoped>
.waterfall {
  height: 100%;
}
.imgs {
  width: inherit;
  position: relative;
  overflow-y: auto;
  min-height: 100px;
  height: 100%;
}
.imgs::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.imgs::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background: #ddd;
}
.imgs::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  border-radius: 10px;
  /* background: #ededed; */
}
img {
  width: inherit;
  height: inherit;
}
.item {
  position: absolute;
  transition: all 0.5s;
  opacity: 0;
}
.done {
  /* background: red; */
  color: #999;
  position: absolute;
  width: 100%;
  text-align: center;
  /* height: 120px; */
  margin-top: 60px;
  font-size: 12px;
}
.shade {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20%;
  width: 100%;
  background: linear-gradient(#0000, #0006);
  display: flex;
  justify-content: center;
  align-items: center;
}
.shade .text {
  font-size: 12px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  text-shadow: 0 0 10px #000;
  color: #fff;
  position: absolute;
}
.cover {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s;
  /* zz */
  /* background: #000a; */
}
.item:hover .cover {
  background: #000a;
}
.item:hover .cover .op {
  display: unset;
}
.cover .text {
  position: absolute;
  bottom: 20%;
  left: 0;
  color: #fffa;
  width: 100%;
}
.cover .text .text-in {
  width: fit-content;
  margin: 0 auto;
  font-size: 12px;
  letter-spacing: 2px;
}
.text-in span:hover {
  text-decoration-line: underline;
  cursor: pointer;
}
.op {
  /* zz */
  display: none;
}
.show {
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
}
.show::before {
  content: "";
  width: 10px;
  height: 10px;
  border-top: 4px solid #fff;
  border-right: 4px solid #fff;
  position: absolute;
  right: 0;
  top: 0;
}
.show::after {
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 4px solid #fff;
  border-left: 4px solid #fff;
  position: absolute;
  left: 0;
  bottom: 0;
}
.input-foto {
  background: transparent;
  border: 0;
  text-align: center;
  color: #fff;
  line-height: 20px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 12px;
  outline: 0;
  border-bottom: 1px solid #fffa;
  width: 50%;
}
</style>
