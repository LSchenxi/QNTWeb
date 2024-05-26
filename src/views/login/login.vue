<template>
  <div class="login-container">
    <div class="e-fox-logo">
      <img src="../../assets/login-logo.png">
      <p class="e-fox-title" >欢迎使用量化交易平台！</p>
    </div>
    <div class="login-form">
      <n-form
        ref="loginForm"
        :model="userInfo"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item path="account">
          <n-input v-model:value="userInfo.account" size="large" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="password" class='formInputCss'>
          <n-input v-model:value="userInfo.password" size="large" type="password" show-password-on="mousedown" placeholder="请输入密码" @keyup.enter="userLogin" />
        </n-form-item>
        <n-form-item class='formInputCss'>
          <n-button class="login-btn" attr-type="button" @click="userLogin" :loading="btnLoading">登录</n-button>
        </n-form-item>
        <n-form-item class="formFooter">
          <span>还没有账户？</span><n-button text class='register'>注册</n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup>
  import { login } from '@/api/login/login'
  import Cookies from 'js-cookie'
  import { ref } from 'vue'
  import { router } from '../../router'
  import { storage } from '@/utils'
  const loginForm = ref({})
  const userInfo = ref({
    account: null,
    password: null
  })
  const rules = ref({
    account: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
    password: [{ required: true, message: "密码不能为空", trigger: 'blur' }]
  })
  const btnLoading = ref(false)
  const userLogin = () => {
    btnLoading.value = true
    loginForm.value?.validate(async (errors) => {
      if (!errors) {
        try {
          await login({
            ...toRaw((unref(userInfo.value)))
          }).then(res => {
            if(res.code === 200){
              storage.set('account', res.data.account)
              storage.set(res.data.account, res.data.roleCode)
              router.push("/")
            }else {
              $message.error(res.message)
            }
          })
          btnLoading.value = false
        }catch (e){
          $message.error("登录请求错误")
          btnLoading.value = false
        }
      }else {
        $message.error("表单校验失败")
        btnLoading.value = false
      }
    })
  }
</script>

<style scoped lang='scss'>
.login-container {
  min-height: 600px;
  max-width: 680px;
  background: #FFFFFF;
  opacity: 1;
  margin: 0 auto;
  position: relative;
  top: 15%;

  .e-fox-logo {
    padding-top: 50px;
    padding-left: 84px;
    height: 131px;

    .e-fox-title {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 41px;
      padding-top: 20px;
      color: #FF731D;
    }
  }

  .login-form {
    width: 100%;
    padding: 85px 84px 50px 84px;

    .formInputCss {
      padding-top: 15px;
    }

    .register {
      color: #FF731D;
    }

    .login-btn {
      width: 514px;
      height: 60px;
      background: #919EFF;
      opacity: 1;
      border-radius: 12px;
      color: #FFFFFF;
      font-size: 23px;
      font-family: Noto Sans S Chinese;
      font-weight: 400;
      line-height: 33px;
      border: none;
    }

    .login-btn:hover {
      background: #D9DCFF;
      color: #697AFF;
    }
    .formFooter{
      margin-top: -20px;
      color: #7e7a7a;
      font-family: PingFang SC;
      display: inline-block;
    }
  }
}
</style>
