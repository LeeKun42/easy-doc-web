import { createStore } from 'vuex'
import fly from "../lib/http.js";

export default createStore({
    state: {
        user:{},
    },
    mutations: {
        setUser: (state, user) => {
            state.user = user
        },
        logout: (state) => {//清除用户信息
            state.user = {}
        }
    },
    actions: {
        pullUser(context) {
            fly.get('/api/users/info').then((res)=>{
                context.commit('setUser', res.data)
            })
        },
    },
    modules: {

    }
})