import { createVNode, render} from 'vue'
import ImportJson from '@/components/ImportJson.vue'

let instance = null
let mountNode = null;
const ip = {
    open: function(callback) {
        instance = createVNode(ImportJson,{
            visible: true,
            callback: callback
        })
        if (mountNode) {
            document.body.removeChild(mountNode);
            mountNode = null
        }
        //创建一个空的div
        mountNode = document.createElement("div")
        //render函数的作用就是将Notice组件的虚拟DOM转换成真实DOM并插入到mountNode元素里
        render(instance, mountNode)
        //然后把转换成真实DOM的Notice组件插入到body里
        document.body.appendChild(mountNode)

    },
    close: function() {
        document.body.removeChild(mountNode)
        mountNode = null
    }
}

export default ip
