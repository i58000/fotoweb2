<template>
  <div class="message" v-show="showCond" :style="style.message">
    <div class="frame" @click="click" :style="style.frame">
      <div class="left">
        <div class="text">{{text}}</div>
      </div>
      <div class="right" v-show="showClose" :style="style.close">
        <div class="circle" @click="close">
          <!-- <div class="line line-L"></div>
          <div class="line line-R"></div>-->
          <div class="x"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "message",
      showCond: false,
      showClose: false,
      active: false,
      style: {
        message: {
          opacity: 0
        },
        close: {
          opacity: 0
        },
        frame: {
          visibility: "hidden"
        }
      },
      timeout: null
    };
  },
  watch: {
    active() {
      if (this.active) {
        this.showCond = true;
        setTimeout(() => {
          this.style.message.opacity = 1;
          this.style.frame.visibility = "visible";
        }, 100);
      } else {
        this.style.message.opacity = 0;
        setTimeout(() => {
          if (!this.active) {
            this.reset();
          } else {
            // this.showClose = false;
          }
        }, 500);
      }
    }
  },
  mounted() {
    // this.alert("11111 1111 1111 1111 11111 1111 111111 11111");
    // this.alert("11111 1111 1111 11111");
  },
  methods: {
    reset() {
      this.showCond = false;
      this.showClose = false;
      this.text = "message";
      this.style = {
        message: {
          opacity: 0
        },
        close: {
          opacity: 0
        },
        frame: {
          visibility: "hidden"
        }
      };
      this.timeout = null;
    },
    alert(msg, delay) {
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      this.text = msg;
      this.active = true;
      this.timeout = setTimeout(() => {
        this.active = false;
      }, delay || 2000);
    },
    click() {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.showClose = true;
      setTimeout(() => {
        this.style.close.opacity = 1;
      }, 100);
    },
    close() {
      this.active = false;
    }
  }
};
</script>

<style scoped>
.message {
  visibility: hidden;
  transition: opacity 0.5s;
  z-index: 9999;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 44%;
  width: 100%;
}
.frame {
  background: #000a;
  box-shadow: 0 0 20px #0006;
  color: #fff;
  padding: 10px 30px;
  min-height: 30px;
  border-radius: 40px;
  min-width: 50px;
  margin: 0 auto;
  max-width: 400px;
  position: relative;
}
.left {
  height: 100%;
  left: 0;
  top: 0;
  padding: 0 15px;
  line-break: auto;
  line-height: 30px;
  font-size: 16px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.right {
  transition: opacity 0.2s;
  width: 50px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right .circle {
  background: #fffc;
  height: 20px;
  width: 20px;
  border-radius: 20px;
  position: relative;
}
/* .right .circle .line {
  background: #333;
  height: 2px;
  width: 10px;
  border-radius: 20px;
  position: absolute;
  top: 8.5px;
  left: 4.5px;
}

.right .circle .line-L {
  transform: rotate(45deg);
}
.right .circle .line-R {
  transform: rotate(-45deg);
} */

.x {
  position: relative;
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}

.x::before {
  content: "";
  width: 12px;
  border-top: 2px solid #333;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.x::after {
  content: "";
  width: 12px;
  border-top: 2px solid #333;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
