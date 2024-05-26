<template>
  <div ref='container' overflow-auto style='height: 100%'>
    <div>
      <n-grid x-gap='2' :cols='2'>
        <n-gi :span='1' flex-gap-20 pl-20 pt-20 pr-20>
          <n-space align="baseline" style='display: flex;background-color: white'>
            <span style='margin-left: 20px'>zoom</span>
            <n-button size='tiny' @click='handleStrategyProfitOneHourSelect'>1h</n-button>
            <n-button size='tiny' @click='handleStrategyProfitThreeHourSelect'>3h</n-button>
            <n-button size='tiny' @click='handleStrategyProfitEightHourSelect'>8h</n-button>
            <n-button size='tiny' @click='handleStrategyProfitTwelveHourSelect'>12h</n-button>
            <n-button size='tiny' @click='handleStrategyProfitOneDaySelect'>24h</n-button>
            <n-button size='tiny' @click='handleStrategyProfitAllSelect'>All</n-button>
          </n-space>
          <v-chart style='height: 400px' class="chart" autoresize :option="strategyProfitOption" @datazoom="handleStrategyProfitDataZoom"/>
        </n-gi>
        <n-gi :span='1' flex-gap-20 pt-20 pr-20>
          <n-space align="baseline" style='display: flex;background-color: white'>
            <span style='margin-left: 20px'>zoom</span>
            <n-button size='tiny' @click='handleAccountProfitOneHourSelect'>1h</n-button>
            <n-button size='tiny' @click='handleAccountProfitThreeHourSelect'>3h</n-button>
            <n-button size='tiny' @click='handleAccountProfitEightHourSelect'>8h</n-button>
            <n-button size='tiny' @click='handleAccountProfitTwelveHourSelect'>12h</n-button>
            <n-button size='tiny' @click='handleAccountProfitOneDaySelect'>24h</n-button>
            <n-button size='tiny' @click='handleAccountProfitAllSelect'>All</n-button>
          </n-space>
          <v-chart style='height: 400px' class="chart" autoresize :option="accountProfitOption" @datazoom="handleAccountProfitDataZoom"/>
        </n-gi>
      </n-grid>
    </div>
    <div>
      <n-grid x-gap='2' :cols='2'>
        <n-gi :span='1' flex-gap-20 pl-20 pt-20 pr-20>
          <div bg-white style='text-align: center;font-size: 18px;font-weight: 700'>
            各实盘资产汇总曲线
            <n-tabs type="card" v-model:value="realOfferId" name='realOfferStrategyTabs' @update:value="handleSelectStrategyTabs">
              <n-tab-pane v-for="realOffer in realOfferList" :key="realOffer.id" :name="realOffer.id" :tab="realOffer.name">
                <v-chart style='height: 400px' class="chart" autoresize :option="strategyChartOption"/>
              </n-tab-pane>
            </n-tabs>
          </div>
        </n-gi>
        <n-gi :span='1' flex-gap-20 pt-20 pr-20>
          <div bg-white style='text-align: center;font-size: 18px;font-weight: 700'>
            各实盘账户盈利曲线
            <n-tabs type="card" v-model:value="realOfferId2" name='realOfferRevenueTabs' @update:value="handleSelectRevenueTabs">
              <n-tab-pane v-for="realOffer in realOfferList" :key="realOffer.id" :name="realOffer.id" :tab="realOffer.name">
                <v-chart style='height: 400px' class="chart" autoresize :option="revenueChartOption"/>
              </n-tab-pane>
            </n-tabs>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, DataZoomComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import VChart from "vue-echarts";
import { ref } from "vue";
use([GridComponent, DataZoomComponent, TooltipComponent, LineChart, CanvasRenderer, TitleComponent])
import { getRealOfferList, getAccountProfitChartData, getAccountStrategyChartData } from '../../api/dataOverview/dataOverview'
import { getRealOfferRevenueChartData, getRealOfferStrategyChartData } from '../../api/realOfferDetail/realOfferDetail'
onMounted(() => {
  getRealOfferInfoList()
  initAccountStrategyChartData()
  getAccountStrategyChartDataInterval = setInterval(initAccountStrategyChartData, 1000*20)
  initAccountProfitChartData()
  getAccountProfitChartDataInterval = setInterval(initAccountProfitChartData, 1000*20)
  setTimeout(()=>{
    getRealOfferRevenueChartDataInterval = setInterval(() => {
      initRevenueChartData(true);
    }, 1000*20)
  }, 1000*20)
  setTimeout(()=>{
    getRealOfferStrategyChartDataInterval = setInterval(() => {
      initStrategyChartData(true);
    }, 1000*20)
  }, 1000*20)
})
onUnmounted(() => {
  clearInterval(getRealOfferRevenueChartDataInterval);
  clearInterval(getAccountProfitChartDataInterval);
  clearInterval(getAccountStrategyChartDataInterval);
});

const realOfferList = ref([])
const realOfferId = ref();
const realOfferId2 = ref();

let getAccountStrategyChartDataInterval = null;
let strategyProfitChartData = ref([])
const strategyProfitOption = ref({
  title: {
    text: '总体资产汇总曲线',
    left: 'center'
  },
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      var result = '时间：' + params[0].axisValueLabel + '<br/>'
      result += '累计收益：' + params[0].data.value[1] + '<br/>'
      return result;
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      show: true,
      filterMode: 'filter',
      realtime: true
    }
  ],
  series: [
    {
      data: [],
      symbol: 'none',
      type: 'line',
      smooth: true,
      clip: true
    }
  ]
})

let getAccountProfitChartDataInterval = null;
let accountProfitChartData = ref([])
const accountProfitOption = ref({
  title: {
    text: '总体账户盈利曲线',
    left: 'center'
  },
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      var result = '时间：' + params[0].axisValueLabel + '<br/>'
      result += '累计收益：' + params[0].data.value[1] + '<br/>'
      return result;
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      show: true,
      filterMode: 'filter',
      realtime: true
    }
  ],
  series: [
    {
      data: [],
      symbol: 'none',
      type: 'line',
      smooth: true,
      clip: true
    }
  ]
})

let getRealOfferStrategyChartDataInterval = null;
let strategyChartData = ref([])
const strategyChartOption = ref({
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      var result = '时间：' + params[0].axisValueLabel + '<br/>'
      result += '累计收益：' + params[0].data.value[1] + '<br/>'
      return result
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      show: true,
      filterMode: 'filter',
      realtime: true
    },
    {
      type: 'slider',
      show: false,
      yAxisIndex: 0,
      filterMode: 'filter',
      height: '70%',
      handleSize: 8,
      left: '93%'
    }
  ],
  series: [
    {
      data: [],
      symbol: 'none',
      type: 'line',
      smooth: true,
      clip: true,
      itemStyle: {
        color: 'rgb(127,193,239)'
      }
    }
  ]
})

let getRealOfferRevenueChartDataInterval = null;
let revenueChartData = ref([])
const revenueChartOption = ref({
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      var result = '时间：' + params[0].axisValueLabel + '<br/>'
      result += '累计收益：' + params[0].data.value[1] + '<br/>'
      return result
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      show: true,
      filterMode: 'filter',
      realtime: true
    },
    {
      type: 'slider',
      show: false,
      yAxisIndex: 0,
      filterMode: 'filter',
      height: '70%',
      handleSize: 8,
      left: '93%'
    }
  ],
  series: [
    {
      data: [],
      symbol: 'none',
      type: 'line',
      smooth: true,
      clip: true,
      itemStyle: {
        color: 'rgb(127,193,239)'
      }
    }
  ]
})

let value = Math.random() * 1000;
let second = 1
const firstData = []



const initAccountProfitChartData = async () => {
  let currentTime = null;
  if(accountProfitOption.value.series[0].data.length>0){
    currentTime = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  }else {
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    currentTime: currentTime
  }
  const { data, message, success } = await getAccountProfitChartData(params)
  if (success) {
    accountProfitChartData = data
  } else {
    window.$message.error(message)
  }
  if(accountProfitOption.value.series[0].data.length>0){
    accountProfitOption.value.series[0].data = [...accountProfitOption.value.series[0].data, ...accountProfitChartData]
    let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
    accountProfitOption.value.dataZoom[0].endValue = nowDStr
  }else {
    accountProfitOption.value.series[0].data = accountProfitChartData
  }
}

const initRevenueChartData = async (flag) => {
  let currentTime = null;
  if(revenueChartOption.value.series[0].data.length>0){
    currentTime = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  }else {
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  if(!flag){
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    id: realOfferId2.value,
    currentTime: currentTime
  }
  if(realOfferId2.value !== "" && realOfferId2.value !== undefined && realOfferId2.value !== 'undefined' && realOfferId2.value !== null){
    const { data, message, success } = await getRealOfferRevenueChartData(params)
    if (success) {
      revenueChartData = data
    } else {
      window.$message.error(message)
    }
    if(!flag){
      revenueChartOption.value.series[0].data = revenueChartData
    } else {
      if(revenueChartOption.value.series[0].data.length>0){
        revenueChartOption.value.series[0].data = [...revenueChartOption.value.series[0].data, ...revenueChartData]
      }else {
        revenueChartOption.value.series[0].data = revenueChartData
      }
    }
  }
}

const handleSelectRevenueTabs = (value) => {
  initRevenueChartData(false)
}

const initAccountStrategyChartData = async () => {
  let currentTime = null;
  if(strategyProfitOption.value.series[0].data.length>0){
    currentTime = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  }else {
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    currentTime: currentTime
  }
  const { data, message, success } = await getAccountStrategyChartData(params)
  if (success) {
    strategyProfitChartData = data
  } else {
    window.$message.error(message)
  }
  if(strategyProfitOption.value.series[0].data.length>0){
    strategyProfitOption.value.series[0].data = [...strategyProfitOption.value.series[0].data, ...strategyProfitChartData]
    let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
    strategyProfitOption.value.dataZoom[0].endValue = nowDStr
  }else {
    strategyProfitOption.value.series[0].data = strategyProfitChartData
  }
}

const initStrategyChartData = async (flag) => {
  let currentTime = null;
  if(strategyChartOption.value.series[0].data.length>0){
    currentTime = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  }else {
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  if(!flag){
    let initDate = new Date("2000-01-01 00:00:00")
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    id: realOfferId.value,
    currentTime: currentTime
  }
  if(realOfferId.value !== "" && realOfferId.value !== undefined && realOfferId.value !== 'undefined' && realOfferId.value !== null){
    const { data, message, success } = await getRealOfferStrategyChartData(params)
    if (success) {
      strategyChartData = data
    } else {
      window.$message.error(message)
    }
    if(!flag){
      strategyChartOption.value.series[0].data = strategyChartData
    } else {
      if(strategyChartOption.value.series[0].data.length>0){
        strategyChartOption.value.series[0].data = [...strategyChartOption.value.series[0].data, ...strategyChartData]
      }else {
        strategyChartOption.value.series[0].data = strategyChartData
      }
    }
  }
}

const handleSelectStrategyTabs = (value) => {
  initStrategyChartData(false)
}


const getRealOfferInfoList = async () => {
  const { data, message, success } = await  getRealOfferList()
  if (success) {
    realOfferList.value = data
    if(realOfferList.value.length > 0){
      realOfferId.value = realOfferList.value[0].id
      realOfferId2.value = realOfferList.value[0].id
      initRevenueChartData(true)
      initStrategyChartData(true)
    }
  } else {
    window.$message.error('获取数据失败', message)
  }
}

const initData = () => {
  for (var i = 1; i < 100; i++) {
    firstData.push(randomData());
  }
  strategyProfitOption.value.series[0].data = firstData
}
const randomData = () => {
  let addSecond = Math.floor(Math.random()*2)+1
  second = second + addSecond
  let now = new Date(2024, 4, 11,10,45, second);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth(), now.getDate()].join('-') + " " +[now.getHours(), now.getMinutes(),now.getSeconds()].join(':'),
      Math.round(value)
    ]
  }
}
const handleAccountProfitOneHourSelect = async () => {
  let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60)
  delete accountProfitOption.value.dataZoom[0].start
  delete accountProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  accountProfitOption.value.dataZoom[0].startValue = startD
  accountProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleAccountProfitThreeHourSelect = async () => {
  let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*3)
  delete accountProfitOption.value.dataZoom[0].start
  delete accountProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  accountProfitOption.value.dataZoom[0].startValue = startD
  accountProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleAccountProfitEightHourSelect = async () => {
  let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*8)
  delete accountProfitOption.value.dataZoom[0].start
  delete accountProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  accountProfitOption.value.dataZoom[0].startValue = startD
  accountProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleAccountProfitTwelveHourSelect = async () => {
  let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*12)
  delete accountProfitOption.value.dataZoom[0].start
  delete accountProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  accountProfitOption.value.dataZoom[0].startValue = startD
  accountProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleAccountProfitOneDaySelect = async () => {
  let nowDStr = accountProfitOption.value.series[0].data[accountProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*24)
  delete accountProfitOption.value.dataZoom[0].start
  delete accountProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  accountProfitOption.value.dataZoom[0].startValue = startD
  accountProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleAccountProfitAllSelect = async () => {
  delete accountProfitOption.value.dataZoom[0].startValue
  delete accountProfitOption.value.dataZoom[0].endValue
  accountProfitOption.value.dataZoom[0].start = 0
  accountProfitOption.value.dataZoom[0].end = 100
}
const handleAccountProfitDataZoom = (event) => {
  // 处理dataZoom事件
  delete accountProfitOption.value.dataZoom[0].startValue
  delete accountProfitOption.value.dataZoom[0].endValue
}

const handleStrategyProfitOneHourSelect = async () => {
  let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60)
  delete strategyProfitOption.value.dataZoom[0].start
  delete strategyProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  strategyProfitOption.value.dataZoom[0].startValue = startD
  strategyProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyProfitThreeHourSelect = async () => {
  let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*3)
  delete strategyProfitOption.value.dataZoom[0].start
  delete strategyProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  strategyProfitOption.value.dataZoom[0].startValue = startD
  strategyProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyProfitEightHourSelect = async () => {
  let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*8)
  delete strategyProfitOption.value.dataZoom[0].start
  delete strategyProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  strategyProfitOption.value.dataZoom[0].startValue = startD
  strategyProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyProfitTwelveHourSelect = async () => {
  let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*12)
  delete strategyProfitOption.value.dataZoom[0].start
  delete strategyProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  strategyProfitOption.value.dataZoom[0].startValue = startD
  strategyProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyProfitOneDaySelect = async () => {
  let nowDStr = strategyProfitOption.value.series[0].data[strategyProfitOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD-1*1000*60*60*24)
  delete strategyProfitOption.value.dataZoom[0].start
  delete strategyProfitOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + " " +[tarD.getHours(), tarD.getMinutes(),tarD.getSeconds()].join(':')
  strategyProfitOption.value.dataZoom[0].startValue = startD
  strategyProfitOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyProfitAllSelect = async () => {
  delete strategyProfitOption.value.dataZoom[0].startValue
  delete strategyProfitOption.value.dataZoom[0].endValue
  strategyProfitOption.value.dataZoom[0].start = 0
  strategyProfitOption.value.dataZoom[0].end = 100
}
const handleStrategyProfitDataZoom = (event) => {
  // 处理dataZoom事件
  delete strategyProfitOption.value.dataZoom[0].startValue
  delete strategyProfitOption.value.dataZoom[0].endValue
}
</script>

<style scoped lang="scss">
.chart {
  height: 400px;
  weight: 100%;
  background-color: white;
}
</style>
