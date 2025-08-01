<template>
  <div>
    <!-- 登录和注册 -->
    <div v-if="$common.isEmpty(currentUser)" class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image" style="position: absolute" v-once lazy
        :src="require('@/assets/images/login-bg.png')"
        fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="in-up" id="loginAndRegist">
        <div class="form-container sign-up-container">
          <div class="myCenter">
            <h1>注册</h1>
            <input v-model="username" type="text" maxlength="30" placeholder="用户名">
            <input v-model="password" type="password" maxlength="30" placeholder="密码">
            <input v-model="email" type="email" placeholder="邮箱">
            <input v-model="code" type="text" placeholder="验证码" disabled>
            <a style="margin: 0" href="#" @click="changeDialog('邮箱验证码')">获取验证码</a>
            <button @click="regist()">注册</button>
          </div>
        </div>
        <div class="form-container sign-in-container">
          <div class="myCenter">
            <h1>登录</h1>
            <input v-model="account" type="text" placeholder="用户名/邮箱">
            <input v-model="password" type="password" placeholder="密码">
            <a href="#" @click="changeDialog('找回密码')">忘记密码？</a>
            <button @click="login()">登录</button>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel myCenter overlay-left">
              <h1>已有帐号？</h1>
              <p>请登录🚀</p>
              <button class="ghost" @click="signIn()">登录</button>
            </div>
            <div class="overlay-panel myCenter overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册吧😃</p>
              <button class="ghost" @click="signUp()">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image" style="position: absolute" v-once lazy
        :src="$store.state.webInfo.randomCover[Math.floor(Math.random() * $store.state.webInfo.randomCover.length)]"
        fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="shadow-box-mini user-info" style="display: flex">
        <div class="user-left">
          <div>
            <el-avatar class="user-avatar" @click.native="changeDialog('修改头像')" :size="60"
              :src="currentUser.avatar"></el-avatar>
          </div>
          <div class="myCenter" style="margin-top: 12px">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input maxlength="30" v-model="currentUser.username"></el-input>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.phoneNumber)">
                  {{ currentUser.phoneNumber }} <span class="changeInfo" @click="changeDialog('修改手机号')">修改（功能未接入）</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定手机号')">绑定手机号（功能未接入）</span></div>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.email)">
                  {{ currentUser.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentUser.gender">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input v-model="currentUser.introduction" maxlength="60" type="textarea" show-word-limit></el-input>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <proButton :info="'提交'" @click.native="submitUserInfo()" :before="$constant.before_color_2"
              :after="$constant.after_color_2">
            </proButton>
          </div>
        </div>
        <div class="user-right">

        </div>
      </div>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="30%" :before-close="clearDialog"
      :append-to-body="true" :close-on-click-modal="false" center>
      <div class="myCenter" style="flex-direction: column">
        <div>
          <div v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
            <div style="margin-bottom: 5px">手机号：</div>
            <el-input v-model="phoneNumber"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
            <div style="margin-bottom: 5px">邮箱：</div>
            <el-input v-model="email"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="1" :maxNumber="1"></uploadPicture>
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div style="margin-bottom: 5px">用户名/邮箱：</div>
            <el-input v-model="resetAccount" placeholder="请输入您的用户名或邮箱"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
            <el-input type="password" maxlength="30" v-model="resetPassword" placeholder="请输入新密码"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">确认新密码：</div>
            <el-input type="password" maxlength="30" v-model="resetConfirmPassword" placeholder="请再次输入新密码"></el-input>
          </div>
          <div v-else-if="dialogTitle === '邮箱验证码'">
            <div>
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
            </div>
          </div>
        </div>
        <div style="display: flex;margin-top: 30px" v-show="dialogTitle !== '修改头像'">
          <proButton :info="codeString"
            v-show="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号' || dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱' || dialogTitle === '邮箱验证码'"
            @click.native="getCode()" :before="$constant.before_color_1" :after="$constant.after_color_1"
            style="margin-right: 20px">
          </proButton>
          <proButton :info="'提交'" @click.native="submitDialog()" :before="$constant.before_color_2"
            :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const proButton = () => import("./common/proButton");
const uploadPicture = () => import("./common/uploadPicture");

export default {
  components: {
    proButton,
    uploadPicture
  },
  data() {
    return {
      currentUser: this.$store.state.currentUser,
      username: "",
      account: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      email: "",
      avatar: "",
      showDialog: false,
      code: "",
      dialogTitle: "",
      codeString: "验证码",
      passwordFlag: null,
      intervalCode: null,
      // 忘记密码对话框专用字段
      resetAccount: "",
      resetPassword: "",
      resetConfirmPassword: ""
    }
  },
  computed: {},
  created() {

  },
  methods: {
    addPicture(res) {
      this.avatar = res;
      this.submitDialog()
    },
    signUp() {
      document.querySelector("#loginAndRegist").classList.add('right-panel-active');
    },
    signIn() {
      document.querySelector("#loginAndRegist").classList.remove('right-panel-active');
    },
    login() {
      if (this.$common.isEmpty(this.account) || this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入账号或密码！",
          type: "error"
        });
        return;
      }

      // 调用后端登录API，严格按照后端UserLoginDTO格式
      let loginData = {
        account: this.account.trim(),
        password: this.password.trim()
      };

      // 登录请求不需要token，使用原生axios避免自动添加Authorization头
      this.$http.post(this.$constant.baseURL + "/user/login", loginData, false, true)
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            // 保存用户信息到store (后端返回的是UserLoginVO，包含id, username, email, token)
            this.$store.commit("loadCurrentUser", res.data);
            // 保存token
            localStorage.setItem("userToken", res.data.token);
            
            this.$message({
              message: res.message || "登录成功！",
              type: "success"
            });
            
            // 清空表单
            this.account = "";
            this.password = "";
            
            // 跳转到首页
            this.$router.push({ path: '/' });
          } else {
            this.$message({
              message: res.message || "登录失败！",
              type: "error"
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message || "登录失败，请检查网络连接！",
            type: "error"
          });
        });
    },
    regist() {
      if (this.$common.isEmpty(this.username) || this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入用户名或密码！",
          type: "error"
        });
        return;
      }

      if (this.$common.isEmpty(this.email)) {
        this.$message({
          message: "请输入邮箱！",
          type: "error"
        });
        return;
      }

      if (this.$common.isEmpty(this.code)) {
        this.$message({
          message: "请输入验证码！",
          type: "error"
        });
        return;
      }

      if (this.username.indexOf(" ") !== -1 || this.password.indexOf(" ") !== -1) {
        this.$message({
          message: "用户名或密码不能包含空格！",
          type: "error"
        });
        return;
      }

      // 调用后端注册API，严格按照后端UserRegisterDTO格式
      let registerData = {
        username: this.username.trim(),
        password: this.password.trim(),
        email: this.email.trim(),
        code: this.code.trim()
      };

      // 注册请求不需要token
      this.$http.post(this.$constant.baseURL + "/user/register", registerData, false, true)
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            this.$message({
              message: res.message || "注册成功！请使用新账号登录。",
              type: "success"
            });
            
            // 清空表单
            this.username = "";
            this.password = "";
            this.email = "";
            this.code = "";
            
            // 切换到登录页面
            this.signIn();
          } else {
            this.$message({
              message: res.message || "注册失败！",
              type: "error"
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message || "注册失败，请检查网络连接！",
            type: "error"
          });
        });
    },
    submitUserInfo() {
      if (!this.checkParameters()) {
        return;
      }

      let user = {
        username: this.currentUser.username,
        gender: this.currentUser.gender
      };

      if (!this.$common.isEmpty(this.currentUser.introduction)) {
        user.introduction = this.currentUser.introduction.trim();
      }

      this.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.put(this.$constant.baseURL + "/user/update", user)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadCurrentUser", res.data);
              this.currentUser = this.$store.state.currentUser;
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消保存!'
        });
      });
    },
    checkParams(params) {
      if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || (this.dialogTitle === "找回密码" && this.passwordFlag === 1)) {
        params.flag = 1;
        if (this.$common.isEmpty(this.phoneNumber)) {
          this.$message({
            message: "请输入手机号！",
            type: "error"
          });
          return false;
        }
        if (!(/^1[345789]\d{9}$/.test(this.phoneNumber))) {
          this.$message({
            message: "手机号格式有误！",
            type: "error"
          });
          return false;
        }
        params.place = this.phoneNumber;
        return true;
      } else if (this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱" || this.dialogTitle === "邮箱验证码" || (this.dialogTitle === "找回密码" && this.passwordFlag === 2)) {
        params.flag = 2;
        if (this.$common.isEmpty(this.email)) {
          this.$message({
            message: "请输入邮箱！",
            type: "error"
          });
          return false;
        }
        if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.email))) {
          this.$message({
            message: "邮箱格式有误！",
            type: "error"
          });
          return false;
        }
        params.place = this.email;
        return true;
      }
      return false;
    },
    checkParameters() {
      if (this.$common.isEmpty(this.currentUser.username)) {
        this.$message({
          message: "请输入用户名！",
          type: "error"
        });
        return false;
      }

      if (this.currentUser.username.indexOf(" ") !== -1) {
        this.$message({
          message: "用户名不能包含空格！",
          type: "error"
        });
        return false;
      }
      return true;
    },
    changeDialog(value) {
      if (value === "邮箱验证码") {
        if (this.$common.isEmpty(this.email)) {
          this.$message({
            message: "请输入邮箱！",
            type: "error"
          });
          return false;
        }
        if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(this.email))) {
          this.$message({
            message: "邮箱格式有误！",
            type: "error"
          });
          return false;
        }
      }

      this.dialogTitle = value;
      this.showDialog = true;
    },
    submitDialog() {
      if (this.dialogTitle === "修改头像") {
        if (this.$common.isEmpty(this.avatar)) {
          this.$message({
            message: "请上传头像！",
            type: "error"
          });
        } else {
          let user = {
            avatar: this.avatar.trim()
          };

          this.$http.put(this.$constant.baseURL + "/user/update", user)
            .then((res) => {
              if (!this.$common.isEmpty(res.data)) {
                this.$store.commit("loadCurrentUser", res.data);
                this.currentUser = this.$store.state.currentUser;
                this.clearDialog();
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }
      } else if (this.dialogTitle === "修改手机号" || this.dialogTitle === "绑定手机号" || this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱") {
        this.updateSecretInfo();
      } else if (this.dialogTitle === "找回密码") {
        this.resetPassword();
      } else if (this.dialogTitle === "邮箱验证码") {
        this.showDialog = false;
      }
    },
    updateSecretInfo() {
      if (this.$common.isEmpty(this.code)) {
        this.$message({
          message: "请输入验证码！",
          type: "error"
        });
        return;
      }
      if (this.$common.isEmpty(this.password)) {
        this.$message({
          message: "请输入密码！",
          type: "error"
        });
        return;
      }
      let params = {
        code: this.code.trim(),
        password: this.$common.encrypt(this.password.trim())
      };
      if (!this.checkParams(params)) {
        return;
      }

      // 忘记密码功能已经有专门的resetPassword方法处理，这里只处理其他情况
      this.$http.put(this.$constant.baseURL + "/user/update", params, false, true)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.$store.commit("loadCurrentUser", res.data);
            this.currentUser = this.$store.state.currentUser;
            this.clearDialog();
            this.$message({
              message: "修改成功！",
              type: "success"
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    resetPassword() {
      if (this.$common.isEmpty(this.resetAccount)) {
        this.$message({
          message: "请输入用户名或邮箱！",
          type: "error"
        });
        return;
      }

      if (this.$common.isEmpty(this.resetPassword)) {
        this.$message({
          message: "请输入新密码！",
          type: "error"
        });
        return;
      }

      if (this.resetPassword !== this.resetConfirmPassword) {
        this.$message({
          message: "两次输入的密码不一致！",
          type: "error"
        });
        return;
      }

      if (this.resetPassword.indexOf(" ") !== -1) {
        this.$message({
          message: "密码不能包含空格！",
          type: "error"
        });
        return;
      }

      // 忘记密码功能调用后端修改用户信息接口，按照UserDTO格式
      let resetData = {
        account: this.resetAccount.trim(),
        password: this.resetPassword.trim()
      };

      // 调用后端修改用户信息接口进行密码重置，不需要token
      this.$http.put(this.$constant.baseURL + "/user/update", resetData, false, true)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: res.message || "密码重置成功，请使用新密码登录！",
              type: "success"
            });
            this.clearDialog();
            this.signIn();
          } else {
            this.$message({
              message: res.message || "密码重置失败！",
              type: "error"
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message || "密码重置失败，请检查网络连接！",
            type: "error"
          });
        });
    },

    getCode() {
      if (this.codeString === "验证码") {
        let email = "";
        
        // 根据不同的对话框类型获取邮箱
        if (this.dialogTitle === "邮箱验证码" || this.dialogTitle === "找回密码") {
          email = this.email;
        } else {
          // 其他情况的验证码获取逻辑
          let params = {};
          if (!this.checkParams(params)) {
            return;
          }
          email = params.place;
        }

        if (this.$common.isEmpty(email)) {
          this.$message({
            message: "请输入邮箱！",
            type: "error"
          });
          return;
        }

        if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email))) {
          this.$message({
            message: "邮箱格式有误！",
            type: "error"
          });
          return;
        }

        // 调用后端验证码API，严格按照后端接口格式
        this.$http.get(this.$constant.baseURL + "/captcha/sendCaptcha", { email: email }, false)
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message || "验证码已发送，请注意查收！",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message || "验证码发送失败！",
                type: "error"
              });
              return;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message || "验证码发送失败，请检查网络连接！",
              type: "error"
            });
            return;
          });

        // 开始倒计时
        this.codeString = "30";
        this.intervalCode = setInterval(() => {
          if (this.codeString === "0") {
            clearInterval(this.intervalCode)
            this.codeString = "验证码";
          } else {
            this.codeString = (parseInt(this.codeString) - 1) + "";
          }
        }, 1000);
      } else {
        this.$message({
          message: "请稍后再试！",
          type: "warning"
        });
      }
    },
    clearDialog() {
      this.password = "";
      this.confirmPassword = "";
      this.phoneNumber = "";
      this.email = "";
      this.account = "";
      this.avatar = "";
      this.showDialog = false;
      this.code = "";
      this.dialogTitle = "";
      this.passwordFlag = null;
      // 清空忘记密码专用字段
      this.resetAccount = "";
      this.resetPassword = "";
      this.resetConfirmPassword = "";
      // 清除倒计时
      if (this.intervalCode) {
        clearInterval(this.intervalCode);
        this.intervalCode = null;
        this.codeString = "验证码";
      }
    }
  }
}
</script>

<style scoped>
.in-up-container {
  height: 100vh;
  position: relative;
}

.in-up {
  opacity: 0.9;
  border-radius: 10px;
  box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
  position: relative;
  overflow: hidden;
  width: 750px;
  max-width: 100%;
  min-height: 450px;
  margin: 10px;
}

.in-up p {
  font-size: 14px;
  letter-spacing: 1px;
  margin: 20px 0 30px 0;
}

.in-up a {
  color: var(--black);
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.form-container {
  position: absolute;
  height: 100%;
  transition: all 0.5s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
}

.form-container div {
  background: var(--white);
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
}

.form-container input {
  background: var(--maxLightGray);
  border-radius: 2px;
  border: none;
  padding: 12px 15px;
  margin: 10px 0;
  width: 100%;
  outline: none;
}

.in-up button {
  border-radius: 2rem;
  border: none;
  background: var(--lightRed);
  color: var(--white);
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 2px;
  cursor: pointer;
}

.in-up button:hover {
  animation: scale 0.8s ease-in-out;
}

.in-up button.ghost {
  background: transparent;
  border: 1px solid var(--white);
}

.sign-up-container button {
  margin-top: 20px;
}

.overlay-container {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.overlay {
  background: var(--gradualRed);
  color: var(--white);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
}

.overlay-panel {
  position: absolute;
  top: 0;
  flex-direction: column;
  height: 100%;
  width: 50%;
  transition: all 0.5s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.in-up.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.in-up.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.in-up.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
}

.in-up.right-panel-active .overlay {
  transform: translateX(50%);
}

.in-up.right-panel-active .overlay-left {
  transform: translateY(0);
}

.in-up.right-panel-active .overlay-right {
  transform: translateY(20%);
}

.user-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.user-info {
  width: 80%;
  z-index: 10;
  margin-top: 70px;
  height: calc(100vh - 90px);
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.user-left {
  width: 50%;
  background: var(--maxMaxWhiteMask);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
}

.user-right {
  width: 50%;
  background: var(--maxWhiteMask);
  padding: 20px;
}

.user-title {
  text-align: right;
  user-select: none;
}

.user-content {
  text-align: left;
}

.user-title div {
  height: 55px;
  line-height: 55px;
  text-align: center;
}

.user-content>div {
  height: 55px;
  display: flex;
  align-items: center;
}

.user-content>>>.el-input__inner,
.user-content>>>.el-textarea__inner {
  border: none;
  background: var(--whiteMask);
}

.user-content>>>.el-input__count {
  background: var(--transparent);
  user-select: none;
}

.changeInfo {
  color: var(--white);
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--themeBackground);
  padding: 3px;
  border-radius: 0.2rem;
  user-select: none;
}

@media screen and (max-width: 920px) {
  .user-info {
    width: 90%;
  }

  .user-left {
    width: 100%;
  }

  .user-right {
    display: none;
  }
}
</style>
