import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {ElectronDevPlugin} from "./plugins/vite.electron.dev";
import { ElectronBuildPlugin} from "./plugins/vite.electron.build";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElectronDevPlugin(),
    ElectronBuildPlugin(),
    AutoImport({
      resolvers: [
          ElementPlusResolver(),
      ],
    }),
    Components({
      resolvers: [
          ElementPlusResolver(),
      ],
    }),
  ],
  base: './',  // 默认是绝对路径，改成相对路径，不然会白屏
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
