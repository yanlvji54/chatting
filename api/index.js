const mongoose = require('mongoose')

let isConnected = false // 添加一个全局变量来跟踪连接状态

const connectDB = async (req, res, next) => {
  if (isConnected) {
    return next()
  }

  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/secretchatting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000
    })
    console.log('Mongoose connected to the database')
    isConnected = true // 更新连接状态

    conn.connection.on('error', err => {
      console.error('Mongoose connection error:', err)
    })

    conn.connection.on('disconnected', () => {
      console.log('Mongoose disconnected')
      isConnected = false // 断开连接时更新状态
    })
  } catch (err) {
    console.error('Error connecting to MongoDB', err)
    process.exit(1)
  }
  next()
}

module.exports = connectDB
