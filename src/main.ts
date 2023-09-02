import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "element-plus/theme-chalk/el-message-box.css"
import "element-plus/theme-chalk/el-message.css"
import 'element-plus/theme-chalk/el-loading.css'
// import "element-plus/theme-chalk/el-scrollbar.css"
import mitt from "mitt";
// const zerorpc = require("zerorpc")

import App from "./App.vue"
import router from './router'

const Mit = mitt()
declare module "vue" {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}

// let client = new zerorpc.Client()
// client.connect("tcp://0.0.0.0:4242")
// client.invoke("test", "123", (error:any, res:any) => {
//     if (error) {
//         console.log(error)
//     }
//     else {
//         console.log(res)
//     }
// })

const app = createApp(App)
// 导入所有的 icons-vue
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.config.globalProperties.$Bus = Mit
app.use(router)

app.mount('#app')
