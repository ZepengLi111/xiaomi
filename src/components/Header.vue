<template>
  <div class="header">
<!--    <el-text class="now-position">insights</el-text>-->
<!--    <el-icon class="hover no-drag left-arrow"><ArrowLeft /></el-icon>-->
<!--    <el-icon class="hover no-drag right-arrow"><ArrowRight /></el-icon>-->
<!--    <div class="block avatar hover no-drag">-->
<!--      <el-avatar :size="30" src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' />-->
<!--    </div>-->
    <el-icon size="20" class="hover no-drag close"  @click="clickClose"><Close /></el-icon>
  </div>
</template>

<script setup lang="ts">
  const {ipcRenderer} = window.require('electron');
  const clickClose = () => {
    ipcRenderer.send("window-close")
  }
</script>

<style lang="less">
  .header {
    //-webkit-user-select:none;
    //-moz-user-select:none;
    //-ms-user-select:none;
    //user-select:none;

    margin-top: 16px;
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    .now-position {
      font-size: large;
      font-family: sans-serif;
      font-weight: bold;
      margin-right: 25px;
    }
    .hover:hover {
      cursor: pointer;
    }
    .left-arrow {
      margin-right: 10px;
    }
    .right-arrow {
      margin-right: 460px;
    }
    .avatar {
      position: absolute;
      right: 80px;
      top: 15px;
    }
    .close {
      position: absolute;
      right: 30px;
      top: 20px;
    }
    .close:hover {
      transform: rotate(180deg);
      transition-duration: 0.5s;
    }
    .no-drag {
      -webkit-app-region: no-drag;
    }
  }
</style>