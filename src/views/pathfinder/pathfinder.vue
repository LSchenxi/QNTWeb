<template>
  <div ref='container' flex-row flex-gap-20 wh-full overflow-auto p-20>
    <div flex-col wh-full min-w-1080 p-20 bg-white>
      <div flex-row flex-justify-between pb-20>
        <div flex-row flex-gap-20>
          <n-tabs type="card" v-model:value="currentDetectInfo" name='detectInfoTabs' @update:value="handleSelectDetectInfoTabs">
            <n-tab-pane v-for="detectInfo in detectInfoList" :key="detectInfo.id" :name="detectInfo.id" :tab="detectInfo.dname">
            </n-tab-pane>
          </n-tabs>
        </div>
        <div flex-row flex-gap-20>
          <n-input style='height: 62%' v-model:value="listQuery.symbolName" :clearable="true" placeholder="请输入币种名称" />
          <n-button type='primary' @click='handleDetectTableSearch'>查询</n-button>
        </div>
      </div>
      <div ref='tableContainer' overflow-auto>
        <n-data-table
            remote
            flex-height
            :data='detectTableData'
            :columns='detectColumns'
            :pagination='detectTablePagination'
            :loading='detectTableLoading'
            :style="{ width: '100%', height: `${height}px`}"
            :scroll-x='detectColumnsTotalLength'
            @update:page='handleDetectTablePageChange'
            @update:pageSize='handleDetectTablePageSizeChange'
            style="padding-top: -20px"
        />
      </div>
    </div>
  </div>

</template>

<script setup>
import { useWindowResize } from '@/hooks/event/window-resize.js'
import { ref } from 'vue'
import { getDetectIndexList, getDetectPage, getDetectColumns } from '../../api/pathfinder/pathfinder.js'
onMounted(() => {
  // 获取card数据
  getDetectInfoList()
  nextTick(() => {
    resetTableHeight()
  })
})
const width = ref()
const height = ref(200)
const container = ref()
const tableContainer = ref()
const currentDetectInfo = ref();
const detectInfoList = ref([])
const listQuery = ref({
  symbolName: null
})
const detectColumnsTotalLength = ref()
const detectColumns = ref([])
const detectTableData = ref([])
const detectTablePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  itemCount: 0
})
const detectTableLoading = ref(false)


const resetTableHeight = () => {
  if (!container.value || !tableContainer.value) return
  const padding = 80
  const { top: containerTop } = container.value.getBoundingClientRect()
  const { top: tableContainerTop } = tableContainer.value.getBoundingClientRect()
  height.value = container.value.clientHeight - (tableContainerTop - containerTop) - padding
}
useWindowResize(resetTableHeight, 0)

const getDetectInfoList = async () => {
  const { data, message, success } = await  getDetectIndexList()
  if (success) {
    detectInfoList.value = data
    if(detectInfoList.value.length > 0){
      currentDetectInfo.value = detectInfoList.value[0].id
      // 获取tableColumns数据
      searchDetectColumnsTable()
      // 获取table数据
      searchDetectTable()
    }
  } else {
    window.$message.error('获取数据失败', message)
  }
}
const handleSelectDetectInfoTabs = (value) => {
  currentDetectInfo.value = value
  detectTablePagination.page = 1
  detectTablePagination.pageSize = 10
  searchDetectColumnsTable()
  searchDetectTable()
}

const searchDetectColumnsTable = async () => {
  detectTableLoading.value = true
  const { data, message, success } = await getDetectColumns({
    currentDetectInfo : currentDetectInfo.value,
  })
  if (success) {
    detectColumns.value = data.data
    detectColumnsTotalLength.value = data.totalWidth
  } else {
    window.$message.error(message)
  }
  detectTableLoading.value = false
}

const searchDetectTable = async () => {
  detectTableLoading.value = true
  const { data, message, success } = await getDetectPage({
    page: detectTablePagination.page,
    size: detectTablePagination.pageSize,
    currentDetectInfo : currentDetectInfo.value,
    ...toRaw(listQuery.value)
  })
  if (success) {
    const { total, records } = data
    detectTableData.value = records
    detectTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  detectTableLoading.value = false
}

// 查询
const handleDetectTableSearch = () => {
  detectTablePagination.page = 1
  searchDetectTable()
}


const handleDetectTablePageChange = (page) => {
  detectTablePagination.page = page
  searchDetectTable()
}

const handleDetectTablePageSizeChange = (pageSize) => {
  detectTablePagination.page = 1
  detectTablePagination.pageSize = pageSize
  searchDetectTable()
}

</script>

<style scoped>

</style>
