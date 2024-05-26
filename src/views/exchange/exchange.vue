<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-button type='primary' @click='handleCreateExchange'>新增</n-button>
        </div>
        <div flex-row flex-gap-20>
          <n-input v-model:value="listQuery.name" :clearable="true" placeholder="请输入交易所名称" />
          <!--          <n-select style="min-width: 200px" v-model:value="listQuery.launchFlag" :options="options" :clearable="true" />-->
          <n-button type='primary' @click='handleRecordTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer'>
        <n-data-table
          remote
          flex-height
          :data='exchangeTableData'
          :columns='columns'
          :pagination='exchangeTablePagination'
          :loading='exchangeTableLoading'
          :style="{ width: '100%', height: `${height}px` }"
          @update:page='handleExchangeTablePageChange'
          @update:pageSize='handleExchangeTablePageSizeChange'
        />
      </div>
    </div>
    <n-drawer v-model:show="exchangeDrawer" :auto-focus="false" :close-on-esc="false" :mask-closable="false" width="50%">
      <n-drawer-content closable>
        <template #header>{{ exchangeModel.id ? '编辑' : '新建' }}交易所</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type="primary" :loading="exchangeSaveLoading" @click="saveExchange">保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class="cus-scroll">
          <n-spin :show="exchangeLoading" min-h-120>
            <n-form ref="form" label-placement="top">
              <n-form-item label="协议类型" path="protocolId">
                <n-select clearable :disabled="!enableUpdate" :options="protocolCurrencyOptions" v-model:value="exchangeModel.protocolId" />
              </n-form-item>
              <n-form-item label="交易所" path="exchangeId">
                <n-select clearable :disabled="!enableUpdate" :options="protocolCurrencyTypeOptions" v-model:value="exchangeModel.exchangeId" @update:value='handleSelectExchange'/>
              </n-form-item>
              <n-form-item label="Access Key" path="accessKey">
                <n-input v-model:value="exchangeModel.accessKey" />
              </n-form-item>
              <n-form-item label="Secret Key" path="secretKey">
                <n-input v-model:value="exchangeModel.secretKey" type="password" />
              </n-form-item>
              <n-form-item v-if='passphraseShowFlag' label="Passphrase" path="passphrase">
                <n-input v-model:value="exchangeModel.passphrase" type="password" />
              </n-form-item>
              <n-form-item v-if='v5FlagShowFlag' label="v5协议" path="v5FlagBoolean">
                <n-switch v-model:value="v5FlagBoolean" />
              </n-form-item>
              <n-form-item v-if='v3FlagShowFlag' label="v3协议" path="v3FlagBoolean">
                <n-switch v-model:value="v3FlagBoolean" />
              </n-form-item>
              <n-form-item v-if='versionShowFlag' label="version" path="version">
                <n-input v-model:value="exchangeModel.version" />
              </n-form-item>
              <n-form-item v-if='passwordShowFlag' label="password" path="password">
                <n-input v-model:value="exchangeModel.password" type="password" />
              </n-form-item>
              <n-form-item v-if='memoShowFlag' label="Memo" path="passphrase">
                <n-input v-model:value="exchangeModel.passphrase" />
              </n-form-item>
              <n-form-item label="交易所标签" path="exchangeLabel">
                <n-input v-model:value="exchangeModel.exchangeLabel" />
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
import { getPage, createExchangeDetail, updateExchangeDetail, getExchangeDetail, deleteExchange, getProtocol, getExchange } from '../../api/exchange/exchange'
import { useWindowResize } from '@/hooks/event/window-resize.js'
onMounted(() => {
  //获取列表数据
  searchTable()
  getProtocolList()
  getExchangeList()
  nextTick(() => {
    resetTableHeight()
  })
})
const protocolCurrencyOptions = ref([])
const protocolCurrencyTypeOptions = ref([])
const columns = [
  {
    title: '名称',
    key: 'exchangeLabel'
  },
  {
    title: 'API Name',
    key: 'exchangeName'
  },
  {
    title: '交易所名称',
    key: 'exchangeName'
  },
  {
    title: '更新日期',
    key: 'updateTime'
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
                  handleUpdateExchange(row)
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
                  handleDeleteExchange(row)
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
const exchangeTableData = ref([])
const exchangeTableLoading = ref(false)
const v5FlagBoolean = ref(true)
const v3FlagBoolean = ref(true)
const exchangeTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const listQuery = ref({
  name: null
})
const exchangeDrawer = ref(false)
const exchangeModel = ref({
  id:null,
  exchangeLabel: null,
  protocolId: null,
  exchangeId: null,
  accessKey: null,
  secretKey: null,
  passphrase: null,
  v5Flag: null,
  v3Flag: null,
  version: null,
  password: null
})
const exchangeLoading = ref(false)
const exchangeSaveLoading = ref(false)

const v5FlagShowFlag = ref(false)
const versionShowFlag = ref(false)
const passphraseShowFlag = ref(false)
const v3FlagShowFlag = ref(false)
const passwordShowFlag = ref(false)
const memoShowFlag = ref(false)

const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 40
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}
useWindowResize(resetTableHeight, 0)
const clearExchangeModel = () => {
  Object.keys(exchangeModel.value).forEach((key) => {
    exchangeModel.value[key] = null
  })
}

// 查询
const handleRecordTableSearch = () => {
  exchangeTablePagination.page = 1
  searchTable()
}

// 新增 编辑
const saveExchange = async () => {
  exchangeSaveLoading.value = true
  if(v5FlagBoolean.value){
    exchangeModel.value.v5Flag = 1
  }else {
    exchangeModel.value.v5Flag = 0
  }
  if(v3FlagBoolean.value){
    exchangeModel.value.v3Flag = 1
  }else {
    exchangeModel.value.v3Flag = 0
  }
  if (!exchangeModel.value.id) {
    const data = toRaw(exchangeModel.value)
    const { message, success } = await createExchangeDetail(data)
    if (success) {
      exchangeDrawer.value = false
      // 重置表单并且重新加载数据
      clearExchangeModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  } else {
    const data = toRaw(exchangeModel.value)
    const { message, success } = await updateExchangeDetail(data)
    if (success) {
      exchangeDrawer.value = false

      // 重置表单并且重新加载数据
      clearExchangeModel()
      await searchTable()
    } else {
      window.$message.error(message)
    }
  }
  exchangeSaveLoading.value = false
}

const searchTable = async () => {
  exchangeTableLoading.value = true
  const { data, message, success } = await getPage({
    page: exchangeTablePagination.page,
    size: exchangeTablePagination.pageSize,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    exchangeTableData.value = records
    exchangeTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  exchangeTableLoading.value = false
}

const getExchangeOne = async (id) => {
  exchangeLoading.value = true
  const params = {
    id: id
  }
  const { data, message, success } = await getExchangeDetail(params)
  if (success) {
    exchangeModel.value = data
    if(data.v5Flag === 1){
      v5FlagBoolean.value = true
    }else {
      v5FlagBoolean.value = false
    }
    if(data.v3Flag === 1){
      v3FlagBoolean.value = true
    }else {
      v3FlagBoolean.value = false
    }
    if(data.exchangeId === 1){
      v5FlagShowFlag.value = true
      passphraseShowFlag.value = true
    } else if(data.exchangeId === 2){
      versionShowFlag.value = true
    } else if(data.exchangeId === 4){
      passphraseShowFlag.value = true
    } else if(data.exchangeId === 5){
      v3FlagShowFlag.value = true
    } else if(data.exchangeId === 6){
      passwordShowFlag.value = true
    } else if(data.exchangeId === 7){
      passphraseShowFlag.value = true
    } else if(data.exchangeId === 9){
      memoShowFlag.value = true
    }
  } else {
    window.$message.error(message)
  }
  exchangeLoading.value = false
}

const handleCreateExchange = async () => {
  clearExchangeModel()
  v5FlagShowFlag.value = false
  versionShowFlag.value = false
  passphraseShowFlag.value = false
  v3FlagShowFlag.value = false
  passwordShowFlag.value = false
  memoShowFlag.value = false
  exchangeDrawer.value = true
}

const handleUpdateExchange = (row) => {
  clearExchangeModel()
  exchangeDrawer.value = true
  v5FlagShowFlag.value = false
  versionShowFlag.value = false
  passphraseShowFlag.value = false
  v3FlagShowFlag.value = false
  passwordShowFlag.value = false
  memoShowFlag.value = false
  getExchangeOne(row.id)
}

const handleDeleteExchange = (row) => {
  window.$dialog.confirm({
    title: '提示',
    content: '确定删除该条目？',
    confirm: async () => {
      const { message, success } = await deleteExchange({
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

const handleExchangeTablePageChange = (page) => {
  exchangeTablePagination.page = page
  searchTable()
}

const handleExchangeTablePageSizeChange = (pageSize) => {
  exchangeTablePagination.page = 1
  exchangeTablePagination.pageSize = pageSize
  searchTable()
}

const getProtocolList = async () => {
  const { data, message, success } = await getProtocol()
  if (success) {
    protocolCurrencyOptions.value = data
  } else {
    window.$message.error(message)
  }
}

const getExchangeList = async () => {
  const { data, message, success } = await getExchange()
  if (success) {
    protocolCurrencyTypeOptions.value = data
  } else {
    window.$message.error(message)
  }
}

const handleSelectExchange = (value, option) => {
  v5FlagShowFlag.value = false
  versionShowFlag.value = false
  passphraseShowFlag.value = false
  v3FlagShowFlag.value = false
  passwordShowFlag.value = false
  if(value === 1){
    v5FlagShowFlag.value = true
    passphraseShowFlag.value = true
  } else if(value === 2){
    versionShowFlag.value = true
  } else if(value === 4){
    passphraseShowFlag.value = true
  } else if(value === 5){
    v3FlagShowFlag.value = true
  } else if(value === 6){
    passwordShowFlag.value = true
  } else if(value === 7){
    passphraseShowFlag.value = true
  } else if(value === 9){
    memoShowFlag.value = true
  }
}

const enableUpdate = computed(() => {
  if (!exchangeModel.value.id) {
    return true
  }
  return false
})

</script>

<style scoped>

</style>
