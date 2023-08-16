import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// const electron = window.require("electron");

import App from "./App.vue"
import router from './router'

// Vue.prototype.$electron = electron;

const app = createApp(App)
// 导入所有的 icons-vue
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
