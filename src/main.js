import './assets/main.css'

import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import router from './router'
import http from "./lib/http.js";
import Storage from "./lib/storage.js";
import ImportJson from "./lib/importJsonDialog";
import store from './store/index'

const app = createApp(App)

app.use(router)
app.use(VueClipboard)
app.use(store)

app.config.globalProperties.$importJson = ImportJson
app.config.globalProperties.$fly = http
app.config.globalProperties.$storage = Storage

app.config.globalProperties.doCopy = function (txt){
    this.$copyText(txt).then(function (e) {
        ElMessage.success('复制成功')
    }, function (e) {
        console.log(e)
    })
}

app.mount('#app')
