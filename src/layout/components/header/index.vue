<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="修改密码"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
  >
    <div class="changePwd-form">
      <n-form
        ref="changePwdForm"
        :model="userInfo"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item path="account">
          <n-input v-model:value="userInfo.account" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="oldPassword" class='formInputCss'>
          <n-input v-model:value="userInfo.oldPassword" type="password" show-password-on="mousedown" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item path="newPassword" class='formInputCss'>
          <n-input v-model:value="userInfo.newPassword" type="password" show-password-on="mousedown" placeholder="请输入新密码" />
        </n-form-item>
        <n-form-item path="newPasswordTwo" class='formInputCss'>
          <n-input v-model:value="userInfo.newPasswordTwo" type="password" show-password-on="mousedown" placeholder="请再次输入新密码" />
        </n-form-item>
      </n-form>
    </div>
  </n-modal>
  <div flex items-center>
    <MenuCollapse />
    <BreadCrumb ml-15 hidden sm:block />
  </div>
  <div ml-auto flex items-center></div>
  <div>
    <!-- 个人中心 -->
    <div class='layout-header-trigger layout-header-trigger-min'>
      <n-dropdown trigger='hover' :options='avatarOptions' @select='avatarSelect'>
        <div class='avatar'>
          <n-avatar round>
            <n-icon size='40'>
              <svg-icon icon='PhUserBold' />
            </n-icon>
          </n-avatar>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import BreadCrumb from './components/BreadCrumb.vue'
import MenuCollapse from './components/MenuCollapse.vue'
import { logout, changePwd } from '@/api/login/login'
import Cookies from 'js-cookie'
import { router } from '../../../router'
import { ref } from 'vue'
import { clearValues } from '@/utils/common/object'

const changePwdForm = ref({})
const userInfo = ref({
  account: null,
  oldPassword: null,
  newPassword: null,
  newPasswordTwo: null
})
const rules = ref({
  account: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
  oldPassword: [{ required: true, message: "原密码不能为空", trigger: 'blur' }],
  newPassword: [{ required: true, message: "新密码不能为空", trigger: 'blur' }],
  newPasswordTwo: [{ required: true, message: "新密码确认不能为空", trigger: 'blur' }]
})
const showModal = ref(false)
const avatarOptions = [
  {
    label: '修改密码',
    key: 1
  },
  {
    label: '退出登录',
    key: 2
  }
]
const onPositiveClick = () => {
  changePwdForm.value?.validate((errors) => {
    if (!errors) {
      if(userInfo.value.oldPassword === userInfo.value.newPassword){
        $message.error("新旧密码不能一致")
        showModal.value = true
      } else if(userInfo.value.newPassword !== userInfo.value.newPasswordTwo){
        $message.error("两次新密码输入不一致")
        showModal.value = true
      } else {
        //执行修改密码请求
        changePwd({
          ...toRaw((unref(userInfo.value)))
        }).then(res => {
          if(res.code === 200){
            $message.success("修改成功，请使用新密码重新登录")
            doLogout()
          }else {
            $message.error(res.message)
          }
        })
      }
    } else {
      showModal.value = true
    }
  })
}
const onNegativeClick = () => {
  userInfo.value = clearValues(userInfo.value)
  showModal.value = false
  $message.success("已取消")
}
//头像下拉菜单
const avatarSelect = (key) => {
  switch (key) {
    case 1:
      showModal.value = true
      break
    case 2:
      doLogout()
      break
  }
}
// 退出登录
const doLogout = () => {
  try {
    logout().then(res => {
      if (res.success) {
        router.push("/login")
      } else {
        $message.error("服务异常")
      }
    })
  } catch (e) {
  }
}
</script>
<style lang='scss' scoped>
.layout-header-trigger {
  display: inline-block;
  width: 64px;
  height: 64px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  .avatar {
    display: flex;
    align-items: center;
    height: 64px;
  }

  .n-icon {
    display: flex;
    align-items: center;
    height: 64px;
    line-height: 64px;
  }

  &:hover {
    background: hsla(0, 0%, 100%, 0.08);
  }

  .anticon {
    font-size: 16px;
    color: #515a6e;
  }

  &:hover {
    background: #f8f8f9;
  }
}

.layout-header-trigger-min {
  width: auto;
  padding: 0 12px;
}
.changePwd-form {
  width: 100%;
  padding: 40px 10px 10px 10px;

  .formInputCss {
    padding-top: 5px;
  }
}
</style>
