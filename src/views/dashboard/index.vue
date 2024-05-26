<template>
  <div ref='container' overflow-auto style='height: 100%'>
    <div flex-row flex-gap-20 p-20 style='padding-bottom: 0px'>
      <n-grid x-gap='2' :cols='2'>
        <n-gi :span='1' flex-gap-20 pl-20 pt-20 pr-20>
          <div flex-col wh-full p-20 bg-white>
            <n-grid x-gap='2' :cols='2'>
              <n-gi :span='1'>
                策略
              </n-gi>
              <n-gi :span='1'>
                交易所
              </n-gi>
            </n-grid>
            <n-grid x-gap='2' :cols='2'>
              <n-gi :span='1'>
                实盘
              </n-gi>
              <n-gi :span='1'>
                服务器
              </n-gi>
            </n-grid>
          </div>
        </n-gi>
        <n-gi :span='1' flex-gap-20 pt-20 pr-20>
            <div flex-col wh-full p-20 bg-white style='display: flex;'>
              <div>
                <n-button ghost type='success' size='small' style='margin-right: 15px'>一键停止实盘</n-button>
                <n-button ghost type='success' size='small' style='margin-right: 15px'>一键运行实盘</n-button>
                <n-button ghost type='success' size='small'>一键参数配置</n-button>
              </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
</style>
