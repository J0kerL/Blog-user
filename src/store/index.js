import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolbar: JSON.parse(localStorage.getItem("toolbar") || '{"visible": false, "enter": true}'),
    sortInfo: JSON.parse(localStorage.getItem("sortInfo") || '[]'),
    currentUser: JSON.parse(localStorage.getItem("currentUser") || '{}'),
    currentAdmin: JSON.parse(localStorage.getItem("currentAdmin") || '{}'),
    sysConfig: JSON.parse(localStorage.getItem("sysConfig") || '{}'),
    webInfo: JSON.parse(localStorage.getItem("webInfo") || '{"webName": "", "webTitle": [], "notices": [], "randomCover": [], "footer": "", "backgroundImage": "", "avatar": ""}'),
    // 添加缓存状态
    cacheFlags: {
      sortInfoLoaded: false,
      articlesLoaded: false
    }
  },
  getters: {
    articleTotal: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        if (state.sortInfo.length === 1) {
          return state.sortInfo[0].countOfSort;
        } else {
          return state.sortInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.countOfSort;
            } else {
              return prev.countOfSort + curr.countOfSort;
            }
          });
        }
      } else {
        return 0;
      }
    },
    navigationBar: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        return state.sortInfo.filter(f => f.sortType === 0);
      } else {
        return [];
      }
    }
  },
  mutations: {
    changeToolbarStatus(state, toolbarState) {
      state.toolbar = toolbarState;
      localStorage.setItem("toolbar", JSON.stringify(toolbarState));
    },
    loadSortInfo(state, sortInfo) {
      if (sortInfo !== null && sortInfo.length !== 0) {
        state.sortInfo = sortInfo.sort((s1, s2) => s1.priority - s2.priority);
        localStorage.setItem("sortInfo", JSON.stringify(sortInfo.sort((s1, s2) => s1.priority - s2.priority)));
        state.cacheFlags.sortInfoLoaded = true;
      }
    },
    setCacheFlag(state, { key, value }) {
      state.cacheFlags[key] = value;
    },
    loadCurrentUser(state, user) {
      state.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
    },
    loadSysConfig(state, sysConfig) {
      state.sysConfig = sysConfig;
      localStorage.setItem("sysConfig", JSON.stringify(sysConfig));
    },
    loadCurrentAdmin(state, user) {
      state.currentAdmin = user;
      localStorage.setItem("currentAdmin", JSON.stringify(user));
    },
    loadWebInfo(state, webInfo) {
      // 处理webTitle
      if (typeof webInfo.webTitle === 'string') {
        webInfo.webTitle = webInfo.webTitle.split('');
      }

      // 处理notices - 如果已经是数组就不需要解析
      if (typeof webInfo.notices === 'string') {
        try {
          webInfo.notices = JSON.parse(webInfo.notices);
        } catch (e) {
          webInfo.notices = [webInfo.notices]; // 如果解析失败，包装成数组
        }
      }

      // 处理randomCover - 如果已经是数组就不需要解析
      if (typeof webInfo.randomCover === 'string') {
        try {
          webInfo.randomCover = JSON.parse(webInfo.randomCover);
        } catch (e) {
          webInfo.randomCover = [webInfo.randomCover]; // 如果解析失败，包装成数组
        }
      }

      state.webInfo = webInfo;
      localStorage.setItem("webInfo", JSON.stringify(webInfo));
    }
  },
  actions: {},
  modules: {},
  plugins: []
})
