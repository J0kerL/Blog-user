import axios from "axios";
import constant from "./constant";
//处理url参数
import qs from "qs";

import store from "../store";


axios.defaults.baseURL = "/api";

// 获取有效的用户token
function getValidUserToken() {
  const userTokenData = localStorage.getItem("userToken");
  if (!userTokenData) return null;
  
  try {
    const tokenObj = JSON.parse(userTokenData);
    // 检查token是否过期
    if (tokenObj.expiry && new Date().getTime() > tokenObj.expiry) {
      // token已过期，清除登录状态
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      store.commit("loadCurrentUser", {});
      return null;
    }
    return tokenObj.token;
  } catch (e) {
    // 兼容旧版本的token格式（直接是token字符串）
    return userTokenData;
  }
}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 自动为所有请求添加token（如果存在）
  const userToken = getValidUserToken();
  if (userToken && !config.headers["Authorization"]) {
    config.headers["Authorization"] = userToken;
  }
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data !== null && response.data.hasOwnProperty("code") && response.data.code !== 200) {
    if (response.data.code === 300 || response.data.code === 401) {
      store.commit("loadCurrentUser", {});
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      window.location.href = constant.webURL + "/user";
    }
    return Promise.reject(new Error(response.data.message || "请求失败"));
  } else {
    return response;
  }
}, function (error) {
  // 处理HTTP状态码错误
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 401) {
      store.commit("loadCurrentUser", {});
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      return Promise.reject(new Error("用户未登录或登录已过期"));
    } else if (status === 403) {
      return Promise.reject(new Error("权限不足"));
    } else if (status === 404) {
      return Promise.reject(new Error("请求的资源不存在"));
    } else if (status === 500) {
      return Promise.reject(new Error("服务器内部错误"));
    } else {
      return Promise.reject(new Error(data?.message || `请求失败 (${status})`));
    }
  } else if (error.request) {
    // 网络错误
    return Promise.reject(new Error("网络连接失败，请检查网络"));
  } else {
    // 其他错误
    return Promise.reject(new Error(error.message || "请求失败"));
  }
});

// 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
// 当data为普通对象时，会被设置为application/json;charset=utf-8


export default {
  post(url, params = {}, json = true) {
    let config = { headers: {} };
    
    const userToken = getValidUserToken();
    if (userToken) {
      config.headers["Authorization"] = userToken;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, json ? params : qs.stringify(params), config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  get(url, params = {}) {
    let headers = {};
    
    const userToken = getValidUserToken();
    if (userToken) {
      headers["Authorization"] = userToken;
    }

    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
        headers: headers
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  put(url, params = {}, json = true) {
    let config = { headers: {} };
    
    const userToken = getValidUserToken();
    if (userToken) {
      config.headers["Authorization"] = userToken;
    }

    return new Promise((resolve, reject) => {
      axios
        .put(url, json ? params : qs.stringify(params), config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  delete(url, params = {}) {
    let config = {
      headers: {},
      params: params
    };
    
    const userToken = getValidUserToken();
    if (userToken) {
      config.headers["Authorization"] = userToken;
    }

    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  upload(url, param, option) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };
    
    const userToken = getValidUserToken();
    if (userToken) {
      config.headers["Authorization"] = userToken;
    }
    
    if (typeof option !== "undefined") {
      config.onUploadProgress = progressEvent => {
        if (progressEvent.total > 0) {
          progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
        }
        option.onProgress(progressEvent);
      };
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  uploadQiniu(url, param) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 不带token的请求方法，用于登录、注册等公开接口
  postWithoutToken(url, params = {}, json = true) {
    let config = { headers: {} };

    return new Promise((resolve, reject) => {
      axios
        .post(url, json ? params : qs.stringify(params), config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getWithoutToken(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  putWithoutToken(url, params = {}, json = true) {
    let config = { headers: {} };

    return new Promise((resolve, reject) => {
      axios
        .put(url, json ? params : qs.stringify(params), config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}