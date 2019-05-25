<template>
  <div class="root">
    <!-- <Admin v-if="inAdmin" @toFotos="inAdmin = false"/>
    <Fotos v-else @toAdmin="inAdmin = true"/>-->
    <Fotos/>
  </div>
</template>

<script>
// import Admin from "./Admin";
import Fotos from "./Fotos";

export default {
  components: { Fotos },
  data() {
    return {
      // inAdmin: false
    };
  }
};
</script>

<style>
.root {
  height: 100%;
}
</style>
