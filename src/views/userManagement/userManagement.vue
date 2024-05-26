<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-button type='primary' @click='handleCreateUser'>新增</n-button>
        </div>
        <div flex-row flex-gap-20>
          <n-input v-model:value="listQuery.userAccount" :clearable="true" placeholder="请输入用户名" />
          <!--          <n-select style="min-width: 200px" v-model:value="listQuery.launchFlag" :options="options" :clearable="true" />-->
          <n-button type='primary' @click='handleRecordTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer'>
        <n-data-table
          remote
          flex-height
          :data='userTableData'
          :columns='columns'
          :pagination='userTablePagination'
          :loading='userTableLoading'
          :style="{ width: '100%', height: `${height}px` }"
          @update:page='handleUserTablePageChange'
          @update:pageSize='handleUserTablePageSizeChange'
        />
      </div>
    </div>
    <n-drawer v-model:show="userDrawer" :auto-focus="false" :close-on-esc="false" :mask-closable="false" width="50%">
      <n-drawer-content closable>
        <template #header>{{ userModel.id ? '编辑' : '新建' }}用户</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type="primary" :loading="userSaveLoading" @click="saveUser">保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class="cus-scroll">
          <n-spin :show="userLoading" min-h-120>
            <n-form ref="form" label-placement="top">
              <n-form-item label="用户名" path="account">
                <n-input v-model:value="userModel.account" />
              </n-form-item>
              <n-form-item label="用户类型" path="userType">
                <n-select clearable :options="genderOptions" v-model:value="userModel.userType" />
              </n-form-item>
            </n-form>
          </n-spin>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { NButton, NSpace } from 'naive-ui'
import { getPage, createUser, updateUser, getUser, deleteUser, resetUserPwd } from '../../api/userManagement/userManagement'
import { useWindowResize } from '@/hooks/event/window-resize.js'

onMounted(() => {
  //获取列表数据
  searchTable()
  nextTick(() => {
    resetTableHeight()
  })
})
const columns = [
  {
    title: '用户名',
    key: 'account'
  },
  {
    title: '用户类型',
    key: 'userTypeString'
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: async () => {
                  handleUpdateUser(row)
                }
              },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: async () => {
                  handleDeleteUser(row)
                }
              },
              { default: () => '删除' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: async () => {
                  handleResetUserPwd(row)
                }
              },
              { default: () => '初始化密码' }
            )
          ]
        }
      )
    }
  }
]
const genderOptions = [
  {
    value: 0,
    label: '管理员'
  },
  {
    value: 1,
    label: '普通用户'
  }
]
const height = ref(200)
const container = ref()
const tableContainer = ref()
const userTableData = ref([])
const userTableLoading = ref(false)
const userTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const listQuery = ref({
  userAccount: null
})
const userDrawer = ref(false)
const userModel = ref({
  id:null,
  account: null,
  userType: null
})
const userLoading = ref(false)
const userSaveLoading = ref(false)
const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 40
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}
useWindowResize(resetTableHeight, 0)
const clearUserModel = () => {
  Object.keys(userModel.value).forEach((key) => {
    userModel.value[key] = null
  })
}

// 查询
const handleRecordTableSearch = () => {
  userTablePagination.page = 1
  searchTable()
}

// 新增 编辑
const saveUser = async () => {
  userSaveLoading.value = true
  if (!userModel.value.id) {
    // const data = {
    //   userList: [toRaw(userModel.value)]
    // }
    const data = toRaw(userModel.value)
    const { message, success } = await createUser(data)
    if (success) {
      userDrawer.value = false
      // 重置表单并且重新加载数据
      clearUserModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  } else {
    const data = toRaw(userModel.value)
    const { message, success } = await updateUser(data)
    if (success) {
      userDrawer.value = false

      // 重置表单并且重新加载数据
      clearUserModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  }
  userSaveLoading.value = false
}

const searchTable = async () => {
  userTableLoading.value = true
  const { data, message, success } = await getPage({
    page: userTablePagination.page,
    size: userTablePagination.pageSize,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    userTableData.value = records
    userTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  userTableLoading.value = false
}

const getUserOne = async (id) => {
  userLoading.value = true
  const params = {
    id: id
  }
  const { data, message, success } = await getUser(params)
  if (success) {
    userModel.value = data
  } else {
    window.$message.error(message)
  }
  userLoading.value = false
}

const handleCreateUser = async () => {
  clearUserModel()
  userDrawer.value = true
}

const handleUpdateUser = (row) => {
  userDrawer.value = true
  getUserOne(row.id)
}

const handleDeleteUser = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定删除该条目？',
    confirm: async () => {
      const { message, success } = await deleteUser({
        id: row.id
      })
      if (success) {
        window.$message.success('删除成功')
        await searchTable()
      } else {
        window.$message.error('删除失败', message)
      }
    }
  })
}

const handleResetUserPwd = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定初始化该用户密码？',
    confirm: async () => {
      const { message, success } = await resetUserPwd({
        id: row.id
      })
      if (success) {
        window.$message.success('操作成功')
        await searchTable()
      } else {
        window.$message.error('操作失败', message)
      }
    }
  })
}

const handleUserTablePageChange = (page) => {
  userTablePagination.page = page
  searchTable()
}

const handleUserTablePageSizeChange = (pageSize) => {
  userTablePagination.page = 1
  userTablePagination.pageSize = pageSize
  searchTable()
}

</script>

<style lang='scss' scoped>

</style>
