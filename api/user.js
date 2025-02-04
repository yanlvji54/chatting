const User = require('../server/models/User.js')

module.exports = async (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { name, email, age } = req.body
      const newUser = new User({ name, email, age })
      await newUser.save()
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'User created', user: newUser }))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else if (req.method === 'GET') {
    try {
      const users = (await User.find()) || []
      console.log(users)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(users))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, email, age } = req.body
      const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'User updated', user: updatedUser }))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      await User.findByIdAndDelete(id)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'User deleted' }))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else {
    next()
  }
}
