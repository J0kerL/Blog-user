<template>
  <div>
    <!-- 登录和注册 -->
    <div v-if="$common.isEmpty(currentUser)" class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image" style="position: absolute" v-once lazy
        :src="require('@/assets/images/login-bg.png')" fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="in-up" id="loginAndRegist">
        <div class="form-container sign-up-container">
          <div class="myCenter" @keyup.enter="regist()">
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
          <div class="myCenter" @keyup.enter="login()">
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
              <div>邮箱：</div>
              <div>性别：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input maxlength="30" v-model="currentUser.username"></el-input>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.email)">
                  {{ currentUser.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentUser.sex">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
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
      <div class="myCenter" style="flex-direction: column" @keyup.enter="submitDialog()">
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
            <el-input type="password" maxlength="30" v-model="resetNewPassword" placeholder="请输入新密码"></el-input>
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
      resetNewPassword: "",
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

      // 登录请求不需要token
      this.$http.postWithoutToken(this.$constant.baseURL + "/user/login", loginData, true)
        .then((res) => {
          if (res.code === 200 && !this.$common.isEmpty(res.data)) {
            // 先保存token，因为获取用户详细信息需要token
            // 设置token过期时间为1小时，与后端保持一致
            const tokenExpiry = new Date().getTime() + 3600000; // 1小时后过期
            const tokenData = {
              token: res.data.token,
              expiry: tokenExpiry
            };
            localStorage.setItem("userToken", JSON.stringify(tokenData));

            // 登录成功后，调用获取用户详细信息的接口（使用不带token的方法，因为这是公开接口）
            this.$http.getWithoutToken(this.$constant.baseURL + "/user/" + res.data.username)
              .then((userRes) => {
                if (userRes.code === 200 && !this.$common.isEmpty(userRes.data)) {
                  // 合并登录返回的基本信息和详细用户信息
                  const completeUserInfo = {
                    ...res.data,  // 包含id, username, email, token
                    ...userRes.data  // 包含完整的用户信息（包括avatar等）
                  };

                  // 保存完整用户信息到store和localStorage
                  this.$store.commit("loadCurrentUser", completeUserInfo);
                  // 更新组件的currentUser引用
                  this.currentUser = this.$store.state.currentUser;


                  this.$message({
                    message: res.message || "登录成功！",
                    type: "success"
                  });

                  // 清空表单
                  this.account = "";
                  this.password = "";

                  // 延迟跳转，确保状态更新完成
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.$router.push({ path: '/' });
                    }, 500);
                  });
                } else {
                  // 如果获取用户详细信息失败，至少保存基本登录信息
                  this.$store.commit("loadCurrentUser", res.data);
                  this.currentUser = this.$store.state.currentUser;


                  this.$message({
                    message: "登录成功，但获取用户详细信息失败！",
                    type: "warning"
                  });

                  this.account = "";
                  this.password = "";
                  
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.$router.push({ path: '/' });
                    }, 500);
                  });
                }
              })
              .catch((error) => {
                console.error("获取用户详细信息失败:", error);
                // 如果获取用户详细信息失败，至少保存基本登录信息
                this.$store.commit("loadCurrentUser", res.data);
                this.currentUser = this.$store.state.currentUser;


                this.$message({
                  message: "登录成功，但获取用户详细信息失败！",
                  type: "warning"
                });

                this.account = "";
                this.password = "";
                
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.$router.push({ path: '/' });
                  }, 500);
                });
              });
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
      this.$http.postWithoutToken(this.$constant.baseURL + "/user/register", registerData, true)
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

      // 构建用户更新数据，使用后端期望的字段名
      let user = {
        id: this.currentUser.id,
        username: this.currentUser.username,
        sex: this.currentUser.sex  // 使用sex字段而不是gender
      };

      this.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        // 调用后端用户更新接口
        this.$http.put("/user/update", user)
          .then((res) => {
            if (res.code === 200) {
              // 更新成功后，重新获取用户详细信息
              this.$http.get("/user/" + this.currentUser.username)
                .then((userRes) => {
                  if (userRes.code === 200 && !this.$common.isEmpty(userRes.data)) {
                    // 保存更新后的用户信息到store
                    this.$store.commit("loadCurrentUser", userRes.data);
                    this.currentUser = this.$store.state.currentUser;

                    this.$message({
                      message: "修改成功！",
                      type: "success"
                    });
                  }
                })
                .catch((error) => {
                  this.$message({
                    message: "修改成功，但获取最新用户信息失败！",
                    type: "warning"
                  });
                });
            } else {
              this.$message({
                message: res.message || "修改失败！",
                type: "error"
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message || "修改失败，请检查网络连接！",
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
            id: this.currentUser.id,
            avatar: this.avatar.trim()
          };

          this.$http.put("/user/update", user)
            .then((res) => {
              if (res.code === 200) {
                // 更新成功后，重新获取用户详细信息
                this.$http.get("/user/" + this.currentUser.username)
                  .then((userRes) => {
                    if (userRes.code === 200 && !this.$common.isEmpty(userRes.data)) {
                      // 保存更新后的用户信息到store
                      this.$store.commit("loadCurrentUser", userRes.data);
                      this.currentUser = this.$store.state.currentUser;
                      this.clearDialog();
                      this.$message({
                        message: "修改成功！",
                        type: "success"
                      });
                    }
                  })
                  .catch((error) => {
                    this.clearDialog();
                    this.$message({
                      message: "修改成功，但获取最新用户信息失败！",
                      type: "warning"
                    });
                  });
              } else {
                this.$message({
                  message: res.message || "修改失败！",
                  type: "error"
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: error.message || "修改失败，请检查网络连接！",
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

      // 构建用户更新数据
      let updateData = {
        id: this.currentUser.id,
        code: this.code.trim(),
        password: this.$common.encrypt(this.password.trim())
      };

      // 根据对话框类型设置相应字段
      if (this.dialogTitle === "修改邮箱" || this.dialogTitle === "绑定邮箱") {
        updateData.email = this.email.trim();
      }

      // 调用后端用户更新接口
      this.$http.put("/user/update", updateData)
        .then((res) => {
          if (res.code === 200) {
            // 更新成功后，重新获取用户详细信息
            this.$http.get("/user/" + this.currentUser.username)
              .then((userRes) => {
                if (userRes.code === 200 && !this.$common.isEmpty(userRes.data)) {
                  // 保存更新后的用户信息到store
                  this.$store.commit("loadCurrentUser", userRes.data);
                  this.currentUser = this.$store.state.currentUser;
                  this.clearDialog();
                  this.$message({
                    message: "修改成功！",
                    type: "success"
                  });
                }
              })
              .catch((error) => {
                this.clearDialog();
                this.$message({
                  message: "修改成功，但获取最新用户信息失败！",
                  type: "warning"
                });
              });
          } else {
            this.$message({
              message: res.message || "修改失败！",
              type: "error"
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message || "修改失败，请检查网络连接！",
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

      if (this.$common.isEmpty(this.resetNewPassword)) {
        this.$message({
          message: "请输入新密码！",
          type: "error"
        });
        return;
      }

      if (this.resetNewPassword !== this.resetConfirmPassword) {
        this.$message({
          message: "两次输入的密码不一致！",
          type: "error"
        });
        return;
      }

      if (this.resetNewPassword.indexOf(" ") !== -1) {
        this.$message({
          message: "密码不能包含空格！",
          type: "error"
        });
        return;
      }

      // 调用后端忘记密码接口，严格按照后端ForgetPasswordDTO格式
      let forgetPasswordData = {
        account: this.resetAccount.trim(),
        newPassword: this.resetNewPassword.trim(),
        confirmPassword: this.resetConfirmPassword.trim()
      };

      // 忘记密码请求不需要token
      this.$http.putWithoutToken(this.$constant.baseURL + "/user/forgetPassword", forgetPasswordData, true)
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
        this.$http.getWithoutToken("/captcha/sendCaptcha", { email: email })
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message || "验证码已发送，请注意查收！",
                type: "success"
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
                message: res.message || "验证码发送失败！",
                type: "error"
              });
              return;
            }
          })
          .catch((error) => {
            // 处理不同类型的错误
            let errorMessage = "验证码发送失败！";
            if (error.message && error.message.includes("non-existent account")) {
              errorMessage = "邮箱地址不存在，请检查邮箱地址是否正确！";
            } else if (error.message && error.message.includes("network")) {
              errorMessage = "网络连接失败，请检查网络连接！";
            } else if (error.message) {
              errorMessage = error.message;
            }

            this.$message({
              message: errorMessage,
              type: "error"
            });
            return;
          });
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
      this.resetNewPassword = "";
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
