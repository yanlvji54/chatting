const crypto = require('crypto')

// 对话框记录的增删改查
const Record = require('../server/models/Record.js')

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
    const { id, userId, content } = req.body
    const updatedRecord = await Record.findByIdAndUpdate(id, { userId, content }, { new: true })
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
    await Record.findByIdAndDelete(id)
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
      res.end(JSON.stringify(record))
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
    const { userId, listenerId } = req.body

    // 生成随机8位哈希
    const randomHash = crypto.randomBytes(4).toString('hex')

    // 生成用户链接
    const userLinkHash = crypto.createHash('md5').update(`user-${randomHash}`).digest('hex').slice(0, 8)
    const userLink = `http://example.com/user/${userLinkHash}`

    // 生成专家链接
    const listenerLinkHash = crypto.createHash('md5').update(`listener-${randomHash}`).digest('hex').slice(0, 8)
    const listenerLink = `http://example.com/listener/${listenerLinkHash}`

    // 创建新的记录
    const newRecord = new Record({
      userId,
      listenerId,
      userLink,
      listenerLink
      // 其他字段可以根据需要添加
    })
    await newRecord.save()

    // 返回生成的链接
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ userLink, listenerLink }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

module.exports = async (req, res, next) => {
  if (req.method === 'POST' && req.url === '/api/record/add') {
    await addRecord(req, res)
  } else if (req.method === 'POST' && req.url === '/api/record/generateLinks') {
    await generateLinks(req, res)
  } else if (req.method === 'GET' && req.url.startsWith('/api/record/download')) {
    await downloadRecord(req, res)
  } else if (req.method === 'GET') {
    try {
      const records = (await Record.find()) || []
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(records))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else if (req.method === 'POST' && req.url === '/api/record/update') {
    await updateRecord(req, res)
  } else if (req.method === 'POST' && req.url === '/api/record/delete') {
    await deleteRecord(req, res)
  } else {
    next()
  }
}
