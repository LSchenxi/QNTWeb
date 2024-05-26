<template>
  <div ref='container' overflow-auto style='height: 100%'>
    <n-spin :show='pageGetLoading' min-h-120 >
      <div flex items-center bg-white min-h-50>
        <n-breadcrumb ml-20 hidden sm:block>
          <n-breadcrumb-item class='cursor-pointer' style='font-size: 17px' @click='handleBack'>
            <component :is='getIcon("MaterialSymbolsChevronLeft")' />
            返回实盘列表
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['1']">
            <n-collapse-item name='1'>
              <template #header>
                <n-text style='font-weight: 600;font-size: 17px'>
                  参数设置
                </n-text>
              </template>
              <n-form ref='form' label-placement='left' label-width='auto'>
                <n-form-item label='实盘名称' path='name' style='width: 50%'>
                  <n-input v-model:value='realOfferBaseModel.name' disabled />
                </n-form-item>
                <n-form-item label='K线周期' path='klinePeriod' style='width: 50%'>
                  <n-input-group style='width: 100%'>
                    <n-input-number style='width: 90%' v-model:value='realOfferBaseModel.klinePeriod' placeholder='K线周期'
                                    :min='1' />
                    <n-select style='width: 10%' :options='kLineUnitOptions' v-model:value='realOfferBaseModel.klineUnit' />
                  </n-input-group>
                </n-form-item>
                <n-form-item label='策略参数' path='strategyId' style='width: 50%'>
                  <n-collapse id='innerCollapse' :default-expanded-names="['cs']">
                    <n-collapse-item title='参数' name='cs'>
                      <n-form ref='form' label-placement='left'>
                        <n-form-item label='执行策略' path='strategyId'>
                          <n-select :options='strategyOptions' v-model:value='realOfferBaseModel.strategyId'
                                    placeholder='请选择执行策略' />
                        </n-form-item>
                      </n-form>
                    </n-collapse-item>
                    <n-collapse-item title='交易所类' name='exchangeType' style='margin-top: 10px'>
                      <span>策略没有参数</span>
                    </n-collapse-item>
                  </n-collapse>
                </n-form-item>
                <n-form-item label='操作按钮' path='buttonItems' style='width: 50%' :label-style='buttonScc'>
                  <n-input-group style='width: 100%'>
                    <n-button ghost type='success' size='small' style='margin-right: 15px' :loading='realOfferBaseSaveLoading' @click='saveRealOfferBase'>更新参数</n-button>
                    <!--                  <n-button ghost type='primary' size='small' style='margin-right: 15px'>导出参数</n-button>-->
                    <!--                  <n-button ghost type='error' size='small' style='margin-right: 15px'>导入参数</n-button>-->
                  </n-input-group>
                </n-form-item>
              </n-form>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse>
            <n-collapse-item name='2'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  策略交互
                </n-text>
              </template>
              <div pb-20>
                <n-grid :x-gap="8" :cols="8">
                  <n-grid-item :offset="2" :span='4'>
                    <n-input-group>
                      <n-input v-model:value='strategyCommand' placeholder='执行' />
                      <n-button type="primary">
                        执行
                      </n-button>
                    </n-input-group>
                  </n-grid-item>
                </n-grid>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse>
            <n-collapse-item name='3'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  自动交易配置
                </n-text>
              </template>
              <n-form ref='form' label-placement='left' label-width='160px'>
                <n-form-item label='自动交易开关' path='autoTrading' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.autoTrading'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='基础仓位价值' path='basicWarehouseValue' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.basicWarehouseValue' placeholder='请输入基础仓位价值'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最大持仓个数' path='maxHoldingNumber' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.maxHoldingNumber' placeholder='请输入最大持仓个数'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='换币保护期(H)' path='changeSymbolProtectPeriod' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.changeSymbolProtectPeriod' placeholder='请输入换币保护期'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='换币观察期(H)' path='maxHoldingNumber' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.changeSymbolWatchPeriod' placeholder='请输入换币观察期'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='换币观察最大个数' path='maxChangeSymbolWatchNumber' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.maxChangeSymbolWatchNumber' placeholder='请输入换币观察最大个数'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='换币沉默期(H)' path='changeSymbolSilentPeriod' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.changeSymbolSilentPeriod' placeholder='请输入换币沉默期'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='换币最小月化' path='changeSymbolMinMonthly' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.changeSymbolMinMonthly' placeholder='请输入换币最小月化'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='选币过滤(暴涨暴跌)' path='symbolFilter' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.symbolFilter'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='乖离率均线周期' path='biasAveragePeriod' v-if='realOfferAutoTradeModel.symbolFilter' style='width: 50%'>
                  <n-select :options='biasAveragePeriodOptions' v-model:value='realOfferAutoTradeModel.biasAveragePeriod'
                            placeholder='请选择乖离率均线周期' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最小乖离率' path='minBias' v-if='realOfferAutoTradeModel.symbolFilter' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.minBias' placeholder='请输入最小乖离率'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最大乖离率' path='maxBias' v-if='realOfferAutoTradeModel.symbolFilter' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.maxBias' placeholder='请输入最大乖离率'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='自动加仓' path='autoAddWarehouse' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.autoAddWarehouse'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='加仓比例' path='addRatio' v-if='realOfferAutoTradeModel.autoAddWarehouse' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.addRatio' placeholder='请输入加仓比例'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='加仓最大倍数' path='maxAddMultiple' v-if='realOfferAutoTradeModel.autoAddWarehouse' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.maxAddMultiple' placeholder='请输入加仓最大倍数'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='自动减仓' path='autoReduceWarehouse' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.autoReduceWarehouse'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='减仓比例' path='reduceRatio' v-if='realOfferAutoTradeModel.autoReduceWarehouse' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.reduceRatio' placeholder='请输入减仓比例'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='清仓保护' path='clearWarehouseProtect' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.clearWarehouseProtect'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最大清仓保护个数' path='maxClearProtectNumber' v-if='realOfferAutoTradeModel.clearWarehouseProtect' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.maxClearProtectNumber' placeholder='请输入最大清仓保护个数'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最小持仓盈亏率' path='minHoldingPhaseRate' v-if='realOfferAutoTradeModel.clearWarehouseProtect' style='width: 50%'>
                  <n-input-number v-model:value='realOfferAutoTradeModel.minHoldingPhaseRate' placeholder='请输入最小持仓盈亏率'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最大持仓包含清仓保护' path='maxHoldingContainClearProtect' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferAutoTradeModel.maxHoldingContainClearProtect'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='操作按钮' path='buttonItems' style='width: 50%' :label-style='buttonScc'>
                  <n-input-group style='width: 100%'>
                    <n-button ghost type='success' size='small' style='margin-right: 15px' :loading='realOfferAutoTradeSaveLoading' @click='saveRealOfferAutoTrade'>保存交易配置</n-button>
                  </n-input-group>
                </n-form-item>
              </n-form>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse>
            <n-collapse-item name='4'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  交易参数配置
                </n-text>
              </template>
              <n-form ref='form' label-placement='left' label-width='150px'>
                <n-form-item label='初始资产(U)' path='initialAsset' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.initialAsset' placeholder='请输入初始资产'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='提币资产(U)' path='extractAsset' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.extractAsset' placeholder='请输入提币资产'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='单笔最小交易额' path='minTransactionOne' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.minTransactionOne' placeholder='请输入单笔最小交易额'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='单笔最大交易额' path='maxTransactionOne' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.maxTransactionOne' placeholder='请输入单笔最大交易额'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='套利溢价' path='arbitragePremium' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.arbitragePremium' placeholder='请输入套利溢价'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='初始均衡溢价' path='initialEquilibriumPremium' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.initialEquilibriumPremium' placeholder='请输入初始均衡溢价'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='最大均衡亏损溢价' path='maxEquilibriumLossPremium' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.maxEquilibriumLossPremium' placeholder='请输入最大均衡亏损溢价'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='挂单开关' path='orderFlag' style='width: 50%'>
                  <n-select :options='switchOptions' v-model:value='realOfferTradeParamModel.orderFlag'
                            placeholder='请选择开关状态' style='width: 100%'/>
                </n-form-item>
                <n-form-item label='单笔最大挂单量(U)' path='maxPendingOrder' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.maxPendingOrder' placeholder='请输入单笔最大挂单量'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='挂单距离' path='orderDistance' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.orderDistance' placeholder='请输入挂单距离'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='过滤同名币最大差价' path='maxDiffSameSymbolFilter' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.maxDiffSameSymbolFilter' placeholder='请输入过滤同名币最大差价'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='购买平台抵扣币(U)' path='platformDeductionCoin' style='width: 50%'>
                  <n-input-number v-model:value='realOfferTradeParamModel.platformDeductionCoin' placeholder='请输入购买平台抵扣币(U)'  style='width: 100%'/>
                </n-form-item>
                <n-form-item label='操作按钮' path='buttonItems' style='width: 50%' :label-style='buttonScc'>
                  <n-input-group style='width: 100%'>
                    <n-button ghost type='success' size='small' style='margin-right: 15px' :loading='realOfferTradeParamSaveLoading' @click='saveRealOfferTradeParam'>保存交易参数</n-button>
                  </n-input-group>
                </n-form-item>
              </n-form>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse @item-header-click="handleAddCurrency">
            <n-collapse-item name='5'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  批量增删
                </n-text>
              </template>
              <div pb-20>
                <n-transfer
                    ref="transfer"
                    v-model:value="addCurrencyTransferValue"
                    :options="addCurrencyTransferOption"
                    :source-title='"未添加币"'
                    :target-title='"已添加币"'
                    :render-source-label="handleRenderSourceLabel"
                    :render-target-label="handleRenderSourceLabel"
                    style='margin: auto' source-filterable target-filterable virtual-scroll >
                </n-transfer>
                <n-form ref='form' label-placement='top' label-width='left'>
                  <n-form-item label='操作按钮' path='buttonItems' style='width: 50%' :label-style='buttonScc'>
                    <n-input-group style='width: 100%'>
                      <n-button ghost type='success' size='small' style='margin-right: 15px' :loading='addSymbolSaveLoading' @click='saveAddRealOfferSymbol'>保存币种变更</n-button>
                    </n-input-group>
                  </n-form-item>
                </n-form>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse @item-header-click="handleStartCurrency">
            <n-collapse-item name='5'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  批量启停
                </n-text>
              </template>
              <div pb-20>
                <n-transfer
                    ref="transfer"
                    v-model:value="startCurrencyTransferValue"
                    :options="startCurrencyTransferOption"
                    :source-title='"已添加币"'
                    :target-title='"已启动币"'
                    style='margin: auto' source-filterable target-filterable virtual-scroll >
                </n-transfer>
                <n-form ref='form' label-placement='top' label-width='left'>
                  <n-form-item label='操作按钮' path='buttonItems' style='width: 50%' :label-style='buttonScc'>
                    <n-input-group style='width: 100%'>
                      <n-button ghost type='success' size='small' style='margin-right: 15px' :loading='startSymbolSaveLoading' @click='saveStartRealOfferSymbol'>保存币种变更</n-button>
                    </n-input-group>
                  </n-form-item>
                </n-form>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
      <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
        <div flex-col wh-full min-w-1080 p-20 bg-white>
          <n-collapse :default-expanded-names="['10']">
            <n-collapse-item name='10'>
              <template #header>
                <n-text style='font-weight: 600; font-size: 17px'>
                  实盘控制
                </n-text>
              </template>
              <div pb-20>
                <div style='margin-top: 15px'>
                  <n-button ghost type='warning' size='small' style='margin-right: 15px' @click='handleBatchAdjustment'>批量调仓</n-button>
                  <n-button ghost type='warning' size='small' style='margin-right: 15px'>数据清理</n-button>
                  <n-button ghost type='warning' size='small' style='margin-right: 15px'>清理残币</n-button>
                  <n-button ghost type='error' size='small' style='margin-right: 15px'>优雅停止</n-button>
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
    </n-spin>
    <n-drawer v-model:show='symbolClickDrawer' :auto-focus='false' :close-on-esc='false' :mask-closable='false'
              width='40%'>
      <n-drawer-content closable>
        <template #header>币-交易所配置（{{currentSymboleName}}）</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type='primary' :loading='symbolClickSaveLoading' @click='saveSymbolClick'>保存</n-button>
            </div>
          </div>
        </template>
        <div flex-col h-full class='cus-scroll' style='display: flex'>
          <div ref='tableContainer'>
            <n-data-table
                :columns="exchangeColumns"
                :data="exchangeData"
                :row-key="rowKey"
                :row-class-name="exchangeTableRowClassName"
                :default-checked-row-keys = "currentSymbolExchangeOldData"
                v-model:checked-row-keys="currentSymbolExchangeData"
            />
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show='batchAdjustmentDrawer' :auto-focus='false' :close-on-esc='false' :mask-closable='false'
              width='40%'>
      <n-drawer-content closable>
        <template #header>批量调仓</template>
        <template #footer>
          <div flex flex-justify-end w-full>
            <div flex flex-gap-12>
              <n-button type='primary' :loading='batchAdjustmentSaveLoading' @click='saveBatchAdjustment'>保存</n-button>
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
import { ref } from 'vue'
import {
  getAllSymbol,
  getRealOffer,
  getRealOfferSymbol,
  updateRealOfferBase,
  updateRealOfferAutoTrade,
  updateRealOfferTradeParam,
  getCurrentSymbolExchangeList,
  getAllExchange,
  updateSymbolExchange,
  updateAddSymbol,
  getRealOfferAllSymbol,
  getRealOfferStartingSymbol,
  updateStartSymbol
} from '../../api/realOfferDetail/realOfferDetail'
import { getStrategyList } from '../../api/realOffer/realOffer'
import { NButton, NSpace } from 'naive-ui'
let lastPageData = null
const pageGetLoading = ref(false)
const realOfferBaseModel = ref({
  id: null,
  name: null,
  serverId: null,
  strategyId: null,
  klinePeriod: null,
  klineUnit: null,
})
const realOfferAutoTradeModel = ref({
  id: null,
  autoTrading: null,
  basicWarehouseValue: null,
  maxHoldingNumber:null,
  changeSymbolProtectPeriod: null,
  changeSymbolWatchPeriod: null,
  maxChangeSymbolWatchNumber: null,
  changeSymbolSilentPeriod: null,
  changeSymbolMinMonthly: null,
  symbolFilter: null,
  biasAveragePeriod: null,
  minBias: null,
  maxBias: null,
  autoAddWarehouse: null,
  addRatio: null,
  maxAddMultiple: null,
  autoReduceWarehouse: null,
  reduceRatio: null,
  clearWarehouseProtect: null,
  maxClearProtectNumber: null,
  minHoldingPhaseRate: null,
  maxHoldingContainClearProtect: null,
})
const realOfferTradeParamModel = ref({
  id: null,
  initialAsset: null,
  extractAsset: null,
  minTransactionOne: null,
  maxTransactionOne: null,
  arbitragePremium: null,
  initialEquilibriumPremium: null,
  maxEquilibriumLossPremium: null,
  orderFlag: null,
  maxPendingOrder: null,
  orderDistance: null,
  maxDiffSameSymbolFilter: null,
  platformDeductionCoin: null
})
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
const strategyOptions = ref([])
const switchOptions = [
  {
    label: '开',
    value: 1
  },
  {
    label: '关',
    value: 0
  }
]
const biasAveragePeriodOptions = [
  {
    label: '4H',
    value: '4H'
  },
  {
    label: '8H',
    value: '8H'
  },
  {
    label: '1D',
    value: '1D'
  }
]
const buttonScc = reactive({
  color: 'white'
})
const strategyCommand = ref()
const realOfferBaseSaveLoading = ref(false)
const realOfferAutoTradeSaveLoading = ref(false)
const realOfferTradeParamSaveLoading = ref(false)
const addCurrencyTransferValue = ref([])
const addCurrencyTransferOption = ref([])
const addSymbolSaveLoading = ref(false)
const currentSymboleName = ref()
const currentSymboleId = ref()
const exchangeColumns = [
  {
    type: 'selection'
    /*disabled (row) {
      return currentSymbolExchangeOldData.value.includes(row.id)
    }*/
  },
  {
    title: '交易所',
    key: 'exchangeNameWeb'
  }
]
const exchangeData = ref([])
const currentSymbolExchangeOldData = ref([])
const currentSymbolExchangeData = ref([])
const symbolClickDrawer = ref(false)
const addCurrencySaveLoading = ref(false)
const symbolClickSaveLoading = ref(false)
const startCurrencyTransferValue = ref([])
const startCurrencyTransferOption = ref([])
const startSymbolSaveLoading = ref(false)
const batchAdjustmentDrawer = ref(false)
const batchAdjustmentSaveLoading = ref(false)
onMounted(() => {
  if (!useRoute().query || !useRoute().query.realOfferId) {
    window.$message.error('非法跳转')
    router.push('realOffer')
  }
  lastPageData = useRoute().query.realOfferId
  getRealOfferById()
  getStrategySelectList()
  getAllSymbolList()
})

const handleBack = () => {
  router.push('realOffer')
}

function getIcon(meta) {
  return renderIcon(meta, { size: 23 })
}

const getRealOfferById = async () => {
  const { data, message, success } = await getRealOffer({
    realOfferId: lastPageData
  })
  if (success) {
    realOfferBaseModel.value = data
    realOfferAutoTradeModel.value = data
    realOfferTradeParamModel.value = data
  } else {
    window.$message.error('获取数据失败', message)
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

const clearRealOfferBaseModel = () => {
  Object.keys(realOfferBaseModel.value).forEach((key) => {
    realOfferBaseModel.value[key] = null
  })
}

const clearRealOfferAutoTradeModel = () => {
  Object.keys(realOfferAutoTradeModel.value).forEach((key) => {
    realOfferAutoTradeModel.value[key] = null
  })
}

const clearRealOfferTradeParamModel = () => {
  Object.keys(realOfferTradeParamModel.value).forEach((key) => {
    realOfferTradeParamModel.value[key] = null
  })
}

const saveRealOfferBase = async () => {
  realOfferBaseSaveLoading.value = true
  const data = toRaw(realOfferBaseModel.value)
  const { message, success } = await updateRealOfferBase(data)
  if (success) {
    window.$message.success("更新成功")
    clearRealOfferBaseModel()
    await getRealOfferById()
  } else {
    window.$message.error(message)
  }
  realOfferBaseSaveLoading.value = false
}

const saveRealOfferAutoTrade = async () => {
  realOfferAutoTradeSaveLoading.value = true
  const data = toRaw(realOfferAutoTradeModel.value)
  const { message, success } = await updateRealOfferAutoTrade(data)
  if (success) {
    window.$message.success("更新成功")
    clearRealOfferAutoTradeModel()
    await getRealOfferById()
  } else {
    window.$message.error(message)
  }
  realOfferAutoTradeSaveLoading.value = false
}

const saveRealOfferTradeParam = async () => {
  realOfferTradeParamSaveLoading.value = true
  const data = toRaw(realOfferTradeParamModel.value)
  const { message, success } = await updateRealOfferTradeParam(data)
  if (success) {
    window.$message.success("更新成功")
    clearRealOfferTradeParamModel()
    await getRealOfferById()
  } else {
    window.$message.error(message)
  }
  realOfferTradeParamSaveLoading.value = false
}

//获取所有币数据
const getAllSymbolList = async () => {
  const { data, message, success } = await getAllSymbol()
  if (success) {
    addCurrencyTransferOption.value = data
  } else {
    window.$message.error(message)
  }
}

const handleAddCurrency = async (item) => {
  if(item.expanded){
    pageGetLoading.value = true
    //clearAddCurrencyModel()
    //获取增加币穿梭框value数据
    getAddCurrencyTransferValue(lastPageData)
  }
}

const getAddCurrencyTransferValue = async (id) => {
  //获取当前实盘币数据
  const params = {
    id: id
  }
  const { data, message, success } = await getRealOfferSymbol(params)
  if (success) {
    addCurrencyTransferValue.value = data
    pageGetLoading.value = false
  } else {
    window.$message.error(message)
  }
}

const handleRenderSourceLabel = (item) => {
  return h(
      NSpace,
      { justify: 'left' },
      {
        default: () => [
          h('span', item.option.status===1?{class:'symbolInExchangeWarning'}:null, item.option.label),
          h(
              NButton,
              {
                size: 'tiny',
                type: 'info',
                ghost: true,
                onClick: async (e) => {
                  e.stopPropagation()
                  handleSymbolClick(item)
                }
              },
              { default: () => '交易所配置' }
          )
        ]
      }
  )
}

const rowKey = (row) => {
  return row.id
}

//获取所有交易所数据
const getAllExchangeList = async (id) => {
  const params = {
    id: id
  }
  const { data, message, success } = await getAllExchange(params)
  if (success) {
    exchangeData.value = data
  } else {
    window.$message.error(message)
  }
}

const handleSymbolClick = async (item) => {
  symbolClickDrawer.value = true
  currentSymboleName.value = item.option.label
  currentSymboleId.value = item.option.value
  await getAllExchangeList(item.option.value)
  // 获取当前币的交易所信息
  const params = {
    symbolId: item.option.value,
    realOfferId: lastPageData
  }
  const { data, message, success } = await getCurrentSymbolExchangeList(params)
  if (success) {
    currentSymbolExchangeOldData.value = data
    currentSymbolExchangeData.value = data
  } else {
    window.$message.error(message)
  }
}

const exchangeTableRowClassName = (row) => {
  if(row.status === 1){
    return 'waringClass'
  }
  return ''
}

const saveSymbolClick = async () => {
  symbolClickSaveLoading.value = true
  let symbolExchangeModel = {}
  symbolExchangeModel.currentSymboleId = currentSymboleId.value
  symbolExchangeModel.currentSymbolExchangeData = currentSymbolExchangeData.value
  symbolExchangeModel.realOfferId = lastPageData
  const data = toRaw(symbolExchangeModel)
  const { message, success } = await updateSymbolExchange(data)
  if (success) {
    window.$message.success("更新成功")
  } else {
    window.$message.error(message)
  }
  symbolClickDrawer.value = false
  symbolClickSaveLoading.value =false
}

const saveAddRealOfferSymbol = async () => {
  addSymbolSaveLoading.value = true
  const params = {
    id:lastPageData,
    currencyListValue:addCurrencyTransferValue.value
  }
  const {message, success } = await updateAddSymbol(params)
  if(success){
    window.$message.success('操作成功')
    getRealOfferAllSymbolTransferValue(lastPageData)
    getRealOfferStartSymbolTransferValue(lastPageData)
  } else {
    window.$message.error(message)
  }
  addSymbolSaveLoading.value = false
}

const handleStartCurrency = async (item) => {
  if(item.expanded){
    pageGetLoading.value = true
    //获取当前实盘所有币列表
    await getRealOfferAllSymbolTransferValue(lastPageData)
    //获取当前实盘所有已启动的币列表
    await getRealOfferStartSymbolTransferValue(lastPageData)
    pageGetLoading.value = false
  }
}

const getRealOfferAllSymbolTransferValue = async (id) => {
  //获取当前实盘已添加币数据
  const params = {
    id: id
  }
  const { data, message, success } = await getRealOfferAllSymbol(params)
  if (success) {
    startCurrencyTransferOption.value = data
  } else {
    window.$message.error(message)
  }
}

const getRealOfferStartSymbolTransferValue = async (id) => {
  //获取当前实盘运行中币数据
  const params = {
    id: id
  }
  const { data, message, success } = await getRealOfferStartingSymbol(params)
  if (success) {
    startCurrencyTransferValue.value = data
  } else {
    window.$message.error(message)
  }
}


const saveStartRealOfferSymbol = async () => {
  startSymbolSaveLoading.value = true
  const params = {
    id:lastPageData,
    currencyListValue:startCurrencyTransferValue.value
  }
  const {message, success } = await updateStartSymbol(params)
  if(success){
    window.$message.success('操作成功')
  } else {
    window.$message.error(message)
  }
  startSymbolSaveLoading.value = false
}

const handleBatchAdjustment = async () => {

}

const saveBatchAdjustment = async () => {

}

</script>

<style scoped>
:deep(.waringClass td) {
  color: rgb(245, 185, 87) !important;
}
</style>
<style>
.symbolInExchangeWarning{
  color: #ffc11e;
}
</style>
