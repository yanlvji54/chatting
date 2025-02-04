<template>
  <div>
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

      <a-row :gutter="16" style="margin-top: 16px">
        <a-col :span="12">
          <a-statistic title="用户链接" :value="userLink" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="倾听师链接" :value="listenerLink" />
        </a-col>
      </a-row>
    </a-card>

    <a-card title="历史记录" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="historyData" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '已使用' ? 'green' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Card, Row, Col, Statistic, Button, Table, Tag } from 'ant-design-vue'

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
    const duration = ref('00:00:00')
    const userLink = ref('--- 6')
    const listenerLink = ref('--- 6')

    const historyData = ref([
      {
        key: '1',
        userLink: 'http://godan001user.cn',
        listenerName: '小张',
        listenerLink: 'http://godan001licener.cn',
        startTime: '2025.01.20 18:00',
        endTime: '2025.01.20 18:20',
        duration: '00:20:00',
        status: '已使用'
      },
      {
        key: '2',
        userLink: 'http://godan002user.cn',
        listenerName: '小张',
        listenerLink: 'http://godan002licener.cn',
        startTime: '2025.01.21 18:00',
        endTime: '2025.01.21 18:20',
        duration: '00:00:00',
        status: '未使用'
      },
      {
        key: '3',
        userLink: 'http://godan003user.cn',
        listenerName: '小张',
        listenerLink: 'http://godan003licener.cn',
        startTime: '2025.01.22 18:00',
        endTime: '2025.01.22 18:20',
        duration: '00:17:32',
        status: '已使用'
      },
      {
        key: '4',
        userLink: 'http://godan004user.cn',
        listenerName: '小张',
        listenerLink: 'http://godan004licener.cn',
        startTime: '2025.01.23 18:00',
        endTime: '2025.01.23 18:20',
        duration: '00:17:32',
        status: '已使用'
      }
    ])

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
        key: 'endTime'
      },
      {
        title: '实际时长',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: '使用状态',
        dataIndex: 'status',
        key: 'status'
      }
    ])

    const generateLinks = () => {
      // 这里可以添加生成链接的逻辑
      userLink.value = 'http://newuserlink.cn'
      listenerLink.value = 'http://newlistenerlink.cn'
    }

    return {
      startTime,
      duration,
      userLink,
      listenerLink,
      historyData,
      columns,
      generateLinks
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
