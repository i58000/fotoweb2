<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {}
};
</script>

<style>
#app,
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
