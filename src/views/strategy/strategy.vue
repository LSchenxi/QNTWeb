<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-button type='primary' @click='handleCreateStrategy'>新增</n-button>
        </div>
        <div flex-row flex-gap-20>
          <n-input v-model:value="listQuery.name" :clearable="true" placeholder="请输入策略名称" />
          <!--          <n-select style="min-width: 200px" v-model:value="listQuery.launchFlag" :options="options" :clearable="true" />-->
          <n-button type='primary' @click='handleRecordTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer'>
        <n-data-table
          remote
          flex-height
          :data='strategyTableData'
          :columns='columns'
          :pagination='strategyTablePagination'
          :loading='strategyTableLoading'
          :style="{ width: '100%', height: `${height}px` }"
          @update:page='handleStrategyTablePageChange'
          @update:pageSize='handleStrategyTablePageSizeChange'
        />
      </div>
    </div>
    <n-drawer v-model:show="strategyDrawer" :auto-focus="false" :close-on-esc="false" :mask-closable="false" width="50%">
      <n-drawer-content closable>
        <template #header>{{ strategyModel.id ? '编辑' : '新建' }}策略</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type="primary" :loading="strategySaveLoading" @click="saveStrategy">保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class="cus-scroll">
          <n-spin :show="strategyLoading" min-h-120>
            <n-form ref="form" label-placement="top">
              <n-form-item label="策略名称" path="name">
                <n-input v-model:value="strategyModel.name" />
              </n-form-item>
              <n-form-item label="到期时间" path="expirationTime">
                <n-date-picker v-model:value="strategyModel.expirationTime" type="datetime" clearable style='width: 100%'/>
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
import { getPage, createStrategy, updateStrategy, getStrategy, deleteStrategy } from '../../api/strategy/strategy'
import { useWindowResize } from '@/hooks/event/window-resize.js'

const columns = [
  {
    title: '策略名称',
    key: 'name'
  },
  {
    title: '到期时间',
    key: 'expirationTimeStr'
  },
  {
    title: '创建时间',
    key: 'createTimeStr'
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
                  handleUpdateStrategy(row)
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
                  handleDeleteStrategy(row)
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
const strategyTableData = ref([])
const strategyTableLoading = ref(false)
const strategyTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const listQuery = ref({
  name: null
})
const strategyDrawer = ref(false)
const strategyModel = ref({
  id:null,
  name: null,
  expirationTime: null
})
const strategyLoading = ref(false)
const strategySaveLoading = ref(false)

onMounted(() => {
  //获取列表数据
  searchTable()
  nextTick(() => {
    resetTableHeight()
  })
})

const searchTable = async () => {
  strategyTableLoading.value = true
  const { data, message, success } = await getPage({
    page: strategyTablePagination.page,
    size: strategyTablePagination.pageSize,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    strategyTableData.value = records
    strategyTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  strategyTableLoading.value = false
}

const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 40
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}

useWindowResize(resetTableHeight, 0)

const clearStrategyModel = () => {
  Object.keys(strategyModel.value).forEach((key) => {
    strategyModel.value[key] = null
  })
}

// 查询
const handleRecordTableSearch = () => {
  strategyTablePagination.page = 1
  searchTable()
}

// 新增 编辑
const saveStrategy = async () => {
  strategySaveLoading.value = true
  if (!strategyModel.value.id) {
    const data = toRaw(strategyModel.value)
    const { message, success } = await createStrategy(data)
    if (success) {
      strategyDrawer.value = false
      // 重置表单并且重新加载数据
      clearStrategyModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  } else {
    const data = toRaw(strategyModel.value)
    const { message, success } = await updateStrategy(data)
    if (success) {
      strategyDrawer.value = false
      // 重置表单并且重新加载数据
      clearStrategyModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  }
  strategySaveLoading.value = false
}

const getStrategyOne = async (id) => {
  strategyLoading.value = true
  const params = {
    id: id
  }
  const { data, message, success } = await getStrategy(params)
  if (success) {
    data.expirationTime = new Date(data.expirationTime)
    strategyModel.value = data
  } else {
    window.$message.error(message)
  }
  strategyLoading.value = false
}

const handleCreateStrategy = async () => {
  clearStrategyModel()
  strategyDrawer.value = true
}

const handleUpdateStrategy = (row) => {
  strategyDrawer.value = true
  getStrategyOne(row.id)
}

const handleDeleteStrategy = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定删除该条目？',
    confirm: async () => {
      const { message, success } = await deleteStrategy({
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

const handleStrategyTablePageChange = (page) => {
  strategyTablePagination.page = page
  searchTable()
}

const handleStrategyTablePageSizeChange = (pageSize) => {
  strategyTablePagination.page = 1
  strategyTablePagination.pageSize = pageSize
  searchTable()
}

</script>

<style scoped>

</style>
