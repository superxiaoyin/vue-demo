import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);


const state={ 
    parms: {},
    userInfo:{}
};

sessionStorage
const getters = {   //实时监听state值的变化(最新状态)
    getParms(state) {  //承载变化的showFooter的值
       return state.parms
    },
    getUserInfo(state){
        return state.userInfo
    }
};
const mutations = {
    newParms(state, data){
      state.parms = data.obj
    },
    newUserInfo(state, userInfo){ 
        console.log(userInfo)
        state.userInfo = userInfo
    }
};
const actions = {
    getNewParms(context, obj){ 
       context.commit('newParms', obj)
    },
    getNewUserInfo(context, userInfo){ 
        context.commit('newUserInfo', userInfo)
    }
};


const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        reducer(val) {
            return {
                // 只储存state中的assessmentData
                parms: val.parms,
                userInfo: val.userInfo
            }
        }
    })]
   
});
 
export default store;