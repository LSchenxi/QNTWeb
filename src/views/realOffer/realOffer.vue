<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-button type='primary' @click='handleCreateRealOffer'>新增</n-button>
        </div>
        <div flex-row flex-gap-20>
          <n-input v-model:value='listQuery.name' :clearable='true' placeholder='请输入实盘名称' />
          <!--          <n-select style="min-width: 200px" v-model:value="listQuery.launchFlag" :options="options" :clearable="true" />-->
          <n-button type='primary' @click='handleRecordTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer'>
        <n-data-table
            remote
            flex-height
            :data='realOfferTableData'
            :columns='columns'
            :pagination='realOfferTablePagination'
            :loading='realOfferTableLoading'
            :style="{ width: '100%', height: `${height}px` }"
            @update:page='handleRealOfferTablePageChange'
            @update:pageSize='handleRealOfferTablePageSizeChange'
        />
      </div>
    </div>
    <n-drawer v-model:show='realOfferDrawer' :auto-focus='false' :close-on-esc='false' :mask-closable='false'
              width='50%'>
      <n-drawer-content closable>
        <template #header>{{ realOfferModel.id ? '编辑' : '新建' }}实盘</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type='primary' :loading='realOfferSaveLoading' @click='saveRealOffer'>保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class='cus-scroll'>
          <n-spin :show='realOfferLoading' min-h-120>
            <n-form ref='form' label-placement='top'>
              <n-form-item label='实盘名称' path='name'>
                <n-input v-model:value='realOfferModel.name' />
              </n-form-item>
              <n-form-item label='K线周期' path='kLinePeriod'>
                <n-input-group style='width: 100%'>
                  <n-input-number style='width: 90%' v-model:value='realOfferModel.linePeriod' placeholder='K线周期'
                                  :min='1' />
                  <n-select style='width: 10%' :options='kLineUnitOptions' v-model:value='realOfferModel.lineUnit' />
                </n-input-group>
              </n-form-item>
              <n-form-item label='挂载服务器' path='serverId'>
                <n-select clearable :options='serverOptions' v-model:value='realOfferModel.serverId'
                          placeholder='请选择挂载服务器' />
              </n-form-item>
              <n-form-item label='实盘端口' path='realOfferPort'>
                <n-input v-model:value='realOfferModel.realOfferPort' />
              </n-form-item>
              <n-form-item label='执行策略' path='strategyId'>
                <n-select clearable :options='strategyOptions' v-model:value='realOfferModel.strategyId'
                          placeholder='请选择执行策略' />
              </n-form-item>
              <n-form-item label='实盘程序索引' path='appId'>
                <n-input v-model:value='realOfferModel.appId' />
              </n-form-item>
              <n-form-item label='交易平台' path='exchangeMapList'>
                <n-input-group style='width: 100%'>
                  <n-select style='width: 100%' :options='exchangeOptions' v-model:value='realOfferModel.exchange'
                            placeholder='请选择交易所' @update:value='handleUpdateExchangeListValueOld' />
                  <!--                  <n-select multiple clearable style='width: 70%;padding-left: 10px;padding-right: 10px'-->
                  <!--                            :options='tradingCurrencyOptions' v-model:value='realOfferModel.tradingCurrencyList'-->
                  <!--                            placeholder='请选择交易货币' />-->
                  <n-button @click='addExchangeMap'>
                    <svg-icon icon='MaterialSymbolsAdd' />
                  </n-button>
                </n-input-group>
              </n-form-item>
              <div v-for='(input, index) in inputs' :key='index'>
                <n-input-group style='width: 100%;margin-bottom: 20px'>
                  <n-select style='width: 100%' :options='exchangeOptions' v-model:value='inputs[index].exchange'
                            placeholder='请选择交易所' @update:value='handleUpdateExchangeListValue' />
                  <!--                  <n-select multiple clearable style='width: 70%;padding-left: 10px;padding-right: 10px'-->
                  <!--                            :options='tradingCurrencyOptions' v-model:value='inputs[index].tradingCurrencyList'-->
                  <!--                            placeholder='请选择交易货币' />-->
                  <n-button @click='subExchangeMap(index)'>
                    <svg-icon icon='FluentSubtract12Filled' />
                  </n-button>
                </n-input-group>
              </div>
            </n-form>
          </n-spin>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { NButton, NSpace } from 'naive-ui'
import {
  getPage,
  createRealOffer,
  getRealOffer,
  startRealOffer,
  stopRealOffer,
  deleteRealOffer,
  getServerList,
  getStrategyList,
  getExchangeList
} from '../../api/realOffer/realOffer'
import { useWindowResize } from '@/hooks/event/window-resize.js'
import { router } from '../../router'

onMounted(() => {
  //获取列表数据
  searchTable()
  getServerSelectList()
  getStrategySelectList()
  getExchangeSelectList()
  // getTradingCurrencySelectList()
  nextTick(() => {
    resetTableHeight()
  })
})
const inputs = ref([])
const serverOptions = ref([])
const strategyOptions = ref([])
const exchangeOptions = ref([])
// const tradingCurrencyOptions = ref([])
const kLineUnitOptions = [
  {
    label: '秒',
    value: '秒'
  },
  {
    label: '分钟',
    value: '分钟'
  },
  {
    label: '小时',
    value: '小时'
  },
  {
    label: '天',
    value: '天'
  }
]
const columns = [
  {
    title: '实盘名称',
    key: 'name'
  },
  {
    title: '挂载服务器',
    key: 'serverIp'
  },
  {
    title: '实盘端口',
    key: 'realOfferPort'
  },
  {
    title: '实盘状态',
    key: 'status'
  },
  {
    title: '盈利',
    key: 'profit'
  },
  {
    title: '创建日期',
    key: 'createTime'
  },
  {
    title: '执行策略',
    key: 'strategyName'
  },
  {
    title: '实盘程序索引',
    key: 'appId'
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 280,
    render(row) {
      if (row.status === '运行中') {
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
                        handleCheckRealOffer(row)
                      }
                    },
                    { default: () => '监控' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'primary',
                      onClick: async () => {
                        handleUpdateRealOffer(row)
                      }
                    },
                    { default: () => '参数' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                      onClick: async () => {
                        handleStopRealOffer(row)
                      }
                    },
                    { default: () => '停止' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                      disabled: row.status === '运行中',
                      onClick: async () => {
                        handleDeleteRealOffer(row)
                      }
                    },
                    { default: () => '删除' }
                )
              ]
            }
        )
      } else {
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
                        handleCheckRealOffer(row)
                      }
                    },
                    { default: () => '监控' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'primary',
                      onClick: async () => {
                        handleUpdateRealOffer(row)
                      }
                    },
                    { default: () => '参数' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'success',
                      onClick: async () => {
                        handleStartRealOffer(row)
                      }
                    },
                    { default: () => '启动' }
                ),
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                      disabled: row.status === '运行中',
                      onClick: async () => {
                        handleDeleteRealOffer(row)
                      }
                    },
                    { default: () => '删除' }
                )
              ]
            }
        )
      }
    }
  }
]
const height = ref(200)
const container = ref()
const tableContainer = ref()
const realOfferTableData = ref([])
const realOfferTableLoading = ref(false)
const realOfferTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const listQuery = ref({
  name: null
})
const realOfferDrawer = ref(false)
const realOfferModel = ref({
  id: null,
  name: null,
  serverId: null,
  realOfferPort: null,
  strategyId: null,
  linePeriod: null,
  lineUnit: null,
  appId: null,
  exchange: [],
  // tradingCurrencyList: [],
  exchangeMapList: []
})
const realOfferLoading = ref(false)
const realOfferSaveLoading = ref(false)
const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 40
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}
useWindowResize(resetTableHeight, 0)
const clearRealOfferModel = () => {
  Object.keys(realOfferModel.value).forEach((key) => {
    realOfferModel.value[key] = null
    if (key === 'lineUnit') {
      realOfferModel.value[key] = '小时'
    }
  })
  inputs.value = []
}

// 查询
const handleRecordTableSearch = () => {
  realOfferTablePagination.page = 1
  searchTable()
}

// 新增 编辑
const saveRealOffer = async () => {
  realOfferSaveLoading.value = true
  let temp = [...inputs.value]
  // temp.push({ exchange: realOfferModel.value.exchange, tradingCurrencyList: realOfferModel.value.tradingCurrencyList })
  temp.push({ exchange: realOfferModel.value.exchange })
  realOfferModel.value.exchangeMapList = temp
  if (!realOfferModel.value.id) {
    const data = toRaw(realOfferModel.value)
    const { message, success } = await createRealOffer(data)
    if (success) {
      realOfferDrawer.value = false
      // 重置表单并且重新加载数据
      clearRealOfferModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  } else {
    // const data = toRaw(realOfferModel.value)
    // const { message, success } = await updateRealOffer(data)
    // if (success) {
    //   realOfferDrawer.value = false
    //
    //   // 重置表单并且重新加载数据
    //   clearRealOfferModel()
    //   await searchTable()
    // } else {
    //   window.$message.error(message)
    // }
  }
  realOfferSaveLoading.value = false
}

const searchTable = async () => {
  realOfferTableLoading.value = true
  const { data, message, success } = await getPage({
    page: realOfferTablePagination.page,
    size: realOfferTablePagination.pageSize,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    realOfferTableData.value = records
    realOfferTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  realOfferTableLoading.value = false
}

const getRealOfferOne = async (id) => {
  realOfferLoading.value = true
  const params = {
    id: id
  }
  const { data, message, success } = await getRealOffer(params)
  if (success) {
    realOfferModel.value = data
  } else {
    window.$message.error(message)
  }
  realOfferLoading.value = false
}

const handleCreateRealOffer = async () => {
  clearRealOfferModel()
  realOfferDrawer.value = true
}

const handleCheckRealOffer = (row) => {
  router.push({
    path: 'realOfferDetail',
    query: {
      realOfferId: row.id
    }
  })
}

const handleUpdateRealOffer = (row) => {
  router.push({
    path: 'realOfferUpdateDetail',
    query: {
      realOfferId: row.id
    }
  })
}

const handleStopRealOffer = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定停止该实盘？',
    confirm: async () => {
      const { message, success } = await stopRealOffer({
        id: row.id
      })
      if (success) {
        window.$message.success('停止成功')
        await searchTable()
      } else {
        window.$message.error('停止失败', message)
      }
    }
  })
}

const handleStartRealOffer = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定启动该实盘？',
    confirm: async () => {
      const { message, success } = await startRealOffer({
        id: row.id
      })
      if (success) {
        window.$message.success('启动成功')
        await searchTable()
      } else {
        window.$message.error(message)
      }
    }
  })
}


const handleDeleteRealOffer = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定删除该实盘？',
    confirm: async () => {
      const { message, success } = await deleteRealOffer({
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

const handleRealOfferTablePageChange = (page) => {
  realOfferTablePagination.page = page
  searchTable()
}

const handleRealOfferTablePageSizeChange = (pageSize) => {
  realOfferTablePagination.page = 1
  realOfferTablePagination.pageSize = pageSize
  searchTable()
}

const getServerSelectList = async () => {
  const { data, message, success } = await getServerList()
  if (success) {
    serverOptions.value = data
  } else {
    window.$message.error(message)
  }
}

const getStrategySelectList = async () => {
  const { data, message, success } = await getStrategyList()
  if (success) {
    strategyOptions.value = data
  } else {
    window.$message.error(message)
  }
}

const getExchangeSelectList = async () => {
  const { data, message, success } = await getExchangeList()
  if (success) {
    exchangeOptions.value = data
  } else {
    window.$message.error(message)
  }
}

// const getTradingCurrencySelectList = async () => {
//   const { data, message, success } = await getTradingCurrencyList()
//   if (success) {
//     tradingCurrencyOptions.value = data
//   } else {
//     window.$message.error(message)
//   }
// }

const addExchangeMap = async () => {
  // inputs.value.push({ exchange: [], tradingCurrencyList: [] })
  inputs.value.push({ exchange: [] })
}

const subExchangeMap = async (index) => {
  // if(undefined !== exchangeOptions.value[inputs.value[index].exchange - 1]){
  //   exchangeOptions.value[inputs.value[index].exchange - 1].disabled = false
  // }
  inputs.value.splice(index, 1)
}

const handleUpdateExchangeListValueOld = (value, option) => {
  // console.log(value)
  // console.log(option)
  // console.log(realOfferModel.value.exchange)
  // exchangeOptions.value[value - 1].disabled = true
}

const handleUpdateExchangeListValue = (value, option) => {
  // console.log(value)
  // console.log(option)
  // exchangeOptions.value[value - 1].disabled = true
}

</script>

<style scoped>

</style>
