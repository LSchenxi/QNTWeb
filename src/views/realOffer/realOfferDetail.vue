<template>
  <div ref='container' overflow-auto style='height: 100%'>
    <div flex items-center bg-white min-h-50>
      <n-breadcrumb ml-20 hidden sm:block>
        <n-breadcrumb-item class='cursor-pointer' style='font-size: 17px' @click='handleBack'>
          <component :is='getIcon("MaterialSymbolsChevronLeft")' />
          返回实盘列表
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <n-spin :show='show'>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <div flex-row pb-20 style='font-size: 17px;font-weight: 700'>
            {{ realOfferModel.name }}
          </div>
          <div style='margin-bottom: 7px'>
            策略：{{ realOfferModel.strategyName }}（最后修改于：{{ realOfferModel.strategyUpdateTime }}）
          </div>
          <div style='margin-bottom: 7px'>
            日期：创建于{{ realOfferModel.createTime }} 最近开始于：{{ realOfferModel.updateTime }}
          </div>
          <div style='margin-bottom: 7px'>
            状态信息：K线周期 {{ realOfferModel.klinePeriod }} {{ realOfferModel.klineUnit }}
            <n-tag v-if="realOfferModel.status==='运行中'" type='success' size='small' round style='margin-left: 5px'>
              运行中
            </n-tag>
            <n-tag v-if="realOfferModel.status==='运行中'" type='warning' size='small' style='margin-left: 5px'>
              停止
            </n-tag>
            <n-tag v-if="realOfferModel.status==='已停止'" type='error' size='small' round style='margin-left: 10px'>
              已停止
            </n-tag>
            <n-tag v-if="realOfferModel.status==='已停止'" type='success' size='small' style='margin-left: 10px'>
              启动
            </n-tag>
          </div>
          <div flex-row>
            <div v-for='(exchangeName, index) in realOfferModel.exchangeNameList' :key='index'>
              <n-tag size='small' style='margin-right: 10px' :bordered='false'>{{ exchangeName }}</n-tag>
            </div>
          </div>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['2']">
            <n-collapse-item name='2'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  数据概览
                </n-text>
              </template>
              <template #header-extra>
                <n-text style='font-weight: 100;color: rgba(51, 51, 51, 0.45)'>
                  2024/04/24 14:46:15 更新
                </n-text>
              </template>
              <div flex-row flex-justify-between pb-20>
                <n-grid x-gap='3' :cols='3'>
                  <n-gi :span='1'>
                    <div style='height: 240px'>
                      <v-chart class='chart' :option='radarChartOption' autoresize @mousemove='handelMousemove' />
                    </div>
                  </n-gi>
                  <n-gi :span='1'>
                    <div style='height: 240px'>
                      <v-chart class='chart' :option='barChartOption' autoresize />
                    </div>
                  </n-gi>
                  <n-gi :span='1'>
                    <div style='height: 240px'>
                      <v-chart class='chart' :option='revenueOverviewChartOption' />
                    </div>
                  </n-gi>
                </n-grid>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['3']">
            <n-collapse-item name='3'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  收益曲线
                </n-text>
              </template>
              <div style='height: 420px;margin-bottom: 20px'>
                <n-space align='baseline' style='display: flex;background-color: white'>
                  <span style='margin-left: 20px'>zoom</span>
                  <n-button size='tiny' @click='handleRevenueChartOneHourSelect'>1h</n-button>
                  <n-button size='tiny' @click='handleRevenueChartThreeHourSelect'>3h</n-button>
                  <n-button size='tiny' @click='handleRevenueChartEightHourSelect'>8h</n-button>
                  <n-button size='tiny' @click='handleRevenueChartTwelveHourSelect'>12h</n-button>
                  <n-button size='tiny' @click='handleRevenueChartOneDaySelect'>24h</n-button>
                  <n-button size='tiny' @click='handleRevenueChartAllSelect'>All</n-button>
                </n-space>
                <v-chart class='chart' :option='revenueChartOption' @datazoom='handleRevenueChartDataZoom' />
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['4']">
            <n-collapse-item name='4'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  资产汇总
                </n-text>
              </template>
              <div style='height: 420px;margin-bottom: 20px'>
                <n-space align='baseline' style='display: flex;background-color: white'>
                  <span style='margin-left: 20px'>zoom</span>
                  <n-button size='tiny' @click='handleStrategyChartOneHourSelect'>1h</n-button>
                  <n-button size='tiny' @click='handleStrategyChartThreeHourSelect'>3h</n-button>
                  <n-button size='tiny' @click='handleStrategyChartEightHourSelect'>8h</n-button>
                  <n-button size='tiny' @click='handleStrategyChartTwelveHourSelect'>12h</n-button>
                  <n-button size='tiny' @click='handleStrategyChartOneDaySelect'>24h</n-button>
                  <n-button size='tiny' @click='handleStrategyChartAllSelect'>All</n-button>
                </n-space>
                <v-chart class='chart' :option='strategyChartOption' @datazoom='handleStrategyChartDataZoom' />
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['6']">
            <n-collapse-item name='6'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  状态信息
                </n-text>
              </template>
              <div pb-20>
                <n-tabs type='card' default-value='exchanges' @update:value='handleSelectStatusTabs'>
                  <n-tab-pane name='exchanges' tab='交易所'>
                    <div ref='tableContainer'>
                      <n-data-table
                          :data='exchangeTableData'
                          :columns='exchangeColumns'
                          :loading='exchangeTableLoading'
                          :style="{ width: '100%' }"
                      />
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name='enable' tab='启用'>
                    <div ref='tableContainer' overflow-auto>
                      <n-data-table
                          remote
                          flex-height
                          :data='enableTableData'
                          :columns='enableColumns'
                          :loading='enableTableLoading'
                          :style="{ width: '2490px', height:`${height}px` }"
                      />
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name='clearingWarehouse' tab='清仓'>
                    <div ref='tableContainer' overflow-auto>
                      <n-data-table
                          remote
                          :data='clearingWarehouseTableData'
                          :columns='clearingWarehouseColumns'
                          :loading='clearingWarehouseTableLoading'
                          :style="{ width: '2490px' }"
                      />
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name='locking' tab='锁定'>
                    <div ref='tableContainer' overflow-auto>
                      <n-data-table
                          remote
                          :data='lockingTableData'
                          :columns='lockingColumns'
                          :loading='lockingTableLoading'
                          :style="{ width: '2490px' }"
                      />
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name='suspend' tab='暂停'>
                    <div ref='tableContainer' overflow-auto>
                      <n-data-table
                          remote
                          :data='suspendTableData'
                          :columns='suspendColumns'
                          :loading='suspendTableLoading'
                          :style="{ width: '2490px' }"
                      />
                    </div>
                  </n-tab-pane>
                  <!--                  <n-tab-pane name="summary" tab="汇总">
                                      <div ref='tableContainer' overflow-auto>
                                        <n-data-table
                                          remote
                                          :data='summaryTableData'
                                          :columns='summaryColumns'
                                          :loading='summaryTableLoading'
                                          :style="{ width: '100%' }"
                                        />
                                      </div>
                                    </n-tab-pane>-->
                  <n-tab-pane name='transactionRecords' tab='交易记录'>
                    <div ref='tableContainer' overflow-auto>
                      <n-data-table
                          remote
                          :data='transactionRecordTableData'
                          :columns='transactionRecordColumns'
                          :loading='transactionRecordTableLoading'
                          :style="{ width: '100%' }"
                      />
                    </div>
                  </n-tab-pane>
                </n-tabs>
                <n-tabs type='card' style='padding-top: 20px' v-model:value='symbolId' name='realOfferSymbolTabs'
                        @update:value='handleSelectSymbolTabs'>
                  <n-tab-pane v-for='symbol in realOfferSymbolList' :key='symbol.id' :name='symbol.id'
                              :tab='symbol.name'>
                    <div ref='tableContainer'>
                      <n-data-table
                          remote
                          :data='symbolExchangeTableData'
                          :columns='symbolExchangeColumns'
                          :loading='symbolExchangeTableLoading'
                          :style="{ width: '100%' }"
                      />
                    </div>
                  </n-tab-pane>
                </n-tabs>
                <div style='margin-top: 15px'>运行版本：</div>
                <div style='margin-top: 5px'>初始资产(U)：</div>
                <div style='margin-top: 5px'>提币资产(U)：</div>
                <div style='margin-top: 5px'>当前权益(U)：</div>
                <div style='margin-top: 5px'>限制容量(U)：</div>
                <div style='margin-top: 5px;color: red'>套利收益： 收益率： 年化：</div>
                <div style='margin-top: 5px;color: red'>汇总收益： 收益率： 年化：</div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['8']">
            <n-collapse-item name='8'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  运行日志
                </n-text>
              </template>
              <div pb-20>
                <div ref='tableContainer'>
                  <n-data-table
                      remote
                      :data='logTableData2'
                      :columns='logColumns'
                      :pagination='logTablePagination2'
                      :loading='logTableLoading2'
                      :style="{ width: '2700px%'}"
                      @update:page='handleLogTablePageChange2'
                      @update:pageSize='handleLogTablePageSizeChange2'
                  />
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['7']">
            <n-collapse-item name='7'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  交易日志
                </n-text>
              </template>
              <div pb-20>
                <div ref='tableContainer'>
                  <n-data-table
                      remote
                      :data='logTableData'
                      :columns='logColumns'
                      :pagination='logTablePagination'
                      :loading='logTableLoading'
                      :style="{ width: '2700px%'}"
                      :row-class-name='logTableRowClassName'
                      @update:page='handleLogTablePageChange'
                      @update:pageSize='handleLogTablePageSizeChange'
                  />
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
    </n-spin>
    <n-drawer v-model:show='adjustmentDrawer' :auto-focus='false' :close-on-esc='false' :mask-closable='false'
              width='40%'>
      <n-drawer-content closable>
        <template #header>调仓（{{ currentSymboleName }}）</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type='primary' :loading='adjustmentSaveLoading' @click='saveAdjustment'>保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class='cus-scroll'>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { router } from '../../router'
import { renderIcon } from '@/utils'
import {
  getRealOffer,
  getRealOfferRevenueChartData,
  getRealOfferStrategyChartData,
  getLogTablePage,
  getLogTablePage2,
  getRealOfferExchangeList,
  getRealOfferEnableSymbolList,
  getRealOfferClearingSymbolList,
  getRealOfferLockingSymbolList,
  getRealOfferSuspendSymbolList,
  getRealOfferSummarySymbolList,
  getRealOfferSymbolRecordsList,
  getSymbolList,
  getSymbolTableData
} from '../../api/realOfferDetail/realOfferDetail'
import { ref } from 'vue'
import { use } from 'echarts/core'
import { useWindowResize } from '@/hooks/event/window-resize.js'
import { RadarChart, BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { NButton, NSpace } from 'naive-ui'

use([TitleComponent, TooltipComponent, RadarChart, CanvasRenderer, BarChart, GridComponent, LineChart, DataZoomComponent, ToolboxComponent])
const height = ref(200)
const revenueOverviewChartData = []
let revenueChartData = ref([])
let strategyChartData = ref([])
const updateOptions = {
  notMerge: true
}
let second = 1
let value = Math.random() * 1000
const show = ref(false)
const radarChartOption = ref({
  title: {
    text: null
  },
  tooltip: {
    show: true,
    triggerOn: 'mousemove',
    formatter: function() {
      return ''
    }
  },
  radar: {
    indicator: [
      { name: '年华夏普评分', max: 10 },
      { name: '运行时长评分', max: 10 },
      { name: '回撤评分', max: 10 },
      { name: '收益能力评分', max: 10 },
      { name: '资金规模评分', max: 10 }
    ]
  },
  series: [
    {
      name: 'real offer scores',
      type: 'radar',
      areaStyle: { color: 'rgba(185, 226, 255, 1)' },
      itemStyle: {
        color: 'rgb(127,193,239)',
        borderWidth: 10,
        borderColor: 'transparent'
      },
      data: [
        {
          value: [9.99, 5.52, 9.93, 9.99, 6.29],
          name: 'scores'
        }
      ]
    }
  ]
})
const barChartOption = ref({
  title: {
    text: null
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function(params) {
      var result = params[0].axisValueLabel + '：' + params[0].data
      return result
    }
  },
  grid: {
    containLabel: true,
    height: '70%',
    width: 'auto'
  },
  xAxis: {
    type: 'value',
    show: false,
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'category',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    data: [
      '总收益波动',
      '每日收益波动',
      '当前回撤金额',
      '最大回撤金额'
    ]
  },
  series: [
    {
      name: 'Cost',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        color: 'rgba(14, 13, 13, 1)',
        fontSize: 12,
        fontWeight: 600,
        textBorderColor: 'rgba(255, 255, 255, 1)',
        textBorderWidth: 2,
        position: 'insideRight'
      },
      itemStyle: {
        color: 'rgb(127,193,239)'
      },
      data: [
        5339.58,
        19.75,
        0.00,
        -22.90
      ]
    }
  ]
})
const revenueOverviewChartOption = ref({
  title: {
    text: null
  },
  grid: {
    height: '70%',
    width: 'auto'
  },
  xAxis: {
    type: 'time',
    show: false
  },
  yAxis: {
    type: 'value'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      var result = params[0].axisValueLabel + '<br/>'
      result += '累计收益：' + params[0].data.value[1] + '<br/>'
      return result
    }
  },
  series: [
    {
      data: [],
      symbol: 'none',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: 'rgb(127,193,239)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(185, 226, 255, 1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255, 255, 255, 1)' // 100% 处的颜色
          }],
          global: false
        }
      }
    }
  ]
})
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
const strategyChartOption = ref({
  title: [{
    text: null,
    left: 'center'
  }, {
    subtext: null,
    left: 'right'
  }],
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
const buttonScc = reactive({
  color: 'white'
})
const strategyOptions = ref([])
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
const exchangeColumns = [
  {
    title: '交易所',
    key: 'exchangeName'
  },
  {
    title: '资产(U)',
    key: 'asset'
  },
  {
    title: 'USDT',
    key: 'usdt'
  },
  {
    title: '日交易量(U)',
    key: 'dailyTradingVolumeUsdt'
  },
  {
    title: '日交易量(挂|吃)',
    key: 'dailyTradingVolume'
  },
  {
    title: '交易对数',
    key: 'transactionPairs'
  },
  {
    title: '交易量占比%',
    key: 'transactionVolumeProportion'
  },
  {
    title: '滑点%',
    key: 'slippage'
  },
  {
    title: '成功率%',
    key: 'successRate'
  },
  {
    title: '增量溢价',
    key: 'incrementalPremium'
  },
  {
    title: '状态',
    key: 'exchangeStatus'
  },
  {
    title: '操作',
    key: 'exchangeActions',
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
                    ghost: true,
                    onClick: async () => {
                      // handleUpdateRealOffer(row)
                    }
                  },
                  { default: () => '配置' }
              )
            ]
          }
      )
    }
  }
]
const exchangeTableData = ref([])
const exchangeTableLoading = ref(false)
const enableColumns = [
  {
    title: '币种',
    key: 'symbolName',
    width: 90
  },
  {
    title: '摊薄成本(U)',
    key: 'dilutedCosts',
    width: 100
  },
  {
    title: '买入成本(U)',
    key: 'buyCost',
    width: 100
  },
  {
    title: '持仓价值(U)',
    key: 'holdingValue',
    width: 100,
    render(row) {
      const params = row.holdingValue
      if ('' !== params && undefined !== params && null !== params && params.includes('.')) {
        const params1 = params.split('.')[0]
        const params2 = params.split('.')[1]
        if (params2.length >= 2) {
          return params1 + '.' + params2.substr(0, 2)
        } else {
          return params
        }
      } else {
        return params
      }
    }
  },
  {
    title: '价值偏差(U)',
    key: 'valueDeviation',
    width: 100
  },
  {
    title: '持仓盈亏(U)',
    key: 'holdingPhase',
    width: 100
  },
  {
    title: '套利盈亏(U)',
    key: 'arbitragePhase',
    width: 100
  },
  {
    title: '1h盈亏(U)',
    key: 'oneHourPhase',
    width: 100
  },
  {
    title: '4h盈亏(U)',
    key: 'fourHourPhase',
    width: 100
  },
  {
    title: '24h盈亏(U)',
    key: 'oneDayPhase',
    width: 100
  },
  {
    title: '3日盈亏(U)',
    key: 'threeDayPhase',
    width: 100
  },
  {
    title: '3日月化(%)',
    key: 'threeDayMonthly',
    width: 100
  },
  {
    title: '启用时长(D)',
    key: 'enableDuration',
    width: 100
  },
  {
    title: '均衡溢价',
    key: 'equilibriumPremium',
    width: 100
  },
  {
    title: '交易溢价',
    key: 'transactionPremium',
    width: 100
  },
  {
    title: '挂单大小',
    key: 'orderSize',
    width: 100
  },
  {
    title: '挂单距离',
    key: 'orderDistance',
    width: 100
  },
  {
    title: '延迟|耗时|轮询',
    key: 'delayTimeConsumingPolling',
    width: 200
  },
  {
    title: '交易对个数',
    key: 'transactionPairs',
    width: 100
  },
  {
    title: '操作',
    key: 'enableActions',
    width: 500,
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
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '设置' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '暂停' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    ghost: true,
                    onClick: async () => {
                      handleAdjustment(row)
                    }
                  },
                  { default: () => '调仓' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '锁定' }
              )
            ]
          }
      )
    }
  }
]
const enableTableData = ref([])
const enableTableLoading = ref(false)
const clearingWarehouseColumns = [
  {
    title: '币种',
    key: 'symbolName',
    width: 90
  },
  {
    title: '摊薄成本(U)',
    key: 'dilutedCosts',
    width: 100
  },
  {
    title: '买入成本(U)',
    key: 'buyCost',
    width: 100
  },
  {
    title: '持仓价值(U)',
    key: 'holdingValue',
    width: 100
  },
  {
    title: '价值偏差(U)',
    key: 'valueDeviation',
    width: 100
  },
  {
    title: '持仓盈亏(U)',
    key: 'holdingPhase',
    width: 100

  },
  {
    title: '套利盈亏(U)',
    key: 'arbitragePhase',
    width: 100

  },
  {
    title: '1h盈亏(U)',
    key: 'oneHourPhase',
    width: 100

  },
  {
    title: '1h月化(%)',
    key: 'oneHourMonthly',
    width: 100

  },
  {
    title: '4h盈亏(U)',
    key: 'fourHourPhase',
    width: 100

  },
  {
    title: '4h月化(%)',
    key: 'fourHourMonthly',
    width: 100

  },
  {
    title: '24h盈亏(U)',
    key: 'oneDayPhase',
    width: 100

  },
  {
    title: '24h月化(%)',
    key: 'oneDayMonthly',
    width: 100

  },
  {
    title: '启用时长(D)',
    key: 'enableDuration',
    width: 100

  },
  {
    title: '均衡溢价',
    key: 'equilibriumPremium',
    width: 100

  },
  {
    title: '交易溢价',
    key: 'transactionPremium',
    width: 100

  },
  {
    title: '挂单大小',
    key: 'orderSize',
    width: 100

  },
  {
    title: '挂单距离',
    key: 'orderDistance',
    width: 100

  },
  {
    title: '延迟|耗时|轮询',
    key: 'delayTimeConsumingPolling',
    width: 200

  },
  {
    title: '交易中',
    key: 'inTransaction',
    width: 100

  },
  {
    title: '交易对个数',
    key: 'transactionPairs',
    width: 100

  },
  {
    title: '操作',
    key: 'enableActions',
    width: 500,
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
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '设置' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '暂停' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    ghost: true,
                    onClick: async () => {
                      handleAdjustment(row)
                    }
                  },
                  { default: () => '调仓' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '锁定' }
              )
            ]
          }
      )
    }
  }
]
const clearingWarehouseTableData = ref([])
const clearingWarehouseTableLoading = ref(false)
const lockingColumns = [
  {
    title: '币种',
    key: 'symbolName',
    width: 90

  },
  {
    title: '摊薄成本(U)',
    key: 'dilutedCosts',
    width: 100

  },
  {
    title: '买入成本(U)',
    key: 'buyCost',
    width: 100

  },
  {
    title: '持仓价值(U)',
    key: 'holdingValue',
    width: 100

  },
  {
    title: '价值偏差(U)',
    key: 'valueDeviation',
    width: 100

  },
  {
    title: '持仓盈亏(U)',
    key: 'holdingPhase',
    width: 100

  },
  {
    title: '套利盈亏(U)',
    key: 'arbitragePhase',
    width: 100

  },
  {
    title: '1h盈亏(U)',
    key: 'oneHourPhase',
    width: 100

  },
  {
    title: '4h盈亏(U)',
    key: 'fourHourPhase',
    width: 100

  },
  {
    title: '24h盈亏(U)',
    key: 'oneDayPhase',
    width: 100

  },
  {
    title: '3日盈亏(U)',
    key: 'threeDayPhase',
    width: 100

  },
  {
    title: '3日月化(%)',
    key: 'threeDayMonthly',
    width: 100

  },
  {
    title: '启用时长(D)',
    key: 'enableDuration',
    width: 100

  },
  {
    title: '均衡溢价',
    key: 'equilibriumPremium',
    width: 100

  },
  {
    title: '交易溢价',
    key: 'transactionPremium',
    width: 100

  },
  {
    title: '挂单大小',
    key: 'orderSize',
    width: 100

  },
  {
    title: '挂单距离',
    key: 'orderDistance',
    width: 100

  },
  {
    title: '延迟|耗时|轮询',
    key: 'delayTimeConsumingPolling',
    width: 200

  },
  {
    title: '交易对个数',
    key: 'transactionPairs',
    width: 100

  },
  {
    title: '操作',
    key: 'enableActions',
    width: 500,
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
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '设置' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '暂停' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    ghost: true,
                    onClick: async () => {
                      handleAdjustment(row)
                    }
                  },
                  { default: () => '调仓' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '解锁' }
              )
            ]
          }
      )
    }
  }
]
const lockingTableData = ref([])
const lockingTableLoading = ref(false)
const suspendColumns = [
  {
    title: '币种',
    key: 'symbolName',
    width: 90

  },
  {
    title: '摊薄成本(U)',
    key: 'dilutedCosts',
    width: 100

  },
  {
    title: '买入成本(U)',
    key: 'buyCost',
    width: 100

  },
  {
    title: '持仓价值(U)',
    key: 'holdingValue',
    width: 100

  },
  {
    title: '价值偏差(U)',
    key: 'valueDeviation',
    width: 100

  },
  {
    title: '持仓盈亏(U)',
    key: 'holdingPhase',
    width: 100

  },
  {
    title: '套利盈亏(U)',
    key: 'arbitragePhase',
    width: 100

  },
  {
    title: '1h盈亏(U)',
    key: 'oneHourPhase',
    width: 100

  },
  {
    title: '4h盈亏(U)',
    key: 'fourHourPhase',
    width: 100

  },
  {
    title: '24h盈亏(U)',
    key: 'oneDayPhase',
    width: 100

  },
  {
    title: '3日盈亏(U)',
    key: 'threeDayPhase',
    width: 100

  },
  {
    title: '3日月化(%)',
    key: 'threeDayMonthly',
    width: 100

  },
  {
    title: '暂停时长(D)',
    key: 'enableDuration',
    width: 100

  },
  {
    title: '均衡溢价',
    key: 'equilibriumPremium',
    width: 100

  },
  {
    title: '交易溢价',
    key: 'transactionPremium',
    width: 100

  },
  {
    title: '挂单大小',
    key: 'orderSize',
    width: 100

  },
  {
    title: '挂单距离',
    key: 'orderDistance',
    width: 100

  },
  {
    title: '延迟|耗时|轮询',
    key: 'delayTimeConsumingPolling',
    width: 200

  },
  {
    title: '交易对个数',
    key: 'transactionPairs',
    width: 100

  },
  {
    title: '操作',
    key: 'enableActions',
    width: 500,
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
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '设置' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'success',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '启用' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    ghost: true,
                    onClick: async () => {
                      //handleAdjustment(row)
                    }
                  },
                  { default: () => '删除' }
              ),
              h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    ghost: true,
                    onClick: async () => {
                      // handleDeleteRealOffer(row)
                    }
                  },
                  { default: () => '锁定' }
              )
            ]
          }
      )
    }
  }
]
const suspendTableData = ref([])
const suspendTableLoading = ref(false)
const summaryColumns = [
  {
    title: '币种',
    key: 'symbolName'

  },
  {
    title: '汇总(币)',
    key: 'summaryCurrency'

  },
  {
    title: '汇总(U)',
    key: 'summaryUsdt'

  },
  {
    title: 'okx',
    key: 'okxSummary'

  },
  {
    title: 'Bybit',
    key: 'bybitSummary'

  },
  {
    title: 'Huobi',
    key: 'huobiSummary'

  },
  {
    title: 'bitget',
    key: 'bitgetSummary'

  },
  {
    title: 'MEXC',
    key: 'mexcSummary'

  },
  {
    title: 'Kucoin',
    key: 'kucoinSummary'

  },
  {
    title: 'Gate.IO',
    key: 'gateSummary'

  },
  {
    title: 'coinex',
    key: 'coinexSummary'

  },
  {
    title: 'Bitmart',
    key: 'bitmartSummary'

  },
  {
    title: '状态',
    key: 'summaryStatus'

  }
]
const summaryTableData = ref([])
const summaryTableLoading = ref(false)
const transactionRecordColumns = [
  {
    title: '币种',
    key: 'symbolName'

  },
  {
    title: '建仓时间',
    key: 'createWarehouseTime'

  },
  {
    title: '建仓价格',
    key: 'createWarehousePrice'

  },
  {
    title: '平仓价格',
    key: 'closingWarehousePrice'

  },
  {
    title: '买入均价',
    key: 'buyAveragePrice'

  },
  {
    title: '买入价值(U)',
    key: 'buyPrice'

  },
  {
    title: '卖出均价',
    key: 'sellAveragePrice'

  },
  {
    title: '卖出价值(U)',
    key: 'sellPrice'

  },
  {
    title: '交易次数',
    key: 'transactionsCount'

  }
]
const transactionRecordTableData = ref([])
const transactionRecordTableLoading = ref(false)
const symbolExchangeColumns = [
  {
    title: '交易所',
    key: 'exchange'

  },
  {
    title: '交易对',
    key: 'symbolName'

  },
  {
    title: '费率%',
    key: 'rate'

  },
  {
    title: '延迟ms',
    key: 'delay'

  },
  {
    title: '当前余额',
    key: 'currentBalance'

  },
  {
    title: '当前币数',
    key: 'currentSymbolNumber'

  },
  {
    title: '币值',
    key: 'symbolValue'

  },
  {
    title: '卖一',
    key: 'sellOne'

  },
  {
    title: '买一',
    key: 'buyOne'

  },
  {
    title: '市场深度%',
    key: 'marketDepth'

  },
  {
    title: '总成交额',
    key: 'totalTransactionAmount',
    render(row) {
      const params = row.totalTransactionAmount
      if ('' !== params && undefined !== params && null !== params && params.includes('.')) {
        const params1 = params.split('.')[0]
        const params2 = params.split('.')[1]
        if (params2.length >= 2) {
          return params1 + '.' + params2.substr(0, 2)
        } else {
          return params
        }
      } else {
        return params
      }
    }

  },
  {
    title: '滑点%',
    key: 'slidingPoint',
    render(row) {
      const params = row.slidingPoint
      if ('' !== params && undefined !== params && null !== params && params === '0.00') {
        return '0'
      } else {
        return params
      }
    }

  },
  {
    title: '成功率%',
    key: 'successRate'

  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      if (row.status === 1) {
        return 'enable'
      } else if (row.status === 0) {
        return 'disable'
      } else if (row.status === 2) {
        return 'suspend'
      }
    }

  },
  {
    title: '操作',
    key: 'symbolExchangeActions',
    align: 'center',
    render(row) {
      if (row.status === 1) {
        return h(
            NSpace,
            { justify: 'center' },
            {
              default: () => [
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'warning',
                      ghost: true,
                      onClick: async () => {
                        // handleUpdateRealOffer(row)
                      }
                    },
                    { default: () => '暂停' }
                )
              ]
            }
        )
      } else if (row.status === 0) {
        return h(
            NSpace,
            { justify: 'center' },
            {
              default: () => [
                h(
                    NButton,
                    {
                      size: 'small',
                      type: 'success',
                      ghost: true,
                      onClick: async () => {
                        // handleUpdateRealOffer(row)
                      }
                    },
                    { default: () => '启用' }
                )
              ]
            }
        )
      }
    }
  }
]
const symbolExchangeTableData = ref([])
const symbolExchangeTableLoading = ref(false)
const realOfferSymbolList = ref([])
const symbolId = ref()
const logTableData = ref([])
const logColumns = [
  {
    title: '日期',
    key: 'logTime',
    width: 240

  },
  // {
  //   title: '平台',
  //   key: 'platform',
  //   width: 100
  // },
  {
    title: '类型',
    key: 'logType',
    width: 60

  },
  // {
  //   title: '价格',
  //   key: 'price',
  //   width: 100
  // },
  // {
  //   title: '数量',
  //   key: 'quantity',
  //   width: 100
  // },
  {
    title: '信息',
    key: 'logInfo',
    width: 2200

  }
]
const logTableLoading = ref(false)
const logTablePagination = reactive({
  page: 1,
  pageSize: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0
})
const logTableData2 = ref([])
const logTableLoading2 = ref(false)
const logTablePagination2 = reactive({
  page: 1,
  pageSize: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0
})
let lastPageData = null
const realOfferModel = ref({
  id: null,
  name: null,
  serverId: null,
  strategyId: null,
  strategyName: null,
  createTime: null,
  updateTime: null,
  strategyUpdateTime: null,
  klinePeriod: null,
  klineUnit: null,
  status: null,
  exchangeNameList: []
})
const realOfferSaveLoading = ref(false)
let getRevenueChartDataInterval = null
let getStrategyChartDataInterval = null
let getLogTableDataInterval = null
let getLogTableDataInterval2 = null
const currentSymboleName = ref()
const currentSymboleId = ref()
const adjustmentDrawer = ref(false)
const adjustmentSaveLoading = ref(false)
onMounted(() => {
  show.value = true
  if (!useRoute().query || !useRoute().query.realOfferId) {
    window.$message.error('非法跳转')
    router.push('realOffer')
  }
  lastPageData = useRoute().query.realOfferId
  getRealOfferById()
  getRadarChartData()
  getBarChartData()
  initRevenueOverviewChartData()
  initRevenueChartData()
  getRevenueChartDataInterval = setInterval(initRevenueChartData, 1000 * 20)
  initStrategyChartData()
  getStrategyChartDataInterval = setInterval(initStrategyChartData, 1000 * 20)
  searchExchangeTableData()
  getRealOfferSymbolList()
  getLogTableDataInterval = setInterval(searchLogTableData, 1000 * 60)
  searchLogTableData()
  getLogTableDataInterval2 = setInterval(searchLogTableData2, 1000 * 60)
  searchLogTableData2()
  show.value = false
  nextTick(() => {
    resetTableHeight()
  })
})

onUnmounted(() => {
  clearInterval(getRevenueChartDataInterval)
  clearInterval(getStrategyChartDataInterval)
  clearInterval(getLogTableDataInterval)
  clearInterval(getLogTableDataInterval2)
})

const resetTableHeight = () => {
  height.value = window.innerHeight * 0.8
}
useWindowResize(resetTableHeight, 0)

const clearRealOfferModel = () => {
  Object.keys(realOfferModel.value).forEach((key) => {
    realOfferModel.value[key] = null
  })
}

function getIcon(meta) {
  return renderIcon(meta, { size: 23 })
}

const handleBack = () => {
  router.push('realOffer')
}

const getRealOfferById = async () => {
  const { data, message, success } = await getRealOffer({
    realOfferId: lastPageData
  })
  if (success) {
    realOfferModel.value = data
  } else {
    window.$message.error('获取数据失败', message)
  }
}

const getRadarChartData = async () => {
  radarChartOption.value.title.text = '总评分：8.75'
}

const handelMousemove = (params) => {
  let num = params.event.topTarget.__dimIdx
  if (num === undefined) {
    radarChartOption.value.tooltip.show = false
    radarChartOption.value.tooltip.formatter = function() {
      return ''
    }
  } else {
    radarChartOption.value.tooltip.show = true
    radarChartOption.value.tooltip.formatter = function() {
      let textString = radarChartOption.value.radar.indicator[num].name + ':' + params.data.value[num]
      if (num === 0) {
        textString = textString + '<br/>' + '无风险收益为0,假设初始本金为收益波动值'
      } else if (num === 1) {
        textString = textString + '<br/>' + '策略运行时间越长,评分越高'
      } else if (num === 2) {
        textString = textString + '<br/>' + '用最大回撤计算'
      } else if (num === 3) {
        textString = textString + '<br/>' + '用年化收益计算'
      } else if (num === 4) {
        textString = textString + '<br/>' + '用收益波动衡量'
      }
      return textString
    }
  }
}

const getBarChartData = async () => {
  barChartOption.value.title.text = '胜率：90.00%'
}

const initRevenueOverviewChartData = () => {
  for (var i = 1; i < 1000; i++) {
    revenueOverviewChartData.push(randomData())
  }
  revenueOverviewChartOption.value.series[0].data = revenueOverviewChartData
  revenueOverviewChartOption.value.title.text = '收益概览：' + revenueOverviewChartData[revenueOverviewChartData.length - 3].value[1]
}

const initRevenueChartData = async () => {
  let currentTime = null
  if (revenueChartOption.value.series[0].data.length > 0) {
    currentTime = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  } else {
    let initDate = new Date('2000-01-01 00:00:00')
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    id: lastPageData,
    currentTime: currentTime
  }
  const { data, message, success } = await getRealOfferRevenueChartData(params)
  if (success) {
    revenueChartData = data
  } else {
    window.$message.error(message)
  }
  if (revenueChartOption.value.series[0].data.length > 0) {
    revenueChartOption.value.series[0].data = [...revenueChartOption.value.series[0].data, ...revenueChartData]
  } else {
    revenueChartOption.value.series[0].data = revenueChartData
  }
}

const initStrategyChartData = async () => {
  let currentTime = null
  if (strategyChartOption.value.series[0].data.length > 0) {
    currentTime = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  } else {
    let initDate = new Date('2000-01-01 00:00:00')
    currentTime = [initDate.getFullYear(), initDate.getMonth(), initDate.getDate()].join('-') + ' ' + [initDate.getHours(), initDate.getMinutes(), initDate.getSeconds()].join(':')
  }
  const params = {
    id: lastPageData,
    currentTime: currentTime
  }
  const { data, message, success } = await getRealOfferStrategyChartData(params)
  if (success) {
    strategyChartData = data
  } else {
    window.$message.error(message)
  }
  if (strategyChartOption.value.series[0].data.length > 0) {
    strategyChartOption.value.series[0].data = [...strategyChartOption.value.series[0].data, ...strategyChartData]
  } else {
    strategyChartOption.value.series[0].data = strategyChartData
  }
  /*for (var i = 1; i < 1000; i++) {
    strategyChartData.push(randomData())
  }
  strategyChartOption.value.series[0].data = strategyChartData
  strategyChartOption.value.title[0].text = '收益汇总'
  strategyChartOption.value.title[1].subtext = '更新时间：' + strategyChartData[strategyChartData.length - 3].value[0]*/
}

const randomData = () => {
  let addSecond = Math.floor(Math.random() * 2) + 1
  second = second + addSecond
  let now = new Date(2024, 4, 11, 10, 45, second)
  value = value + Math.random() * 20
  return {
    value: [
      [now.getFullYear(), now.getMonth(), now.getDate()].join('-') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].join(':'),
      Math.round(value)
    ]
  }
}

const handleRevenueChartOneHourSelect = async () => {
  let nowDStr = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  console.log(nowDStr)
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60)
  delete revenueChartOption.value.dataZoom[0].start
  delete revenueChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  console.log(startD)
  revenueChartOption.value.dataZoom[0].startValue = startD
  revenueChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleRevenueChartThreeHourSelect = async () => {
  let nowDStr = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 3)
  delete revenueChartOption.value.dataZoom[0].start
  delete revenueChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  revenueChartOption.value.dataZoom[0].startValue = startD
  revenueChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleRevenueChartEightHourSelect = async () => {
  let nowDStr = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 8)
  delete revenueChartOption.value.dataZoom[0].start
  delete revenueChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  revenueChartOption.value.dataZoom[0].startValue = startD
  revenueChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleRevenueChartTwelveHourSelect = async () => {
  let nowDStr = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 12)
  delete revenueChartOption.value.dataZoom[0].start
  delete revenueChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  revenueChartOption.value.dataZoom[0].startValue = startD
  revenueChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleRevenueChartOneDaySelect = async () => {
  let nowDStr = revenueChartOption.value.series[0].data[revenueChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 24)
  delete revenueChartOption.value.dataZoom[0].start
  delete revenueChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  revenueChartOption.value.dataZoom[0].startValue = startD
  revenueChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleRevenueChartAllSelect = async () => {
  delete revenueChartOption.value.dataZoom[0].startValue
  delete revenueChartOption.value.dataZoom[0].endValue
  revenueChartOption.value.dataZoom[0].start = 0
  revenueChartOption.value.dataZoom[0].end = 100
  revenueChartOption.value.dataZoom[1].start = 0
  revenueChartOption.value.dataZoom[1].end = 100
}
const handleRevenueChartDataZoom = (event) => {
  // 处理dataZoom事件
  delete revenueChartOption.value.dataZoom[0].startValue
  delete revenueChartOption.value.dataZoom[0].endValue
}

const handleStrategyChartOneHourSelect = async () => {
  let nowDStr = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  console.log(nowDStr)
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60)
  delete strategyChartOption.value.dataZoom[0].start
  delete strategyChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  console.log(startD)
  strategyChartOption.value.dataZoom[0].startValue = startD
  strategyChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyChartThreeHourSelect = async () => {
  let nowDStr = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 3)
  delete strategyChartOption.value.dataZoom[0].start
  delete strategyChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  strategyChartOption.value.dataZoom[0].startValue = startD
  strategyChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyChartEightHourSelect = async () => {
  let nowDStr = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 8)
  delete strategyChartOption.value.dataZoom[0].start
  delete strategyChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth(), tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  strategyChartOption.value.dataZoom[0].startValue = startD
  strategyChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyChartTwelveHourSelect = async () => {
  let nowDStr = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 12)
  delete strategyChartOption.value.dataZoom[0].start
  delete strategyChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  strategyChartOption.value.dataZoom[0].startValue = startD
  strategyChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyChartOneDaySelect = async () => {
  let nowDStr = strategyChartOption.value.series[0].data[strategyChartOption.value.series[0].data.length - 1].value[0]
  let nowD = new Date(nowDStr)
  let tarD = new Date(nowD - 1 * 1000 * 60 * 60 * 24)
  delete strategyChartOption.value.dataZoom[0].start
  delete strategyChartOption.value.dataZoom[0].end
  let startD = [tarD.getFullYear(), tarD.getMonth() + 1, tarD.getDate()].join('-') + ' ' + [tarD.getHours(), tarD.getMinutes(), tarD.getSeconds()].join(':')
  strategyChartOption.value.dataZoom[0].startValue = startD
  strategyChartOption.value.dataZoom[0].endValue = nowDStr
}
const handleStrategyChartAllSelect = async () => {
  delete strategyChartOption.value.dataZoom[0].startValue
  delete strategyChartOption.value.dataZoom[0].endValue
  strategyChartOption.value.dataZoom[0].start = 0
  strategyChartOption.value.dataZoom[0].end = 100
  strategyChartOption.value.dataZoom[1].start = 0
  strategyChartOption.value.dataZoom[1].end = 100
}
const handleStrategyChartDataZoom = (event) => {
  // 处理dataZoom事件
  delete strategyChartOption.value.dataZoom[0].startValue
  delete strategyChartOption.value.dataZoom[0].endValue
}

const handleSelectStatusTabs = (value) => {
  if (value === 'exchanges') {
    searchExchangeTableData()
  }
  if (value === 'enable') {
    searchEnableTableData()
  }
  if (value === 'clearingWarehouse') {
    searchClearingWarehouseTableData()
  }
  if (value === 'locking') {
    searchLockingTableData()
  }
  if (value === 'suspend') {
    searchSuspendTableData()
  }
  if (value === 'summary') {
    searchSummaryTableData()
  }
  if (value === 'transactionRecords') {
    searchTransactionRecordTableData()
  }
}

const searchExchangeTableData = async () => {
  exchangeTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferExchangeList({
    id: lastPageData
  })
  if (success) {
    exchangeTableData.value = data
  } else {
    window.$message.error(message)
  }
  exchangeTableLoading.value = false
}

const searchEnableTableData = async () => {
  enableTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferEnableSymbolList({
    id: lastPageData
  })
  if (success) {
    enableTableData.value = data
  } else {
    window.$message.error(message)
  }
  enableTableLoading.value = false
}

const searchClearingWarehouseTableData = async () => {
  clearingWarehouseTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferClearingSymbolList({
    id: lastPageData
  })
  if (success) {
    clearingWarehouseTableData.value = data
  } else {
    window.$message.error(message)
  }
  clearingWarehouseTableLoading.value = false
}

const searchLockingTableData = async () => {
  lockingTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferLockingSymbolList({
    id: lastPageData
  })
  if (success) {
    lockingTableData.value = data
  } else {
    window.$message.error(message)
  }
  lockingTableLoading.value = false
}

const searchSuspendTableData = async () => {
  suspendTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferSuspendSymbolList({
    id: lastPageData
  })
  if (success) {
    suspendTableData.value = data
  } else {
    window.$message.error(message)
  }
  suspendTableLoading.value = false
}

const searchSummaryTableData = async () => {
  summaryTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferSummarySymbolList({
    id: lastPageData
  })
  if (success) {
    summaryTableData.value = data
  } else {
    window.$message.error(message)
  }
  summaryTableLoading.value = false
}

const searchTransactionRecordTableData = async () => {
  transactionRecordTableLoading.value = true
  //获取数据
  const { data, message, success } = await getRealOfferSymbolRecordsList({
    id: lastPageData
  })
  if (success) {
    transactionRecordTableData.value = data
  } else {
    window.$message.error(message)
  }
  transactionRecordTableLoading.value = false
}

const searchLogTableData = async () => {
  logTableLoading.value = true
  //获取数据
  const { data, message, success } = await getLogTablePage({
    page: logTablePagination.page,
    size: logTablePagination.pageSize,
    id: lastPageData
  })
  if (success) {
    const { total, records } = data
    logTableData.value = records
    logTablePagination.itemCount = total
  } else {
    window.$message.error(message)
  }
  logTableLoading.value = false
}

const getRealOfferSymbolList = async () => {
  const { data, message, success } = await getSymbolList({
    id: lastPageData
  })
  if (success) {
    realOfferSymbolList.value = data
    if (realOfferSymbolList.value.length > 0) {
      symbolId.value = realOfferSymbolList.value[0].id
      getRealOfferSymbolTableData(symbolId.value)
    }
  } else {
    window.$message.error(message)
  }
}

const getRealOfferSymbolTableData = async (symbolId) => {
  const { data, message, success } = await getSymbolTableData({
    id: symbolId,
    realOfferId: lastPageData
  })
  if (success) {
    symbolExchangeTableData.value = data
  } else {
    window.$message.error(message)
  }
}

const handleSelectSymbolTabs = (value) => {
  getRealOfferSymbolTableData(value)
}

const logTableRowClassName = (row) => {
  if (row.profitFlag === 1) {
    return 'green'
  }
  return 'red'
}

const handleLogTablePageChange = (page) => {
  logTablePagination.page = page
  searchLogTableData()
}

const handleLogTablePageSizeChange = (pageSize) => {
  logTablePagination.page = 1
  logTablePagination.pageSize = pageSize
  searchLogTableData()
}

const searchLogTableData2 = async () => {
  logTableLoading2.value = true
  //获取数据
  const { data, message, success } = await getLogTablePage2({
    page: logTablePagination2.page,
    size: logTablePagination2.pageSize,
    id: lastPageData
  })
  if (success) {
    const { total, records } = data
    logTableData2.value = records
    logTablePagination2.itemCount = total
  } else {
    window.$message.error(message)
  }
  logTableLoading2.value = false
}

const handleLogTablePageChange2 = (page) => {
  logTablePagination2.page = page
  searchLogTableData2()
}

const handleLogTablePageSizeChange2 = (pageSize) => {
  logTablePagination2.page = 1
  logTablePagination2.pageSize = pageSize
  searchLogTableData2()
}

const handleAdjustment = async (row) => {
  currentSymboleName.value = row.symbolName
  currentSymboleId.value = row.id
}

const saveAdjustment = async () => {

}
</script>

<style scoped>

.n-tabs .n-tabs-tab-pad {
  --n-tab-gap: 0px;
}

:deep(.red td) {
  color: rgba(255, 0, 0, 0.75) !important;
}

:deep(.green td) {
  color: rgb(108, 173, 100) !important;
}
</style>
