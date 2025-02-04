const mongoose = require('mongoose')

// 创建对话框记录的模型
const RecordSchema = new mongoose.Schema({
  userId: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  userLink: String,
  listenerName: String,
  listenerId: String,
  listenerLink: String,
  startTime: String,
  endTime: String,
  duration: String,
  status: String,
  id: String
})

const Record = mongoose.model('Record', RecordSchema)

module.exports = Record
