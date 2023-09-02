<template>
  <el-scrollbar>
    <router-view></router-view>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('change-page-main', (path) => {
  router.push(path as string)
})
router.push("chatContent")

// ElMessage({
//   type: 'success',
//   message: 'Delete completed',
// })

</script>

<style lang="less">

</style>