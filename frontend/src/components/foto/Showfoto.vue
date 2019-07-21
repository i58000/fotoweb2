<template>
  <div class="showfoto" v-show="showCond" :style="style.showfoto">
    <div class="bg" @click="close"></div>
    <div class="prev">
      <div class="arrow" @click="prev"></div>
    </div>
    <img class="img" :src="src" />
    <div class="next">
      <div class="arrow arrow-right" @click="next"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCond: false,
      active: false,
      src: null,
      style: {
        showfoto: {
          opacity: 0
        }
      }
    };
  },
  watch: {
    active() {
      if (this.active) {
        // console.log("watch active");
        this.showCond = true;
        setTimeout(() => {
          this.style.showfoto.opacity = 1;
        }, 100);
      } else {
        this.style.showfoto.opacity = 0;
        setTimeout(() => {
          this.showCond = false;
        }, 500);
      }
    }
  },
  created() {
    document.addEventListener("keydown", e => {
      // console.log(e);
      if (this.active) {
        if (e.key == "ArrowLeft" || e.key == "ArrowUp") {
          e.preventDefault();
          this.$emit("prev");
        } else if (e.key == "ArrowRight" || e.key == "ArrowDown") {
          e.preventDefault();
          this.$emit("next");
        } else if (e.key == "Escape") {
          e.preventDefault();
          this.close();
        }
      }
    });
    document.addEventListener("mousewheel", e => {
      // console.log(e);
      if (this.active) {
        if (e.deltaY < 0) {
          // e.preventDefault();
          this.$emit("prev");
        } else if (e.deltaY > 0) {
          // e.preventDefault();
          this.$emit("next");
        }
      }
    });
  },
  methods: {
    show(src) {
      this.active = true;
      this.src = src;
    },
    close() {
      this.active = false;
    },
    prev() {
      this.$emit("prev");
    },
    next() {
      this.$emit("next");
    }
  }
};
</script>

<style scoped>
.showfoto {
  transition: opacity 0.5s;
  opacity: 0;
  height: 100%;
  width: 100%;
  background: #000a;
  z-index: 999;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  z-index: 999;
  max-width: 80%;
  max-height: 80%;
}
.bg {
  height: 100%;
  width: 100%;
  position: absolute;
}
.prev {
  height: 100%;
  /* width: 100px; */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  float: left;
  position: absolute;
  left: 0;
  /* min-width: 300px;
  max-width: 500px; */
  margin: 0 100px;
}
.next {
  height: 100%;
  /* width: 100px; */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  position: absolute;
  right: 0;
  /* min-width: 300px;
  max-width: 500px; */
  margin: 0 100px;
}
.arrow {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-left: solid 10px #fffa;
  border-bottom: solid 10px #fffa;
  transform: rotate(45deg);
}
.arrow-right {
  transform: rotate(-135deg);
}
</style>
