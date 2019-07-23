<template>
  <div class="root">
    <!-- <Admin v-if="inAdmin" @toFotos="inAdmin = false"/>
    <Fotos v-else @toAdmin="inAdmin = true"/>-->
    <FotosMobile v-if="isMobile"/>
    <Fotos v-else/>
  </div>
</template>

<script>
// import Admin from "./Admin";
import Fotos from "./Fotos";
import FotosMobile from "./FotosMobile";

export default {
  components: { Fotos, FotosMobile },
  data() {
    return {};
  },
  mounted() {
    console.log("isMobile:", this.isMobile);
  },
  computed: {
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  }
};
</script>

<style>
.root {
  height: 100%;
}
</style>
