import Storage from './storage'
import fly  from 'flyio/dist/npm/fly'
import { ElMessage } from 'element-plus'
import router from "../router/index.js";
const http = new fly()
const refreshFly = new fly()

//无需token的接口列表
const noTokenRequestUrl = {
    '/api/users/token': ["GET"],
    '/api/users': ["POST"]
}

const headers = {
    'X-Tag': import.meta.env.EASY_DOC_APP_NAME,
    'Accept': 'application/json',
    'ContentType': 'application/json',
}

refreshFly.config.baseURL = import.meta.env.EASY_DOC_SERVER_HOST
refreshFly.config.headers = headers

http.config.baseURL = import.meta.env.EASY_DOC_SERVER_HOST
http.config.headers = headers

const TokenKey = "user.token"

const refreshToken = async (token) => {
    console.log('refreshToken exec', token)
    let response = await refreshFly.get('/api/users/new-token', null, {headers: {'Authorization': 'Bearer ' + token}})
        .catch((err) => {//刷新失败则需要登录
            Storage.remove(TokenKey)
            router.replace("/login")
            throw new Error('refreshToken fail')
        })
    console.log('getToken response', response.data)
    if (response.status===200 && response.data.code === 0) {
        return response.data.data.token
    } else {
        Storage.remove(TokenKey)
        router.replace("/login")
    }
}
http.interceptors.request.use(async (request) => {
    // 给所有请求添加自定义header
    console.log('request being', request)
    try {
        http.lock()
        if (!noTokenRequestUrl[request.url] || noTokenRequestUrl[request.url].indexOf(request.method)<0){
            let token = Storage.get(TokenKey) //从vuex中获取token
            if (!token){//token不存在
                http.unlock()
                router.replace("/login")
                throw new Error('token不存在')
            }else{
                let now = parseInt((new Date()).getTime() / 1000)
                let arr = token.split(".")
                let tokenInfo = JSON.parse(atob(arr[1]))
                if (now > tokenInfo.exp - 300){//存在但是过期
                    let userToken = await refreshToken(token)
                    Storage.set(TokenKey, userToken)
                    request.headers['Authorization'] = 'Bearer ' + userToken
                }else{//存在但是未过期
                    request.headers['Authorization'] = 'Bearer ' + token
                }
            }
        }
    }finally {
        http.unlock()
    }

    // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    return request
})

http.interceptors.response.use(function (response) {
    console.log('request end', response)
    let data = response.data
    if ( data.code === 0 ){//请求成功
        return data
    }else if ( data.code === -1 ){//登录失效
        Storage.replace(TokenKey)
        router.replace("/login")
    }else{//请求出错
        ElMessage({
            message: response.data.message,
            duration: 2000
        })
        return Promise.reject(response.data.message)
    }
}, function (error) {
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if (error.response.status===401){
            Storage.remove(TokenKey)
            router.replace("/login")
        }else if (error.response.status===403){//权限不足
            router.replace("/")
        }else{
            router.replace("/login")
        }
    }

    return Promise.reject(error)
});

export default http
