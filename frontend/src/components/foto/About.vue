<template>
  <div class="about">
    <div class="container font">
      <div class="title">CAIJIAPEI</div>
      <div class="sub-title">JANANA BANANA</div>
      <div class="text">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod tempor incididunt ut labore et doloremagna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
      <div class="qrcode">
        <img src="./imgs/qrcode.png" alt srcset />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.font {
  text-align: right;

  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  width: 500px;
}
.title {
  font-size: 60px;
  letter-spacing: 15px;
  font-weight: bold;
  margin-right: -18px;
}
.sub-title {
  font-size: 22px;
  letter-spacing: 8px;
  font-weight: bold;
  margin-right: -8px;
}
.text {
  font-size: 14px;
  letter-spacing: 1px;
  margin-top: 10px;
  margin-bottom: 50px;
}
.qrcode {
  display: flex;
  justify-content: flex-end;
}
.qrcode img {
  height: 80px;
}
</style>
