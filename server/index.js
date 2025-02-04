const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/yourdbname', {
      useNewUrlParser: true
      // 其他选项
    })
    console.log('MongoDB Connected')
  } catch (err) {
    console.error('Error connecting to MongoDB', err)
    process.exit(1)
  }
}

module.exports = connectDB
