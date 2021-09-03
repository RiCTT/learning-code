const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

app.get('/', (req, res) => {
  res.send('Hello Worsld!')
})

app.use('/static', express.static(__dirname + '/public', {
  cacheControl: false,
  etag: false,
  lastModified: false,
}))

// 协商缓存
// last-modified if-modified-since
// etag if-none-match
app.get('/test.txt', (req, res) => {
  const filePath = path.join(__dirname, './public/test.txt')
  const statObj = fs.statSync(filePath)
  // 拿出创建时间 1630568325991.0884
  const { ctime } = statObj
  const gmtTime = ctime.toGMTString()
  const ifModifiedSince = req.headers['if-modified-since']
  const ifNoneMatch = req.headers['if-none-match']
  const content = fs.readFileSync(filePath)
  const hash = crypto.createHash('md5').update(content).digest('base64')
  
  if (ifModifiedSince === gmtTime || ifNoneMatch === hash) {
    res.status(304)
    res.end()
    return
  }

  res.setHeader('ETag', hash)
  res.setHeader('Last-Modified', gmtTime)
  res.end(content)
})

// 强缓存
// Cache-Control
// Expires
app.get('/index', (req, res) => {
  // const filePath = path.join(__dirname, './public/index.html')
  // const filePath = path.join(__dirname, './public/test.js')
  const filePath = path.join(__dirname, './public/demo.jpg')
  const content = fs.readFileSync(filePath)

  // const expiresDate = new Date(Date.now() + 60 * 1000).toGMTString()
  // res.setHeader('Expires', expiresDate)
  // 60s之内不再向服务器请求,如果有代理服务器，同
  res.setHeader('Cache-Control', 'max-age=60,public')
  // 60s...，只允许客户端缓存
  // res.setHeader('Cache-Control', 'max-age=60,private')
  // // 向服务器发起请求，如果有ETag，Last-Modified，则走协商缓存
  // res.setHeader('Cache-Control', 'max-age=0')
  // // 当过期时，同服务器校验文件是否失效（过期），是，重新下载，否，使用缓存
  // res.setHeader('Cache-Control', 'max-age=100, must-revalidate')
  // // 本地缓存，但每次请求先跟服务器校验是否可以用缓存
  // res.setHeader('Cache-Control', 'no-cache')
  // // 啥都不用，直接拿服务器下载
  // res.setHeader('Cache-Control', 'no-store')


  res.end(content)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})