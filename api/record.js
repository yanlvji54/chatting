const crypto = require('crypto')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const mongoose = require('mongoose')
// 对话框记录的增删改查
const Record = require('../server/models/Record.js')

// 设置 Mongoose 选项
mongoose.set('useFindAndModify', false)

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

async function addRecord(req, res) {
  try {
    const { userId, content, userLink, listenerName, listenerId, listenerLink, startTime, endTime, duration, status, id } = req.body
    const newRecord = new Record({ userId, content, userLink, listenerName, listenerId, listenerLink, startTime, endTime, duration, status, id })
    await newRecord.save()
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Record created', record: newRecord }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

async function updateRecord(req, res) {
  try {
    const { userId, content, userLink, listenerName, listenerId, listenerLink, startTime, endTime, duration, status, id } = req.body
    if (!id) {
      return res.status(400).json({ error: 'id is required' })
    }
    const record = await Record.findOne({id})
    if (!record) {
      return res.status(400).json({ error: 'Record not found' })
    }
    // userId, content, userLink, listenerName, listenerId, listenerLink, startTime, endTime, duration, status 如果哪个数据有值，就更新哪个数据
    const updateData = {}
    if (userId) updateData.userId = userId
    if (content) updateData.content = content
    if (userLink) updateData.userLink = userLink
    if (listenerName) updateData.listenerName = listenerName
    if (listenerId) updateData.listenerId = listenerId
    if (listenerLink) updateData.listenerLink = listenerLink
    if (startTime) updateData.startTime = startTime
    if (endTime) updateData.endTime = endTime
    if (duration) updateData.duration = duration
    if (status) updateData.status = status
    if (masterConnected) updateData.masterConnected = masterConnected
    
    const updatedRecord = await Record.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true }
    )
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Record updated', record: updatedRecord }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

async function deleteRecord(req, res) {
  try {
    const { id } = req.body
    await Record.findOneAndDelete({ id })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Record deleted' }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

async function downloadRecord(req, res) {
  try {
    const { id } = req.query
    const record = await Record.findById(id)
    if (record) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Record downloaded', record }))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Record not found' }))
    }
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

async function generateLinks(req, res) {
  try {
    const { userId, startTime, endTime, duration } = req.body

    // Generate a random room ID
    const roomId = crypto.randomBytes(8).toString('hex')

    // Generate user link using roomId
    const userLink = `https://118.25.132.79/?roomId=${roomId}&customer=1`

    // Find available listeners (using placeholder data)
    const listeners = [{
      id: '123',
      name: '可可'
    }, {
      id: '456',
      name: '小明'
    }, {
      id: '789',
      name: '小红'
    }, {
      id: '101',
      name: '阿泽'
    }, {
      id: '102',
      name: '贝贝'
    }]
    
    const listener = listeners[Math.floor(Math.random() * listeners.length)]
    const listenerId = listener.id

    // Generate listener link using roomId
    const listenerLink = `https://118.25.132.79/?roomId=${roomId}&master=1`

    // Create a new record
    const newRecord = new Record({
      id: roomId, // Use roomId as the record ID
      userId: userId,
      content: '',
      createdAt: new Date(),
      userLink: userLink,
      listenerName: listener.name,
      listenerId,
      listenerLink: listenerLink,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      status: '未使用'
    })
    await newRecord.save()

    // Return the generated links and record ID
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      message: 'Links generated', 
      userLink, 
      listenerLink,
      listenerId,
      startTime,
      endTime,
      actualEndTime: '',
      id: roomId // Include the room ID in the response
    }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

async function getRecord(req, res) {
  try {
    const { id } = req.body
    const record = await Record.find({id})
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(record))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message, record: [] }))
  }
}

async function getAllRecord(req, res) {
  try {
    const records = await Record.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Records fetched', data: records.reverse() }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

// Upload audio recording
async function uploadRecording(req, res) {
  try {
    const { id } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Update the record with the file path
    const updatedRecord = await Record.findByIdAndUpdate(id, { recordingPath: file.path }, { new: true })

    res.status(200).json({ message: 'Recording uploaded', record: updatedRecord })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Download audio recording
async function downloadRecording(req, res) {
  try {
    const { id } = req.query
    const record = await Record.findById(id)

    if (!record || !record.recordingPath) {
      return res.status(404).json({ error: 'Recording not found' })
    }

    res.download(record.recordingPath)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function updateActualEndTime(req, res) {
  try {
    const { id, actualEndTime } = req.body;
    
    // Update the record with the actual end time
    const updatedRecord = await Record.findByIdAndUpdate(
      id, 
      { actualEndTime }, 
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Actual end time updated', record: updatedRecord });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { id, status } = req.body;
    
    // Update the record with the new status
    const updatedRecord = await Record.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Status updated', record: updatedRecord });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = async (req, res, next) => {
  console.log('record.js', req.method, req.url)

  // Use CORS middleware
  const corsOptions = {
    origin: '*', // Allow all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }
  cors(corsOptions)(req, res, async () => {
    if (req.method === 'POST' && req.url === '/add') {
      await addRecord(req, res)
    } else if (req.method === 'POST' && req.url === '/generateLinks') {
      await generateLinks(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/download')) {
      await downloadRecord(req, res)
    } else if (req.method === 'GET' && req.url === '/get') {
      await getAllRecord(req, res)
    } else if (req.method === 'POST' && req.url === '/getRecord') {
      await getRecord(req, res)
    } else if (req.method === 'POST' && req.url === '/update') {
      await updateRecord(req, res)
    } else if (req.method === 'POST' && req.url === '/delete') {
      await deleteRecord(req, res)
    } else if (req.method === 'POST' && req.url === '/uploadRecording') {
      upload.single('recording')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message })
        }
        await uploadRecording(req, res)
      })
    } else if (req.method === 'GET' && req.url.startsWith('/downloadRecording')) {
      await downloadRecording(req, res)
    } else if (req.method === 'POST' && req.url === '/updateActualEndTime') {
      await updateActualEndTime(req, res)
    } else if (req.method === 'POST' && req.url === '/updateStatus') {
      await updateStatus(req, res)
    } else {
      next()
    }
  })
}

