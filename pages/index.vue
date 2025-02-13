<template>
  <div class="page-wrapper">
    <header class="page-header">
      <img :src="logo" alt="logo" class="logo" />
      <h1 class="system-title">godan陪伴系列管理后台</h1>
    </header>
    <div class="container">
      <div class="left-panel">
        <a-card>
          <div class="card-title">生成服务</div>
          <div class="card-content">
            <a-row justify="center" style="width: 100%">
              <a-col :span="24">
                <div class="card-item">
                  <div class="card-label">开启时间</div>
                  <a-date-picker
                    v-model:value="startTime"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    style="width: 100%"
                  />
                </div>
              </a-col>
            </a-row>

            <a-row justify="center" style="width: 100%">
              <a-col :span="24">
                <div class="card-item">
                  <div class="card-label">时长</div>
                  <a-select v-model:value="duration" style="width: 100%">
                    <a-select-option value="30">30分钟</a-select-option>
                    <a-select-option value="45">45分钟</a-select-option>
                    <a-select-option value="60">60分钟</a-select-option>
                    <a-select-option value="90">90分钟</a-select-option>
                    <a-select-option value="120">120分钟</a-select-option>
                    <a-select-option value="180">180分钟</a-select-option>
                    <a-select-option value="240">240分钟</a-select-option>
                    <a-select-option value="300">300分钟</a-select-option>
                    <a-select-option value="360">360分钟</a-select-option>
                    <a-select-option value="420">420分钟</a-select-option>
                    <a-select-option value="480">480分钟</a-select-option>
                    <a-select-option value="540">540分钟</a-select-option>
                    <a-select-option value="600">600分钟</a-select-option>
                  </a-select>
                </div>
              </a-col>
            </a-row>

            <div class="button-wrapper">
              <a-button type="primary" @click="submitForm" style="width: 100%">一键生成双链接</a-button>
            </div>

            <div class="links-wrapper">
              <div class="link-item">
                <div class="link-content">
                  <a-statistic 
                    title="用户链接" 
                    :value="userLink" 
                    :value-style="{ fontSize: '16px', width: '100%' }" 
                  />
                  <img 
                    :src="copyIcon" 
                    alt="copy" 
                    class="copy-icon" 
                    @click="copyToClipboard(userLink)"
                  />
                </div>
              </div>
              <div class="link-item">
                <div class="link-content">
                  <a-statistic 
                    title="倾听师链接" 
                    :value="listenerLink" 
                    :value-style="{ fontSize: '16px', width: '100%' }" 
                  />
                  <img 
                    :src="copyIcon" 
                    alt="copy" 
                    class="copy-icon" 
                    @click="copyToClipboard(listenerLink)"
                  />
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      <div class="right-panel">
        <a-card title="历史记录">
          <a-table :columns="columns" :data-source="historyData" :pagination="false" :rowKey="record => record.id">
              <span slot="status" slot-scope="text, record">
                <a-tag :color="{
                  '已完成': 'green',
                  '未使用': 'red',
                  '使用中': 'blue'
                }[record.status]">
                  {{ record.status }}
                </a-tag>
              </span>
              <span slot="audioLink" slot-scope="text, record">
                <a :href="record.audioLink" target="_blank">查看录音</a>
              </span>
              <span slot="actions" slot-scope="text, record">
                <a-button type="danger" @click="deleteItem(record.id)">删除</a-button>
              </span>
              <span slot="default" slot-scope="text, record">
                {{ record[column.key] }}
              </span>
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Card, Row, Col, Statistic, Button, Table, Tag, DatePicker, Select, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import logo from '../assets/img/10.png'
import copyIcon from '../assets/img/13.png'

dayjs.extend(duration)

export default {
  components: {
    'a-card': Card,
    'a-row': Row,
    'a-col': Col,
    'a-statistic': Statistic,
    'a-button': Button,
    'a-table': Table,
    'a-tag': Tag,
    'a-date-picker': DatePicker,
    'a-select': Select,
    'a-select-option': Select.Option
  },
  setup() {
    const startTime = ref(null)
    const duration = ref('30')
    const userLink = ref('---')
    const listenerLink = ref('---')

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
      // Validate start time
      if (!startTime.value) {
        message.error('请选择开启时间')
        return
      }

      // Calculate end time based on duration
      const startTimeStr = dayjs(startTime.value).format('YYYY-MM-DD HH:mm:ss')
      const endTimeStr = dayjs(startTime.value)
        .add(Number(duration.value), 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')

      // Use /api/record/generateLinks post method to generate links
      const res = await fetch('/api/record/generateLinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: '123', 
          listenerId: '456',
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: duration.value
        })
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

    const deleteItem = async (id) => {
      // First send delete request
      await fetch('/api/record/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      })
      // Then remove from array after successful deletion
      getHistoryData()
    }

    const validateStartTime = () => {
      const currentTime = new Date()
      const selectedStartTime = new Date(startTime.value)

      if (selectedStartTime < currentTime) {
        message.error('Start time cannot be earlier than the current time.')
        startTime.value = ''
        return false
      }
      return true
    }

    const submitForm = async () => {
      if (validateStartTime()) {
        await generateLinks()
      }
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
      deleteItem,
      logo,
      copyIcon,
      validateStartTime,
      submitForm
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo {
  width: 40px;
  margin-right: 16px;
}

.system-title {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 500;
}

.container {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
}

.left-panel {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
}

.right-panel {
  flex: 1;
  height: 100%;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: rgb(1, 1, 1);
  text-align: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 24px;
}

.button-wrapper {
  margin: 16px 0;
  text-align: center;
  width: 100%;
}

.links-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.link-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.card-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.card-label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: rgb(1, 1, 1);
  text-align: center;
}

.link-content {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden;
}

.copy-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.copy-icon:hover {
  opacity: 0.8;
}
.ant-statistic-content {
  font-size: 16px;
}
</style>
