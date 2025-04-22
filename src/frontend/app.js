const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const output = require('./output')

app.use(express.static(path.join(__dirname, '../../public')))
app.use('/output', output)

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})

server.listen(process.env.SERVER_PORT || 8080);