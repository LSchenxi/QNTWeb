<template>
  <n-dropdown
    :show="show"
    :options="options"
    :x="x"
    :y="y"
    placement="bottom-start"
    @clickoutside="handleHideDropdown"
    @select="handleSelect"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'

import { useTagsStore } from '@/store'
import { renderIcon } from '@/utils'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentPath: {
    type: String,
    default: ''
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:show'])

const tagsStore = useTagsStore()

const options = computed(() => [
  {
    label: '重新加载',
    key: 'reload',
    disabled: props.currentPath !== tagsStore.activeTag,
    icon: renderIcon('refresh', { size: '14px' })
  },
  {
    label: '关闭',
    key: 'close',
    disabled: tagsStore.tags.length <= 1,
    icon: renderIcon('close', { size: '14px' })
  },
  {
    label: '关闭其他',
    key: 'close-other',
    disabled: tagsStore.tags.length <= 1,
    icon: renderIcon('arrow-expand-horizontal', { size: '14px' })
  },
  {
    label: '关闭左侧',
    key: 'close-left',
    disabled: tagsStore.tags.length <= 1 || props.currentPath === tagsStore.tags[0].path,
    icon: renderIcon('arrow-expand-left', { size: '14px' })
  },
  {
    label: '关闭右侧',
    key: 'close-right',
    disabled: tagsStore.tags.length <= 1 || props.currentPath === tagsStore.tags[tagsStore.tags.length - 1].path,
    icon: renderIcon('arrow-expand-right', { size: '14px' })
  }
])

const route = useRoute()
const actionMap = new Map([
  [
    'reload',
    () => {
      tagsStore.reloadTag(route.path, route.meta?.keepAlive)
    }
  ],
  [
    'close',
    () => {
      tagsStore.removeTag(props.currentPath)
    }
  ],
  [
    'close-other',
    () => {
      tagsStore.removeOther(props.currentPath)
    }
  ],
  [
    'close-left',
    () => {
      tagsStore.removeLeft(props.currentPath)
    }
  ],
  [
    'close-right',
    () => {
      tagsStore.removeRight(props.currentPath)
    }
  ]
])

function handleHideDropdown() {
  emit('update:show', false)
}

function handleSelect(key) {
  const actionFn = actionMap.get(key)
  actionFn && actionFn()
  handleHideDropdown()
}
</script>
