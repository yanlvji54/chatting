<template>
  <div class="container">
    <div class="left-panel">
      <a-card title="生成服务">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-statistic title="开启时间" :value="startTime" />
          </a-col>
          <a-col :span="12">
            <a-statistic title="时长" :value="duration" />
          </a-col>
        </a-row>

        <a-button type="primary" @click="generateLinks" style="margin-top: 16px"> 一键生成双链接 </a-button>

        <a-row :gutter="16" style="margin-top: 16px; display: flex; flex-direction: column;">
          <a-col :span="12">
            <a-statistic title="用户链接" :value="userLink" />
            <a-button type="primary" @click="copyToClipboard(userLink)" style="margin-left: 8px">复制</a-button>
          </a-col>
          <a-col :span="12">
            <a-statistic title="倾听师链接" :value="listenerLink" />
            <a-button type="primary" @click="copyToClipboard(listenerLink)" style="margin-left: 8px">复制</a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div class="right-panel">
      <a-card title="历史记录" style="margin-top: 16px">
        <a-table :columns="columns" :data-source="historyData" :pagination="false" :rowKey="record => record.id">
            <span slot="status" slot-scope="text, record">
              <a-tag :color="record.status === '已使用' ? 'green' : 'red'">
                {{ record.status }}
              </a-tag>
            </span>
            <span slot="audioLink" slot-scope="text, record">
              <a :href="record.audioLink" target="_blank">查看录音</a>
            </span>
            <span slot="actions" slot-scope="text, record">
              <a-button type="danger" @click="deleteItem(record.index, historyData)">删除</a-button>
            </span>
            <span slot="default" slot-scope="text, record">
              {{ record[column.key] }}
            </span>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Card, Row, Col, Statistic, Button, Table, Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export default {
  components: {
    'a-card': Card,
    'a-row': Row,
    'a-col': Col,
    'a-statistic': Statistic,
    'a-button': Button,
    'a-table': Table,
    'a-tag': Tag
  },
  setup() {
    const startTime = ref('2025年01月20日 18:00')
    const userLink = ref('---')
    const listenerLink = ref('---')

    const calculateDuration = () => {
      const now = dayjs()
      const targetDate = dayjs('2025-01-20')
      const diff = now.diff(targetDate)

      const durationObj = dayjs.duration(diff)

      return `${durationObj.days()}天${durationObj.hours()}小时`
    }

    const duration = computed(() => calculateDuration())

    // 从 /api/record/get 获取历史记录
    const historyData = ref([])
    const getHistoryData = async () => {
      const res = await fetch('/api/record/get')
      const data = await res.json()
      historyData.value = data.data
    }

    getHistoryData()

    const columns = ref([
      {
        title: '用户链接',
        dataIndex: 'userLink',
        key: 'userLink'
      },
      {
        title: '倾听师身份',
        dataIndex: 'listenerName',
        key: 'listenerName'
      },
      {
        title: '倾听师链接',
        dataIndex: 'listenerLink',
        key: 'listenerLink'
      },
      {
        title: '开启时间',
        dataIndex: 'startTime',
        key: 'startTime'
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '实际时长',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '使用状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: { customRender: 'status' },
      },
      {
        title: '录音链接',
        dataIndex: 'audioLink',
        key: 'audioLink',
        scopedSlots: { customRender: 'audioLink' },
      },
      {
        title: '操作',
        key: 'actions',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'actions' },
      }
    ])

    const generateLinks = async () => {
      // 使用 /api/record/generateLinks post方法生成链接
      const res = await fetch('/api/record/generateLinks', {
        method: 'POST',
        body: JSON.stringify({ userId: '123', listenerId: '456' })
      })
      const data = await res.json()
      userLink.value = data.userLink
      listenerLink.value = data.listenerLink

      getHistoryData()
    }

    const copyToClipboard = text => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log('复制成功:', text)
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }

    const downloadAudio = link => {
      // 创建一个隐藏的链接来下载文件
      const a = document.createElement('a')
      a.href = link
      a.download = link.split('/').pop() // 使用文件名作为下载名
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    const deleteItem = (index, dataArray) => {
      // 删除指定索引的项目
      dataArray.splice(index, 1)
    }

    return {
      startTime,
      duration,
      userLink,
      listenerLink,
      historyData,
      columns,
      generateLinks,
      copyToClipboard,
      downloadAudio,
      deleteItem
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
}

.left-panel {
  width: 500px; /* 固定宽度 */
  margin-right: 16px; /* 间距 */
}

.right-panel {
  flex: 1; /* 占据剩余空间 */
}
</style>
