const mongoose = require('mongoose')

const connectDB = async (req, res, next) => {
  // 检查 mongoose 的实际连接状态
  if (mongoose.connection.readyState === 1) {
    return next()
  }

  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/secretchatting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000
    })
    console.log('Mongoose connected to the database')

    conn.connection.on('error', err => {
      console.error('Mongoose connection error:', err)
    })

    conn.connection.on('disconnected', () => {
      console.log('Mongoose disconnected')
    })
  } catch (err) {
    console.error('Error connecting to MongoDB', err)
    process.exit(1)
  }
  next()
}

module.exports = connectDB
