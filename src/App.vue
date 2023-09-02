<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Main from "@/components/Main.vue";

</script>

<template>
  <div class="common-layout">
    <el-container class="cover">
      <el-aside><Aside></Aside></el-aside>
      <el-container class="right-container">
        <el-header><Header></Header></el-header>
        <el-main><Main></Main></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less">
  html,body,#app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: block;
  }
  .cover, .common-layout{
    height: 100%;
    width: 100%;
  }
  .el-header {
    width: 100%;
    background-color: #ffffff;
    border-bottom: rgb(241, 241, 246) 1px solid;
  }
  .el-aside {
    //background-color: rgba(234, 240, 248, 0.91);
    max-width: 200px;
    background-color: #f6f6fb;
  }
  .el-main {
    background-color: #ffffff;
  }
  .right-container {
    padding-right: 20px;
    padding-left: 20px;
  }


</style>
