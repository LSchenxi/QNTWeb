<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-button type='primary' @click='handleCreateServer'>新增</n-button>
        </div>
        <div flex-row flex-gap-20>
          <n-input v-model:value="listQuery.serverIp" :clearable="true" placeholder="请输入IP地址" />
          <!--          <n-select style="min-width: 200px" v-model:value="listQuery.launchFlag" :options="options" :clearable="true" />-->
          <n-button type='primary' @click='handleRecordTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer'>
        <n-data-table
          remote
          flex-height
          :data='serverTableData'
          :columns='columns'
          :pagination='serverTablePagination'
          :loading='serverTableLoading'
          :style="{ width: '100%', height: `${height}px` }"
          @update:page='handleServerTablePageChange'
          @update:pageSize='handleServerTablePageSizeChange'
        />
      </div>
    </div>
    <n-drawer v-model:show="serverDrawer" :auto-focus="false" :close-on-esc="false" :mask-closable="false" width="50%">
      <n-drawer-content closable>
        <template #header>{{ serverModel.id ? '编辑' : '新建' }}服务器</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type="primary" :loading="serverSaveLoading" @click="saveServer">保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class="cus-scroll">
          <n-spin :show="serverLoading" min-h-120>
            <n-form ref="form" label-placement="top">
              <n-form-item label="IP地址" path="serverIp">
                <n-input v-model:value="serverModel.serverIp" />
              </n-form-item>
              <n-form-item label="操作系统" path="operatingSystem">
                <n-input v-model:value="serverModel.operatingSystem" />
              </n-form-item>
              <n-form-item label="协议" path="protocol">
                <n-input v-model:value="serverModel.protocol" />
              </n-form-item>
              <n-form-item label="版本" path="version">
                <n-input v-model:value="serverModel.version" />
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
import { useWindowResize } from '@/hooks/event/window-resize.js'
import { getPage, createServer, updateServer, getServer, deleteServer } from '../../api/serverControl/serverControl'

const columns = [
  {
    title: 'IP地址',
    key: 'serverIp'
  },
  {
    title: '操作系统',
    key: 'operatingSystem'
  },
  {
    title: '实盘',
    key: 'realOfferNumber'
  },
  {
    title: '协议',
    key: 'protocol'
  },
  {
    title: '版本',
    key: 'version'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '地理位置',
    key: 'position'
  },
  {
    title: '发布时间',
    key: 'releaseTime'
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
                  handleUpdateServer(row)
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
                  handleDeleteServer(row)
                }
              },
              { default: () => '删除' }
            )
          ]
        }
      )
    }
  }
]

const height = ref(200)
const container = ref()
const tableContainer = ref()
const serverTableData = ref([])
const serverTableLoading = ref(false)
const serverTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const listQuery = ref({
  serverIp: null
})
const serverDrawer = ref(false)
const serverModel = ref({
  id:null,
  serverIp: null,
  operatingSystem: null,
  protocol: null,
  version: null
})
const serverLoading = ref(false)
const serverSaveLoading = ref(false)

onMounted(() => {
  //获取列表数据
  searchTable()
  nextTick(() => {
    resetTableHeight()
  })
})

const searchTable = async () => {
  serverTableLoading.value = true
  const { data, message, success } = await getPage({
    page: serverTablePagination.page,
    size: serverTablePagination.pageSize,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    serverTableData.value = records
    serverTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  serverTableLoading.value = false
}

const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 40
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}

useWindowResize(resetTableHeight, 0)

const clearServerModel = () => {
  Object.keys(serverModel.value).forEach((key) => {
    serverModel.value[key] = null
  })
}

// 查询
const handleRecordTableSearch = () => {
  serverTablePagination.page = 1
  searchTable()
}

// 新增 编辑
const saveServer = async () => {
  serverSaveLoading.value = true
  if (!serverModel.value.id) {
    const data = toRaw(serverModel.value)
    const { message, success } = await createServer(data)
    if (success) {
      serverDrawer.value = false
      // 重置表单并且重新加载数据
      clearServerModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  } else {
    const data = toRaw(serverModel.value)
    const { message, success } = await updateServer(data)
    if (success) {
      serverDrawer.value = false
      // 重置表单并且重新加载数据
      clearServerModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  }
  serverSaveLoading.value = false
}

const getServerOne = async (id) => {
  serverLoading.value = true
  const params = {
    id: id
  }
  const { data, message, success } = await getServer(params)
  if (success) {
    serverModel.value = data
  } else {
    window.$message.error(message)
  }
  serverLoading.value = false
}

const handleCreateServer = async () => {
  clearServerModel()
  serverDrawer.value = true
}

const handleUpdateServer = (row) => {
  serverDrawer.value = true
  getServerOne(row.id)
}

const handleDeleteServer = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定删除该条目？',
    confirm: async () => {
      const { message, success } = await deleteServer({
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

const handleServerTablePageChange = (page) => {
  serverTablePagination.page = page
  searchTable()
}

const handleServerTablePageSizeChange = (pageSize) => {
  serverTablePagination.page = 1
  serverTablePagination.pageSize = pageSize
  searchTable()
}


</script>

<style scoped>

</style>
