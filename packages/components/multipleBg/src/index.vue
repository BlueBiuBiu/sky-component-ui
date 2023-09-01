<template>
  <div class="more-bg">
    <div class="bg"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@keyframes para {
  100% {
    background-position: -800px 100%, 500px 50%, 1000px 100%, 400px 0;
  }
}
.more-bg {
  width: 100%;
  height: 100vh;
  .bg {
    width: 100%;
    height: 500px;
    background-color: hsla(200, 40%, 30%, 0.4);
    background-image: url("../assets/more-bg1.png"),
      url("../assets/more-bg2.png"), url("../assets/more-bg3.png"),
      url("../assets/more-bg4.png");
    background-repeat: repeat-x;
    background-position: 0 100%, 0 50%, 0 100%, 0 0;
    background-size: 800px, 500px 200px, 1000px, 400px 260px;
    animation: 20s para infinite linear;
  }
}
</style>
