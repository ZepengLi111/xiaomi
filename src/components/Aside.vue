<template>
  <div class="aside">
    <el-col class="aside-col">
      <el-row class="logo">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <el-text class="logo-text">chat secretary</el-text>
      </el-row>

      <el-menu class="menu">
        <el-menu-item index="1" @click="changePage('chatContent')">
          <el-icon><ChatDotRound /></el-icon>
          <span>微信消息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="changePage('session2')">
          <el-icon><document /></el-icon>
          <span>统计分析</span>
        </el-menu-item>
        <el-menu-item index="3" @click="changePage('session3')">
          <el-icon><location /></el-icon>
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4" @click="changePage('session4')">
          <el-icon><setting /></el-icon>
          <span>Navigator Four</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import axios from "axios";
const instance = getCurrentInstance();
const changePage = (pagePath:string) => {
  axios.get("http://localhost:5031/func", {
    params: {
      funcNum: 0,
    }
  })
  instance?.proxy?.$Bus.emit("change-page-main", pagePath)
}
</script>

<style lang="less">
  .aside {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;

    width: 100%;
    margin: 0;
    padding: 0;
    .logo {
      margin-left: 15px;
      margin-top: 20px;
      .logo-text {
        margin-left: 10px;
      }
    }
    .menu {
      background-color: #f6f6fb;
      margin-top: 40px;
      border-right: 0;
      .el-menu-item {
        border-right: rgb(113, 102, 249) 2px;
      }
      .el-menu-item:hover {
        background-color: #f1f0fb;
        border-right-style: solid;
      }
    }
  }
</style>