<template>
  <div class="dialog" v-show="showCond" :style="style.dialog">
    <div class="frame" :style="style.frame">
      <slot></slot>
    </div>
    <div class="bg" @click="close"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCond: true,
      active: false,
      style: {
        dialog: {
          opacity: 0
        },
        frame: {}
      },
      frameHeight: 0,
      frameTopFrom: 0,
      frameTopTo: 0
    };
  },
  watch: {
    active() {
      if (this.active) {
        this.style.frame.top = this.frameTopFrom; //`calc(50% - ${this.frameHeight / 2 + 50}px)`;
        this.showCond = true;
        setTimeout(() => {
          this.style.dialog.opacity = 1;
          this.style.frame.top = this.frameTopTo; // `calc(50% - ${this.frameHeight / 2}px)`;
        }, 100);
      } else {
        this.style.dialog.opacity = 0;
        this.style.frame.top = this.frameTopFrom; // `calc(50% - ${this.frameHeight / 2 + 50}px)`;
        setTimeout(() => {
          this.showCond = false;
        }, 500);
      }
    }
  },
  created() {},
  mounted() {
    this.frameHeight = this.$el.querySelector(".frame").clientHeight;
    this.frameTopFrom = `calc(50% - ${this.frameHeight / 2 + 50}px)`;
    this.frameTopTo = `calc(50% - ${this.frameHeight / 2}px)`;

    this.showCond = false;
  },
  methods: {
    show() {
      this.active = true;
    },
    close() {
      this.active = false;
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.dialog {
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
.bg {
  height: 100%;
  width: 100%;
  position: absolute;
}
.frame {
  position: absolute;
  transition: top 0.5s;
  min-height: 100px;
  min-width: 200px;
  background: #111;
  border-radius: 10px;
  box-shadow: 0 0 30px #000;
  padding: 40px;
  z-index: 9999;
}
</style>
